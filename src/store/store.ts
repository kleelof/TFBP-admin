import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";

import { AuthActionTypes } from './auth/authActions';
import { authReducer } from './auth/authReducer';
import { OperatorActionTypes, operatorReducer } from "./operatorReducer";

export enum actions {
    LOGIN,
    LOGOUT,
    OPERATOR_SETTINGS
};

export type AppActions = AuthActionTypes | OperatorActionTypes;

export const rootReducer = combineReducers({authReducer, operatorReducer});

export type AppState = ReturnType<typeof rootReducer>; 

export const store = createStore(
    rootReducer,
    applyMiddleware( 
        thunk as ThunkMiddleware<AppState, AppActions>)
)