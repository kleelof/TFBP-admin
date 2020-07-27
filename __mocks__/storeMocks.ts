
import configureStore, { MockStore } from 'redux-mock-store';
import thunk from "redux-thunk";
import { HelpersState } from '../src/store/helpersReducer';
import User from '../src/models/User';

const mockStore = configureStore([thunk]);

export const buildStore = (helpersReducer: HelpersState | any = {}, cartReducer: any = {},
                            authReducer: any = {}): MockStore => {

    return (
        mockStore({
            helpersReducer: {
                ...{
                    zip: "",
                    zipValid: false
                },...helpersReducer
            },
            cartReducer: {
                ...{
                    items: []
                }, ...cartReducer
            },
            authReducer: {
                ...{
                    user: new User()
                }, ...authReducer
            }
        })
    )
}

export const nullFalseStore = mockStore({
    helpersReducer: {
        zip: null,
        zipValid: false
    },
    cartReducer: {
        items: []
    }
})

let valueFalseStore = mockStore({
    helpersReducer: {
        zip: "12345",
        zipValid: false
    },
    cartReducer: {
        items: []
    }
})

let valueTrueStore = mockStore({
    helpersReducer: {
        zip: "12345",
        zipValid: true
    },
    cartReducer: {
        items: []
    }
})