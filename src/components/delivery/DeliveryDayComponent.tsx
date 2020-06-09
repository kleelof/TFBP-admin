import React from 'react';

import deliveryDayService from '../../services/DeliveryDayService';
import DeliveryDay from '../../models/DeliveryDayModel';
import DeliveryMenu from './DeliveryMenuComponent';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import menuItemService from '../../services/AdminMenuItemService';
import MenuItem from '../../models/MenuItemModel';

interface IState {
    loaded: boolean,
    deliveryDay: DeliveryDay,
    deliveryDayItems: DeliveryDayItem[]
}

export default class DeliveryDayComponent extends React.Component<any, IState> {

    state = {
        loaded: false,
        deliveryDay: new DeliveryDay(""),
        deliveryDayItems: []
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;

        const deliveryDay: Promise<DeliveryDay> = deliveryDayService.get<DeliveryDay>(params.id);
        const menuItems: Promise<MenuItem[]> = menuItemService.get<MenuItem[]>();

        Promise.all([deliveryDay, menuItems])
            .then((values: any) => {
                this.setState({deliveryDay: values[0], deliveryDayItems: values[1], loaded: true})
            })
            .catch( err => window.alert("Unable to load week"))
    } 

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div>
        
        return(
            <DeliveryMenu deliveryDay={this.state.deliveryDay} menuItems={this.state.deliveryDayItems} />
        )
    }
}