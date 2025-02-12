import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, ReplaySubject } from 'rxjs';

import { Dataset } from '~/models';
import { LabState } from '~/store';

export type UnlockStatus = 'available' | 'locked' | 'researched';

@Component({
  selector: 'lab-tech-picker',
  templateUrl: './tech-picker.component.html',
  styleUrls: ['./tech-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechPickerComponent {
  @Output() selectIds = new EventEmitter<string[] | null>();

  selectAllCtrl = new FormControl(false);

  data$ = new ReplaySubject<Dataset>(1);
  selection$ = new ReplaySubject<string[]>(1);
  status$: Observable<Record<UnlockStatus, string[]>> = combineLatest([
    this.selection$,
    this.data$,
  ]).pipe(
    map(([selection, data]) => {
      const set = new Set(selection);
      const researched = selection;
      const available: string[] = [];
      const locked: string[] = [];
      for (const id of data.technologyIds) {
        if (!set.has(id)) {
          const tech = data.technologyEntities[id];

          if (
            tech.prerequisites == null ||
            tech.prerequisites.every((p) => set.has(p))
          ) {
            available.push(id);
          } else {
            locked.push(id);
          }
        }
      }

      return { available, locked, researched };
    })
  );
  vm$ = combineLatest([this.selection$, this.status$, this.data$]).pipe(
    map(([selection, status, data]) => ({ selection, status, data }))
  );
  visible = false;

  constructor(private ref: ChangeDetectorRef, private store: Store<LabState>) {}

  clickOpen(data: Dataset, selection: string[] | null): void {
    this.data$.next(data);
    selection = [...(selection ?? data.technologyIds)];
    this.selection$.next(selection);
    this.selectAllCtrl.setValue(selection.length === data.technologyIds.length);
    this.visible = true;
    this.ref.markForCheck();
  }

  selectAll(value: boolean, data: Dataset): void {
    this.selection$.next(value ? [...data.technologyIds] : []);
  }

  clickId(id: string, selection: string[], data: Dataset): void {
    const set = new Set(selection);
    if (set.has(id)) {
      set.delete(id);

      // Filter out any technologies whose prerequisites are no longer met
      let removeIds: Set<string>;
      do {
        removeIds = new Set<string>();

        for (const id of set) {
          const tech = data.technologyEntities[id];
          if (tech.prerequisites?.some((p) => !set.has(p))) {
            removeIds.add(id);
          }
        }

        removeIds.forEach((i) => set.delete(i));
      } while (removeIds.size);
    } else {
      set.add(id);

      // Add any technologies whose prerequisites were not previously met
      let addIds: Set<string>;
      do {
        addIds = new Set<string>();

        for (const id of set) {
          const tech = data.technologyEntities[id];
          tech.prerequisites
            ?.filter((p) => !set.has(p))
            .forEach((p) => addIds.add(p));
        }

        addIds.forEach((i) => set.add(i));
      } while (addIds.size);
    }

    this.selection$.next(Array.from(set));
    this.selectAllCtrl.setValue(set.size === data.technologyIds.length);
  }

  onHide(selection: string[], data: Dataset): void {
    if (selection.length === data.technologyIds.length) {
      this.selectIds.emit(null);
    } else {
      /**
       * Filter for only technologies not listed as prerequisites for other
       * researched technologies, to create minimal set
       */
      const filteredSelection = selection.filter(
        (a) =>
          !selection.some((b) => {
            const techB = data.technologyEntities[b];
            return techB.prerequisites && techB.prerequisites.indexOf(a) !== -1;
          })
      );
      this.selectIds.emit(filteredSelection);
    }
  }
}
