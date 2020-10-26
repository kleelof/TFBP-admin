import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import MenuEdit from './MenuItemEdit';

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