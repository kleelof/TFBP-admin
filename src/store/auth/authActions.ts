import { actions } from '../store';
import { Dispatch } from 'react';
import User from '../../models/UserModel';

interface Login { type: typeof actions.LOGIN, user: User };
export const login = (user: User): AuthActionTypes => ({ type: actions.LOGIN, user });
export const dispatchLogin = (user: User) => {
    return(dispatch: Dispatch<AuthActionTypes>) => {
        dispatch(login(user));
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
