import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";

import { AuthActionTypes } from './auth/authActions';
import { authReducer } from './auth/authReducer';
import {HelpersActionTypes, helpersReducer} from "./helpersReducer";
import { OperatorActionTypes, operatorReducer } from "./operatorReducer";

export enum actions {
    LOGIN,
    LOGOUT,
    OPERATOR_SETTINGS,
    SET_OVERLAY,
    SET_LOADING_OVERLAY
};

export type AppActions = AuthActionTypes | OperatorActionTypes | HelpersActionTypes;

export const rootReducer = combineReducers({authReducer, operatorReducer, helpersReducer});

export type AppState = ReturnType<typeof rootReducer>; 

export const store = createStore(
    rootReducer,
    applyMiddleware( 
        thunk as ThunkMiddleware<AppState, AppActions>)
)