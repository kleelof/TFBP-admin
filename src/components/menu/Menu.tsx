import React from 'react';
import MenuItem, {MenuItemDTO} from '../../models/MenuItemModel'; 
import menuItemService from '../../services/MenuItemService';
import LoadingOverlay from '../overlays/LoadingOverlay';
import { Switch, Route } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import MenuEdit from './MenuItemEdit';
import {SubNavigation, NavItem} from '../nav/SubNavigation';
import { NewMenuItem } from './NewMenuItem'; 

interface State {
    menuItems: MenuItemDTO[],
    loaded: boolean
}

export default class Menu extends React.Component<any, State> {

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
        const navItems: NavItem[] = [
            {title: 'Entrees', link:'/dashboard/menu/en'},
            {title: 'Appitizers', link:'/dashboard/menu/ap'},
            {title: 'Sides', link:'/dashboard/menu/si'},
            {title: 'Desserts', link:'/dashboard/menu/de'}
        ]

        return(
            <div className="row">
                <div className="col-12">
                    <SubNavigation navItems={navItems} />
                </div>
                <div className="col-12 col-md-5">
                    <NewMenuItem key={Math.random().toString()}/>
                </div>
                <div className="col-12">
                    <Switch>
                        <Route path="/dashboard/menu/edit/:id/" component={MenuEdit} />
                        <Route path="/dashboard/menu/:category/" component={MenuItems} />
                    </Switch>
                </div>
            </div>
        )
    }
}