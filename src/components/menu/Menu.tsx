import React, {useEffect, useState} from 'react';
import MenuItem, {MenuItemDTO} from '../../models/MenuItemModel'; 
import menuItemService from '../../services/MenuItemService';
import LoadingOverlay from '../overlays/LoadingOverlay';
import { Switch, Route, useParams } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import MenuEdit from './MenuItemEdit';
import {SubNavigation, NavItem} from '../nav/SubNavigation';
import { NewMenuItem } from './NewMenuItem'; 

export const Menu = (): React.ReactElement => {

    return(
        <div className="row menu">
            <div className="col-12">
                <Switch>
                    <Route path="/dashboard/menu/edit/:id/" component={MenuEdit} />
                    <Route path="/dashboard/menu/:category/" component={MenuItems} />
                </Switch>
            </div>
        </div>
    )
}