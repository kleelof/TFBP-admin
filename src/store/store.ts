import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";

import { AuthActionTypes } from './auth/authActions';
import { authReducer } from './auth/authReducer';

export enum actions {
    LOGIN,
    LOGOUT
};

export type AppActions = AuthActionTypes;

export const rootReducer = combineReducers({authReducer});

export type AppState = ReturnType<typeof rootReducer>; 

export const store = createStore(
    rootReducer,
    applyMiddleware( 
        thunk as ThunkMiddleware<AppState, AppActions>)
)