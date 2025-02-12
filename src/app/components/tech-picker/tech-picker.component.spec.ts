import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mocks, RecipeId, TestModule } from 'src/tests';
import { TechPickerComponent, UnlockStatus } from './tech-picker.component';

describe('TechPickerComponent', () => {
  let component: TechPickerComponent;
  let fixture: ComponentFixture<TechPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechPickerComponent],
      imports: [TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TechPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickOpen', () => {
    it('should set up lists of available, locked, and researched technologies', () => {
      let status: Record<UnlockStatus, string[]> | undefined;
      component.status$.subscribe((s) => (status = s));
      component.clickOpen(Mocks.Dataset, [RecipeId.MiningProductivity]);
      expect(status?.available.length).toEqual(8);
      expect(status?.researched.length).toEqual(1);
      expect(status?.locked.length).toEqual(183);
    });

    it('should handle null selection', () => {
      let status: Record<UnlockStatus, string[]> | undefined;
      component.status$.subscribe((s) => (status = s));
      component.clickOpen(Mocks.Dataset, null);
      expect(status?.available.length).toEqual(0);
      expect(status?.researched.length).toEqual(192);
      expect(status?.locked.length).toEqual(0);
    });
  });

  describe('selectAll', () => {
    it('should set the selection to all', () => {
      spyOn(component.selection$, 'next');
      component.selectAll(true, Mocks.Dataset);
      expect(component.selection$.next).toHaveBeenCalledWith(
        Mocks.Dataset.technologyIds
      );
    });

    it('should set the selection to empty', () => {
      spyOn(component.selection$, 'next');
      component.selectAll(false, Mocks.Dataset);
      expect(component.selection$.next).toHaveBeenCalledWith([]);
    });
  });

  describe('clickId', () => {
    it('should add the id and any dependencies to the selection', () => {
      spyOn(component.selection$, 'next');
      component.clickId(RecipeId.Electronics, [], Mocks.Dataset);
      expect(component.selection$.next).toHaveBeenCalledWith([
        RecipeId.Electronics,
        RecipeId.Automation,
      ]);
    });

    it('should remove id and any dependencies from the selection', () => {
      spyOn(component.selection$, 'next');
      component.clickId(
        RecipeId.Automation,
        [RecipeId.Electronics, RecipeId.Automation],
        Mocks.Dataset
      );
      expect(component.selection$.next).toHaveBeenCalledWith([]);
    });
  });

  describe('onHide', () => {
    it('should emit the selection filtered to a minimal set', () => {
      spyOn(component.selectIds, 'emit');
      component.onHide(
        [RecipeId.Electronics, RecipeId.Automation],
        Mocks.Dataset
      );
      expect(component.selectIds.emit).toHaveBeenCalledWith([
        RecipeId.Electronics,
      ]);
    });

    it('should emit null if all technologies are selected', () => {
      spyOn(component.selectIds, 'emit');
      component.onHide(Mocks.Dataset.technologyIds, Mocks.Dataset);
      expect(component.selectIds.emit).toHaveBeenCalledWith(null);
    });
  });
});
