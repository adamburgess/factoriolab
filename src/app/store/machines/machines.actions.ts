import { Action } from '@ngrx/store';

import { DefaultPayload, IdDefaultPayload } from '~/models';

export const enum MachinesActionType {
  ADD = '[Machines] Add',
  REMOVE = '[Machines] Remove',
  RAISE = '[Machines] Raise',
  LOWER = '[Machines] Lower',
  SET_MACHINE = '[Machines] Set Machine',
  SET_MODULE_RANK = '[Machines] Set Module Rank',
  SET_BEACON_COUNT = '[Machines] Set Beacon Count',
  SET_BEACON = '[Machines] Set Beacon',
  SET_BEACON_MODULE_RANK = '[Machines] Set Beacon Module Rank',
  SET_OVERCLOCK = '[Machines] Set Overclock',
  RESET_MACHINE = '[Machines] Reset Machine',
}

export class AddAction implements Action {
  readonly type = MachinesActionType.ADD;
  constructor(public payload: DefaultPayload<string, string[]>) {}
}

export class RemoveAction implements Action {
  readonly type = MachinesActionType.REMOVE;
  constructor(public payload: DefaultPayload<string, string[]>) {}
}

export class RaiseAction implements Action {
  readonly type = MachinesActionType.RAISE;
  constructor(public payload: DefaultPayload<string, string[]>) {}
}

export class LowerAction implements Action {
  readonly type = MachinesActionType.LOWER;
  constructor(public payload: DefaultPayload<string, string[]>) {}
}

export class SetMachineAction implements Action {
  readonly type = MachinesActionType.SET_MACHINE;
  constructor(public payload: IdDefaultPayload<string, string[]>) {}
}

export class SetModuleRankAction implements Action {
  readonly type = MachinesActionType.SET_MODULE_RANK;
  constructor(public payload: IdDefaultPayload<string[]>) {}
}

export class SetBeaconCountAction implements Action {
  readonly type = MachinesActionType.SET_BEACON_COUNT;
  constructor(public payload: IdDefaultPayload<string>) {}
}

export class SetBeaconAction implements Action {
  readonly type = MachinesActionType.SET_BEACON;
  constructor(public payload: IdDefaultPayload) {}
}

export class SetBeaconModuleRankAction implements Action {
  readonly type = MachinesActionType.SET_BEACON_MODULE_RANK;
  constructor(public payload: IdDefaultPayload<string[]>) {}
}

export class SetOverclockAction implements Action {
  readonly type = MachinesActionType.SET_OVERCLOCK;
  constructor(public payload: IdDefaultPayload<number>) {}
}

export class ResetMachineAction implements Action {
  readonly type = MachinesActionType.RESET_MACHINE;
  constructor(public payload: string) {}
}

export type MachinesAction =
  | AddAction
  | RemoveAction
  | RaiseAction
  | LowerAction
  | SetMachineAction
  | SetModuleRankAction
  | SetBeaconCountAction
  | SetBeaconAction
  | SetBeaconModuleRankAction
  | SetOverclockAction
  | ResetMachineAction;
