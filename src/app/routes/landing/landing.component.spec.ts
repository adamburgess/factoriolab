import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore } from '@ngrx/store/testing';

import { DispatchTest, ItemId, Mocks, RecipeId, TestModule } from 'src/tests';
import { Game } from '~/models';
import {
  ItemObjectives,
  LabState,
  Preferences,
  RecipeObjectives,
  Settings,
} from '~/store';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let router: Router;
  let mockStore: MockStore<LabState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule, LandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    router = TestBed.inject(Router);
    mockStore = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectItem', () => {
    it('should add an item objective and navigate to the list', () => {
      spyOn(component, 'addItemObjective');
      spyOn(router, 'navigate');
      component.selectItem(ItemId.IronPlate);
      expect(component.addItemObjective).toHaveBeenCalledWith(ItemId.IronPlate);
      expect(router.navigate).toHaveBeenCalledWith(['list']);
    });
  });

  describe('selectRecipe', () => {
    it('should add a recipe objective and navigate to the list', () => {
      spyOn(component, 'addRecipeObjective');
      spyOn(router, 'navigate');
      component.selectRecipe(RecipeId.IronPlate);
      expect(component.addRecipeObjective).toHaveBeenCalledWith(
        ItemId.IronPlate
      );
      expect(router.navigate).toHaveBeenCalledWith(['list']);
    });
  });

  describe('setState', () => {
    it('should call the router to navigate', () => {
      spyOn(router, 'navigate');
      component.setState('name', Mocks.PreferencesState);
      expect(router.navigate).toHaveBeenCalledWith(['list'], {
        queryParams: { z: 'zip' },
      });
    });
  });

  describe('setGame', () => {
    it('should map a game to its default mod id', () => {
      spyOn(component, 'setMod');
      component.setGame(Game.Factorio);
      expect(component.setMod).toHaveBeenCalledWith('1.1');
    });
  });

  it('should dispatch actions', () => {
    const dispatch = new DispatchTest(mockStore, component);
    dispatch.val('setMod', Settings.SetModAction);
    dispatch.val('addItemObjective', ItemObjectives.AddAction);
    dispatch.val('addRecipeObjective', RecipeObjectives.AddAction);
    dispatch.val('setBypassLanding', Preferences.SetBypassLandingAction);
  });
});
