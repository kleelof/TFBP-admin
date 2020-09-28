import { actions } from '../store';
import { Dispatch } from 'react';
import User from '../../models/User';

interface Login { type: typeof actions.LOGIN, user: User, operator_token: string };
export const login = (user: User, operator_token: string): AuthActionTypes => ({ type: actions.LOGIN, user, operator_token });
export const dispatchLogin = (user: User, operator_token: string) => {
    return(dispatch: Dispatch<AuthActionTypes>) => {
        dispatch(login(user, operator_token));
    }
}

interface Logout { type: typeof actions.LOGOUT };
export const logout = (): AuthActionTypes => ({ type: actions.LOGOUT });
export const dispatchLogout = () => {
    return(dispatch: Dispatch<AuthActionTypes>) => {
        dispatch(logout());
    }
}

export type AuthActionTypes = Login | Logout;
