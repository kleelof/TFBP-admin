import {Dispatch} from 'react';
import {actions} from './store';
import OperatorSettingsDTO from "../dto/OperatorSettingsDTO";

export interface HelpersState {
    overlayComponent?: any,
    closeCallback?: any,
    selfClose?: boolean
}
const defaultState: HelpersState = {
    overlayComponent: null,
    closeCallback: null,
    selfClose: false
}

interface AddOverlay {
    type: typeof actions.SET_OVERLAY,
    component?: any,
    closeCallback?: any,
    selfClose?: boolean
};
export const addOverlay = (component?: any, selfClose?: boolean, closeCallback?: any): HelpersActionTypes => ({type: actions.SET_OVERLAY, component, selfClose, closeCallback});
export const dispatchAddOverlay = (component?: any, selfClose?: boolean, closeCallback?: any) => {
    return (dispatch:Dispatch<HelpersActionTypes>) => {
        dispatch(addOverlay(component, selfClose, closeCallback));
    }
}

interface AddLoaderOverlay {
    type: typeof actions.SET_LOADING_OVERLAY,
    displayLoadingOverlay: boolean
}
export const addLoaderOverlay = (displayLoadingOverlay: boolean): HelpersActionTypes => 
        ({type: actions.SET_LOADING_OVERLAY, displayLoadingOverlay});
export const dispatchAddLoaderOverlay = (displayLoadingOverlay: boolean) => {
    return (dispatch: Dispatch<HelpersActionTypes>) => {
        dispatch(addLoaderOverlay(displayLoadingOverlay))
    }
}

export type HelpersActionTypes = AddOverlay | AddLoaderOverlay;

const helpersReducer = ( state = defaultState, action: HelpersActionTypes): HelpersState => {
    switch(action.type) {
        case actions.SET_OVERLAY:
            state.overlayComponent = action.component;
            state.closeCallback = action.closeCallback;
            state.selfClose = action.selfClose;
            return {...state};

        case actions.SET_LOADING_OVERLAY:
            return {...state};
    }
    return state;
}

export {helpersReducer};