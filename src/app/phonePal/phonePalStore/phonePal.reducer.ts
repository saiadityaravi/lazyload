// Importing the phone pal State
import { PhonepalState } from "./phonePal.state";

//Importing all the actions from the user management
import { PhonePalActions } from "./phonePal.action";

export const initialUserManagementState: PhonepalState = {

};

export function phonePalReducer(state = initialUserManagementState, action: PhonePalActions): PhonepalState {
    return state;
}