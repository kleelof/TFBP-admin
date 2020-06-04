import React from 'react';

import MenuItem, { ItemModes } from './MenuItem';
import MenuItemDTO from '../../../dto/MenuItemDTO';
import WeekMenuItemDTO from '../../../dto/WeekMenuItemDTO';
import WeekDTO from '../../../dto/WeekDTO';
import weekService from '../../../services/WeekService';

interface IProps { 
    mode: ItemsModes
    menuItems: MenuItemDTO[],
    week?: WeekDTO
}

interface IState {
    menuItems: MenuItemDTO[],
    selectedItemId: number,
    week: WeekDTO
}

export enum ItemsModes {
    menu,
    week
}

export default class MenuItems extends React.Component<IProps, IState> {

    constructor(props: IProps) { 
        super(props);

        this.state = {
            menuItems: props.menuItems,
            selectedItemId: -1,
            week: props.week || new WeekDTO("")
        }
    }

    public componentWillUpdate = (props: IProps): void => {
        if (props.menuItems !== this.state.menuItems)
            this.setState({menuItems: props.menuItems});
    }

    private itemAdded = (menuItem: MenuItemDTO): void => {
        this.setState({menuItems: [menuItem, ...this.state.menuItems]});
    }

    private itemSelected = (menuItemDTO: MenuItemDTO): void => {
        if (this.props.mode === ItemsModes.week) {
            if (this.props.week) {
                let week: WeekDTO = this.state.week;
                let menuItems: WeekMenuItemDTO[] = week.menu_items.filter((dto: WeekMenuItemDTO) => dto.id !== menuItemDTO.id);;
                const removed: boolean = menuItems.length !== week.menu_items.length;

                weekService.attachWeekMenuItem(week.id, menuItemDTO.id)
                    .then( resp => {
                        if (!removed)
                            //menuItems.push
                        this.setState({week})
                    })
                    .catch( resp => window.alert("Unable to update"))
            }
        } else {
            this.setState({selectedItemId: menuItemDTO.id});
        } 
    }
    
    public render() {
        if (this.props.menuItems.length === 0 && this.props.mode === ItemsModes.week)
            return <h3>No Menu Items. Go to Menu to add some.</h3>

        const activeMenuItems: {[key: number]: any} = {};
        if (this.state.week.menu_items) this.state.week.menu_items.forEach((dto: WeekMenuItemDTO) => activeMenuItems[dto.menu_item as any] = dto)
        return(
            <div className="row">
                <div className="col-12">
                    {this.props.mode === ItemsModes.menu &&
                        <MenuItem
                            menuItem={new MenuItemDTO()}
                            mode={ItemModes.add}
                            itemAdded={this.itemAdded}
                            weekMenuItem={new WeekMenuItemDTO(this.state.week, new MenuItemDTO(), false, "0")}
                            />
                    }
                    {
                        this.state.menuItems.map((menuItemDTO: MenuItemDTO) => {
                            const mode: ItemModes = this.props.mode === ItemsModes.week ?
                                                        ItemModes.week :
                                                        this.state.selectedItemId === menuItemDTO.id ? ItemModes.edit : ItemModes.view
                            
                            const weekMenuItem: WeekMenuItemDTO = activeMenuItems[menuItemDTO.id] !== undefined ?
                                                                    activeMenuItems[menuItemDTO.id]
                                                                    :
                                                                    new WeekMenuItemDTO(this.state.week, menuItemDTO, false, "0")

                            return(
                                <MenuItem
                                    key={`mi_${menuItemDTO.id}`}
                                    mode={mode}
                                    menuItem={menuItemDTO} 
                                    itemSelected={this.itemSelected}
                                    weekMenuItem={weekMenuItem}/> 
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}