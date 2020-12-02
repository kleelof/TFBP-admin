import React, {useState} from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {actions, AppState} from '../../store/store';
import './navigation.scss';
import {OPERATOR_TYPES} from "../../models/OperatorModel";

interface Props {
    closeNav: () => void
}

export const Navigation = (props: Props): React.ReactElement => {
    const [doLogin] = useState(false);
    const [showDropdown, setShowDropdown] = useState(');')
    const dispatch = useDispatch();
    const history = useHistory();
    const isRestaurant = useSelector((state: AppState) => state.operatorReducer).settings?.type === OPERATOR_TYPES.restaurant;

    const navigateToPage = (pathname: string): void => {
        props.closeNav();
        history.push({pathname})
    }

    const logout = (): void => {
        dispatch({type: actions.LOGOUT});
    }

    if (doLogin)
        return <Redirect to="/dashboard/login" />

    return (
        <div className="navigation">
            <ul className="">
                <li onClick={() => navigateToPage("/dashboard/")}>
                    dashboard
                </li>
                <li onClick={() => navigateToPage("/dashboard/profile")}>
                    profile
                </li>
                {
                    !isRestaurant ?
                        <li onClick={() => setShowDropdown('menu')}>
                            menu
                            <ul className={`sidenav__dropdown sidenav__dropdown--${showDropdown === 'menu' ? 'open' : 'close'}`}>
                                <li onClick={() => navigateToPage("/dashboard/menu/en")}>
                                    entrees
                                </li>
                                <li onClick={() => navigateToPage("/dashboard/menu/ap")}>
                                    appetizers
                                </li>
                                <li onClick={() => navigateToPage("/dashboard/menu/si")}>
                                    sides
                                </li>
                                <li onClick={() => navigateToPage("/dashboard/menu/de")}>
                                    desserts
                                </li>
                            </ul>
                        </li>
                        :
                        <li onClick={() => navigateToPage("/dashboard/rest/menu")}>
                            menu
                        </li>
                }
                {
                    isRestaurant ?
                        <li onClick={() => navigateToPage("/dashboard/rest/delivery")}>
                            activity windows
                        </li>
                        :
                        <li onClick={() => setShowDropdown('delivery')}>
                            delivery
                            <ul className={`sidenav__dropdown sidenav__dropdown--${showDropdown === 'delivery' ? 'open' : 'close'}`}>
                                <li onClick={() => navigateToPage("/dashboard/deliveries")}>
                                    menus
                                </li>
                                <li onClick={() => navigateToPage("/dashboard/delivery_window")}>
                                    windows
                                </li>
                                <li onClick={() => navigateToPage("/dashboard/zone")}>
                                    zones
                                </li>
                            </ul>
                        </li>
                }
                <li onClick={() => setShowDropdown('recipe')}>
                    recipes
                    <ul className={`sidenav__dropdown sidenav__dropdown--${showDropdown === 'recipe' ? 'open' : 'close'}`}>
                        <li onClick={() => navigateToPage("/dashboard/recipe")}>
                            recipes
                        </li>
                        <li onClick={() => navigateToPage("/dashboard/ingredient")}>
                            ingredients
                        </li>
                    </ul>
                </li>
                <li onClick={() => navigateToPage("/dashboard/coupons")}>
                    coupons
                </li>
                <li onClick={() => setShowDropdown('mail')}>
                    mail
                    <ul className={`sidenav__dropdown sidenav__dropdown--${showDropdown === 'mail' ? 'open' : 'close'}`}>
                        <li onClick={() => navigateToPage("/dashboard/mail/mass_mailer")}>
                            mass mailer
                        </li>
                        <li onClick={() => navigateToPage("/dashboard/mail/list")}>
                            mailing list
                        </li>
                    </ul>
                </li>
                <li onClick={() => navigateToPage("/dashboard/newsletter")}>
                    newsletters
                </li>
                <li onClick={() => navigateToPage("/dashboard/orders")}>
                    orders
                </li>
            </ul>
            <span className="navigation__login text-center">
                <button className="btn btn-sm btn-outline-danger" onClick={logout}>Logout</button>
            </span>
        </div>
    )

}