import {Dispatch} from 'react';
import {actions} from './store';

export type OperatorSettings = {
    type?: number
}

export interface OperatorState {
    settings?: OperatorSettings
}


const defaultState: OperatorState = {
    settings: {
        type: 0
    }
}

interface UpdateOperatorSettings {
    type: typeof actions.OPERATOR_SETTINGS,
    settings: OperatorSettings
}
export const updateOperatorSettings = (settings: OperatorSettings): OperatorActionTypes => ({
    type: actions.OPERATOR_SETTINGS, settings
});
export const dispatchUpdateOperatorSettings = (settings: OperatorSettings) => {
    return (dispatch: Dispatch<OperatorActionTypes>) => {
        dispatch(updateOperatorSettings(settings))
    }
}


export type OperatorActionTypes = UpdateOperatorSettings

const operatorReducer = (state: OperatorState = defaultState, action: OperatorActionTypes): OperatorState => {
    switch(action.type) {
        case actions.OPERATOR_SETTINGS:
            return {...state, settings: action.settings}
    }
    return state;
}

export {operatorReducer};