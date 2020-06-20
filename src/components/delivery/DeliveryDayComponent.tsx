import React from 'react';

import MenuItems, { ItemsModes } from '../menu/MenuItems';
import {MenuItemDTO} from '../../models/MenuItemModel';
import DeliveryDay from '../../models/DeliveryDayModel';
import MenuItem from '../../models/MenuItemModel';
import menuItemService from '../../services/AdminMenuItemService';
import deliveryDayService from '../../services/DeliveryDayService';

interface IState {
    loading: boolean,   //TODO: FINISH ADDING LOAD ALL MENU ITEMS, have MenuItems confirm if 
    menuItems: MenuItemDTO[],
    deliveryDay: DeliveryDay
}

export default class DeliveryDayComponent extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state ={
            loading: true,
            menuItems: [],
            deliveryDay: new DeliveryDay("")
        }
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;

        const deliveryDay: Promise<DeliveryDay> = deliveryDayService.get<DeliveryDay>(params.id);
        const menuItems: Promise<MenuItem[]> = menuItemService.get<MenuItem[]>();

        Promise.all([deliveryDay, menuItems])
            .then((values: any) => {
                this.setState({deliveryDay: values[0], menuItems: values[1], loading: false})
            })
            .catch( err => window.alert("Unable to load week"))
    }
    
    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        return(
            <div className="row">
                <div className="col-12">
                    <h3>Menu for {this.state.deliveryDay.date}</h3>
                    <MenuItems
                        menuItems={this.state.menuItems}
                        deliveryDay={this.state.deliveryDay} 
                        mode={ItemsModes.deliveryDay} /> 
                </div>
            </div>
        )
    }
}