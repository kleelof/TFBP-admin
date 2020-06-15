import React from 'react';

import MenuItem, { ItemModes } from './MenuItem';
import MenuItemDTO from '../../dto/MenuItemDTO';
import deliveryDayService from '../../services/DeliveryDayService';
import DeliveryDay from '../../models/DeliveryDayModel';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';

interface IProps { 
    mode: ItemsModes
    menuItems: MenuItemDTO[],
    deliveryDay?: DeliveryDay
}

interface IState {
    menuItems: MenuItemDTO[],
    selectedItemId: number,
    deliveryDay: DeliveryDay
}

export enum ItemsModes {
    menu,
    deliveryDay
}

export default class MenuItems extends React.Component<IProps, IState> {

    constructor(props: IProps) { 
        super(props);
        
        this.state = {
            menuItems: props.menuItems,
            selectedItemId: -1,
            deliveryDay: props.deliveryDay || new DeliveryDay("")
        }
    }

    public componentDidUpdate = (props: IProps): void => {
        if (props.menuItems !== this.state.menuItems)
            this.setState({menuItems: props.menuItems});
    }

    private itemAdded = (menuItem: MenuItemDTO): void => {
        this.setState({menuItems: [menuItem, ...this.state.menuItems]});
    }

    private itemSelected = (menuItemDTO: MenuItemDTO): void => {
        if (this.props.mode === ItemsModes.deliveryDay) {
            if (this.props.deliveryDay) {
                let deliveryDay: DeliveryDay = this.state.deliveryDay;
                let menuItems: DeliveryDayItem[] = deliveryDay.day_items.filter((item: DeliveryDayItem) => item.id !== menuItemDTO.id);;
                const removed: boolean = menuItems.length !== deliveryDay.day_items.length;

                deliveryDayService.attachWeekMenuItem(deliveryDay.id, menuItemDTO.id)
                    .then( resp => {
                        if (!removed)
                            //menuItems.push
                        this.setState({deliveryDay})
                    })
                    .catch( resp => window.alert("Unable to update"))
            }
        } else {
            this.setState({selectedItemId: menuItemDTO.id});
        } 
    }
    
    public render() {
        if (this.props.menuItems.length === 0 && this.props.mode === ItemsModes.deliveryDay)
            return <h3>No Menu Items. Go to Menu to add some.</h3>

        const activeMenuItems: {[key: number]: any} = {};
        if (this.state.deliveryDay.day_items) this.state.deliveryDay.day_items.forEach((item: DeliveryDayItem) => activeMenuItems[item.menu_item.id as any] = item)
        
        return(
            <div className="row">
                <div className="col-12">
                    {this.props.mode === ItemsModes.menu &&
                        <MenuItem
                            menuItem={new MenuItemDTO()}
                            mode={ItemModes.add}
                            itemAdded={this.itemAdded}
                            deliveryDayItem={new DeliveryDayItem(this.state.deliveryDay, new MenuItemDTO(), false, 0)}
                            />
                    }
                    {
                        this.state.menuItems.map((menuItemDTO: MenuItemDTO) => {
                            const mode: ItemModes = this.props.mode === ItemsModes.deliveryDay ?
                                                        ItemModes.deliveryDay
                                                        :
                                                        this.state.selectedItemId === menuItemDTO.id ? 
                                                            ItemModes.edit : ItemModes.view
                            
                            const deliveryDayItem: DeliveryDayItem = activeMenuItems[menuItemDTO.id] !== undefined ?
                                                                        activeMenuItems[menuItemDTO.id]
                                                                        :
                                                                        new DeliveryDayItem(this.state.deliveryDay, menuItemDTO, false, 0)

                            return(
                                <MenuItem
                                    key={`mi_${menuItemDTO.id}`}
                                    mode={mode}
                                    menuItem={menuItemDTO} 
                                    itemSelected={this.itemSelected}
                                    deliveryDayItem={deliveryDayItem}/> 
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}