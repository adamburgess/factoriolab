import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { combineLatest, map, tap } from 'rxjs';

import { CostKey, CostSettings } from '~/models';
import { ContentService } from '~/services';
import { LabState, Settings } from '~/store';

@UntilDestroy()
@Component({
  selector: 'lab-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostsComponent implements OnInit {
  vm$ = combineLatest([
    this.store
      .select(Settings.getCosts)
      .pipe(tap((costs) => this.initEdit(costs))),
    this.store.select(Settings.getSettingsModified),
  ]).pipe(
    map(([costs, settingsModified]) => ({
      costs,
      settingsModified,
    }))
  );

  visible = false;
  editValue = { ...Settings.initialSettingsState.costs };

  get modified(): boolean {
    return (Object.keys(this.editValue) as CostKey[]).some(
      (k) => this.editValue[k] !== Settings.initialSettingsState.costs[k]
    );
  }

  constructor(
    private ref: ChangeDetectorRef,
    private store: Store<LabState>,
    private contentSvc: ContentService
  ) {}

  ngOnInit(): void {
    this.contentSvc.showCosts$.pipe(untilDestroyed(this)).subscribe(() => {
      this.visible = true;
      this.ref.markForCheck();
    });
  }

  initEdit(costs: CostSettings): void {
    this.editValue = { ...costs };
  }

  reset(): void {
    this.editValue = { ...Settings.initialSettingsState.costs };
  }

  save(): void {
    this.store.dispatch(new Settings.SetCostsAction(this.editValue));
  }
}
