import React from 'react';

import { MenuItems, ItemsModes } from '../menu/MenuItems';
import {MenuItemDTO} from '../../models/MenuItemModel';
import DeliveryDay from '../../models/DeliveryDayModel';
import MenuItem from '../../models/MenuItemModel';
import menuItemService from '../../services/MenuItemService';
import deliveryWindowService from '../../services/DeliveryWindowService';
import deliveryDayService from '../../services/DeliveryDayService';
import helpers from '../../helpers/helpers';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import DeliveryWindows from '../delivery_windows/DeliveryWindows';

interface State {
    loading: boolean,   //TODO: FINISH ADDING LOAD ALL MENU ITEMS, have MenuItems confirm if 
    menuItems: MenuItemDTO[],
    deliveryDay: DeliveryDay,
    deliveryWindows: DeliveryWindow[]
}

export default class DeliveryDayComponent extends React.Component<any, State> {

    state ={
        loading: true,
        menuItems: [],
        deliveryDay: new DeliveryDay(""),
        deliveryWindows: []
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;

        const deliveryDay: Promise<DeliveryDay> = deliveryDayService.get<DeliveryDay>(params.id);
        const menuItems: Promise<MenuItem[]> = menuItemService.get<MenuItem[]>();
        const deliveryWindows: Promise<DeliveryWindow[]> = deliveryWindowService.get<DeliveryWindow[]>();

        Promise.all([deliveryDay, menuItems, deliveryWindows])
            .then((values: any) => {
                this.setState({deliveryDay: values[0], menuItems: values[1], deliveryWindows: values[2], loading: false})
            })
            .catch( err => window.alert("Unable to load week"))
    }
    
    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        return(
            <div className="row">
                <div className="col-12">
                    <h3>{helpers.formatDate(this.state.deliveryDay.date)}</h3>
                    <hr/>
                </div>
                <div className="col-2">
                    <DeliveryWindows deliveryDay={this.state.deliveryDay} deliveryWindows={this.state.deliveryWindows} />
                </div>
                <div className="col-10 mt-3">
                    {/* 
                    <MenuItems
                        menuItems={this.state.menuItems}
                        deliveryDay={this.state.deliveryDay} 
                        mode={ItemsModes.deliveryDay} />
                        */} 
                </div>
            </div>
        )
    }
}