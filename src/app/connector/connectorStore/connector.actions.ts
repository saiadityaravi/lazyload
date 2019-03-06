import { Action } from "@ngrx/store";

/**
 * Actions for the connector Module
 */

export const TEST_ACTION = "TEST_ACTION"; 

export class TestAction implements Action {
    readonly type = TEST_ACTION;
}

export type connectorActions = TestAction;