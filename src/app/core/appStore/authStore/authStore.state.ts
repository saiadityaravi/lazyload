import { User } from "../../models/user.model"

export interface AuthState {
    access_token: string;
    refresh_token?: string;
    loggedIn: boolean;
    user?: User;
    error?: string;
    access_token_exp?: string;
}