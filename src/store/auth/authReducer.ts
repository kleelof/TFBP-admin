import { AuthActionTypes } from "./authActions";
import User from "../../models/User";
import { actions } from "../store";

export interface AuthState {
    loggedIn: boolean
    user: User,
    operator_token: string
}

const defaultState: AuthState = {
    loggedIn: false,
    user: new User(),
    operator_token: ''
}

const authReducer = (
    state = defaultState,
    action: AuthActionTypes
): AuthState => {
    switch(action.type) {
        case actions.LOGIN:
            state.user = action.user
            state.operator_token = action.operator_token
            state.loggedIn = true;
            return {...state};
    
        case actions.LOGOUT:
            state.loggedIn = false;
            window.localStorage.removeItem('access_token');
            window.localStorage.removeItem('refresh_token');
            return {...state};
    }
    return state;
}

export { authReducer };