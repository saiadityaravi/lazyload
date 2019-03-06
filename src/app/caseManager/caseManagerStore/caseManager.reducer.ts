import { CaseManagerState } from './caseManager.state'
import { CaseManagerActions } from './caseManager.actions'
export const initialCaseManagerState: CaseManagerState = {

}

export function caseManagerReducer(state = initialCaseManagerState, action:CaseManagerActions):CaseManagerState{
    return state;
}