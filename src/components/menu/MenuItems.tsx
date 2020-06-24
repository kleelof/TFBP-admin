import React, { Fragment } from 'react';

import MenuItem, { ItemModes } from './MenuItem';
import {MenuItemDTO} from '../../models/MenuItemModel';
import deliveryDayService from '../../services/DeliveryDayService';
import DeliveryDay from '../../models/DeliveryDayModel';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import helpers, { OrderedItems } from '../../helpers/helpers';

interface IProps { 
    mode: ItemsModes
    menuItems: MenuItemDTO[],
    deliveryDay?: DeliveryDay
}

interface IState {
    menuItems: MenuItemDTO[],
    selectedItemId: number,
    deliveryDay: DeliveryDay,
    toggleState: {[key: string]: boolean}
}

export enum ItemsModes {
    menu,
    deliveryDay
}

export default class MenuItems extends React.Component<IProps, IState> {

    private categories: any = {
        en: 'Entrees',
        ap: 'Appetizers',
        si: 'Sides',
        de: 'Desserts'
    }

    constructor(props: IProps) { 
        super(props);
        
        this.state = {
            menuItems: props.menuItems,
            selectedItemId: -1,
            deliveryDay: props.deliveryDay || new DeliveryDay(""),
            toggleState: {
                en: false,
                ap: false,
                si: false,
                de: false,
                add: false
            }
        }
    }

    public componentDidUpdate = (props: IProps): void => {
        //if (props.menuItems !== this.state.menuItems)
            //this.setState({menuItems: props.menuItems});
    }

    private itemAdded = (menuItem: MenuItemDTO): void => {console.log(menuItem);
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

    private toggleCategory = (category: string): void => {
        let toggleState: any = {
            en: false,
            ap: false,
            si: false,
            de: false,
            add: false
        }; 
        toggleState[category] = !this.state.toggleState[category];
        this.setState({toggleState, selectedItemId: -1})
    }
    
    public render() {
        if (this.props.menuItems.length === 0 && this.props.mode === ItemsModes.deliveryDay)
            return <h3>No Menu Items. Go to Menu to add some.</h3>

        const activeMenuItems: {[key: number]: any} = {};
        if (this.state.deliveryDay.day_items) this.state.deliveryDay.day_items.forEach((item: DeliveryDayItem) => activeMenuItems[item.menu_item.id as any] = item)
        
        // sort into categories
        const groupedMenuItems: OrderedItems = helpers.groupMenuItemsByCategory(this.state.menuItems)
        return(
            <div className="row">
                <div className="col-12">
                    <button className="btn toggle-category"
                        onClick={() => this.toggleCategory('add')}>
                            {this.state.toggleState['add'] ? '-' : '+'}
                        </button>
                    <span className="category-name">Add</span>
                    <br/><br/>
                    <div className={`row category-items-area toggle-state-${this.state.toggleState['add'].toString()}`}> 
                        {this.props.mode === ItemsModes.menu &&
                            <MenuItem
                                menuItem={new MenuItemDTO()}
                                mode={ItemModes.add}
                                itemAdded={this.itemAdded}
                                deliveryDayItem={new DeliveryDayItem(this.state.deliveryDay, new MenuItemDTO(), false, 0)}
                                />
                        }
                    </div> 
                    {
                        Object.keys(groupedMenuItems).map((key: string) => {
                            return (
                                <Fragment>
                                    <button className="btn toggle-category"
                                                onClick={() => this.toggleCategory(key)}>
                                                    {this.state.toggleState[key] ? '-' : '+'}
                                                </button>
                                    <span className="category-name">{this.categories[key]} ({groupedMenuItems[key].length})</span>
                                    <br/><br/>
                                    <div className={`row category-items-area toggle-state-${this.state.toggleState[key].toString()}`}>
                                        {
                                            groupedMenuItems[key].map((menuItemDTO: MenuItemDTO) => {
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
                                </Fragment>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}