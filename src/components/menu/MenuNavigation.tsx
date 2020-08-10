import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuNavigation extends React.Component<any, any> {

    public render(){
        return(
            <div className="row menunav">
                <div className="col-12">
                    <Link className="menunav__menuitem" to='/dashboard/menu?type=entrees'>Entrees</Link>
                    <Link className="menunav__menuitem" to='/dashboard/menu?type=appetizers'>Appetizers</Link>
                    <Link className="menunav__menuitem" to='/dashboard/menu?type=sides'>Sides</Link>
                    <Link className="menunav__menuitem" to='/dashboard/menu?type=desserts'>Desserts</Link>
                </div>
            </div>
        )
    }
}