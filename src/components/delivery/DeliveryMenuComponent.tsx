import React from 'react';

import MenuItems, { ItemsModes } from '../menu/MenuItems';
import MenuItemDTO from '../../dto/MenuItemDTO';
import DeliveryDay from '../../models/DeliveryDayModel';

interface IProps {
    deliveryDay: DeliveryDay,
    menuItems: MenuItemDTO[]
}

interface IState {
    loaded: boolean,   //TODO: FINISH ADDING LOAD ALL MENU ITEMS, have MenuItems confirm if 
    menuItems: MenuItemDTO[]
}

export default class DeliveryMenuComponent extends React.Component<IProps, IState> {

    public render() {
        return(
            <div className="row">
                <div className="col-12">
                    <MenuItems
                        menuItems={this.props.menuItems}
                        deliveryDay={this.props.deliveryDay} 
                        mode={ItemsModes.deliveryDay} /> 
                </div>
            </div>
        )
    }
}