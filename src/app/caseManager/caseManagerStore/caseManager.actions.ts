import { Action } from "@ngrx/store";

/**
 * Actions for the User Management Module
 */

export const TEST_ACTION = "TEST_ACTION"; 

export class TestAction implements Action {
    readonly type = TEST_ACTION;
}

export type CaseManagerActions = TestAction;