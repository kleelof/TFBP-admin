import React from 'react';
import MenuItem from "../../models/MenuItemModel";
import './rest_menu_manager.scss';

interface Props {
    menuItem: MenuItem
}

export const RestaurantMenuItem = (props: Props): React.ReactElement => {

    return (
        <div className='row restaurant_menu_item'>
            <div className='col-12'>
                {props.menuItem.name}
            </div>
            <div className='col-12 restaurant_menu_item__description'>
                {props.menuItem.description}
            </div>
        </div>
    )
}