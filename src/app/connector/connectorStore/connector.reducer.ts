// Importing the connector State
import { connectorState } from "./connector.state";

//Importing all the actions from the user management
import { connectorActions } from "./connector.actions";

export const initialUserManagementState: connectorState = {

};

export function connectorReducer(state = initialUserManagementState, action: connectorActions): connectorState {
    return state;
}