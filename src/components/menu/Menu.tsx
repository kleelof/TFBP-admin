import React, { Fragment } from 'react';
import {MenuItemDTO} from '../../models/MenuItemModel'; 
import menuItemService from '../../services/MenuItemService';
import MenuItems, { ItemsModes } from './MenuItems';
import LoadingOverlay from '../overlays/LoadingOverlay';
import MenuNavigation from './MenuNavigation';
import { Switch, Route } from 'react-router-dom';

interface IState {
    menuItems: MenuItemDTO[],
    loaded: boolean
}

export default class Menu extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            menuItems: [],
            loaded: false
        }
    }

    public componentDidMount = (): void => {
        menuItemService.get<MenuItemDTO[]>()
            .then((menuItems: MenuItemDTO[]) => {
                this.setState({menuItems, loaded: true})
            })
            .catch( err => {
                window.alert(`Unable to load Menu Items: ${err}`);
            })
    }

    public render() {

        if (!this.state.loaded)
            return <LoadingOverlay />

        return(
            <div className="row">
                <div className="col-12">
                    <MenuNavigation />
                </div>
                <div className="col-12">
                    <Switch>
                        <Route path=""
                    </Switch>
                </div>
            </div>
        )
    }
}