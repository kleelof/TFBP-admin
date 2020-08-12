import React from 'react';

import {MenuItemDTO} from '../../models/MenuItemModel';
import DeliveryDay from '../../models/DeliveryDayModel';
import MenuItem from '../../models/MenuItemModel';
import menuItemService from '../../services/MenuItemService';
import deliveryDayItemService from '../../services/DeliveryDayItemService';
import deliveryDayService from '../../services/DeliveryDayService';
import helpers from '../../helpers/helpers';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import SearchWidget from '../widgets/searchWidget/SearchWidget';
import DeliveryDayItem, { DeliveryDayItemDTO } from '../../models/DeliveryDayItemModel';
import { DeliveryDayItemComponent } from './DeliveryDayItemComponent';
import './delivery.css';

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
        this.refreshDay(params.id);
    }

    private itemSelected = (item: MenuItem) => {
        deliveryDayItemService.add(new DeliveryDayItemDTO(this.state.deliveryDay.id, item.id, false, item.price))
            .then((item: any) => {
                const deliveryDay: DeliveryDay = this.state.deliveryDay;
                deliveryDay.day_items.push(item);
                this.setState({deliveryDay});
                console.log(deliveryDay);
            })
            .catch( err => window.alert('unable to add menu item'))
    }

    private refreshDay = (id: number): void => { console.log(id)
        deliveryDayService.get<DeliveryDay>(id)
            .then((deliveryDay: DeliveryDay) => {console.log(deliveryDay)
                this.setState({deliveryDay, loading: false})
            })
            .catch( err => window.alert("Unable to load week"))
    }
    
    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        return(
            <div className="row delivery_day_component">
                <div className="col-12 col-md-6">
                    <h3>{helpers.formatDate(this.state.deliveryDay.date)}</h3>
                    <hr/>
                </div>
                <div className="col-12 col-md-6 delivery_day_component__search_widget">
                    <SearchWidget service={menuItemService} itemSelected={this.itemSelected} />
                </div>
                    {
                        this.state.deliveryDay.day_items.map((item: DeliveryDayItem) => {
                            return (
                                <div className="col-12 col-md-3">
                                    <div className="row">
                                        <div className="col-12">
                                            <DeliveryDayItemComponent item={item} refreshItems={() => this.refreshDay(this.state.deliveryDay.id)}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
            </div>
        )
    }
}