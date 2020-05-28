import React from 'react';

import MenuItem, { ItemModes } from './MenuItem';
import MenuItemDTO from '../../../dto/MenuItemDTO';
import menuItemService from '../../../services/AdminMenuItemService';
import Service from '../../../services/Service';

interface IProps { 
    mode: ItemsModes
    menuItems: MenuItemDTO[]
}

interface IState {
    menuItems: MenuItemDTO[],
    selectedItemId: number
}

export enum ItemsModes {
    menu,
    week
}

export default class MenuItems extends React.Component<IProps, IState> {

    private service: Service = menuItemService;

    constructor(props: IProps) { 
        super(props);

        this.state = {
            menuItems: this.props.menuItems,
            selectedItemId: -1
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
        if (this.props.mode === ItemsModes.menu) this.setState({selectedItemId: menuItemDTO.id}); 
    }
    
    public render() {
        const mode: ItemModes = this.props.mode === ItemsModes.week ?
                                                        ItemModes.week :
                                                        this.state.selectedItemId ? ItemModes.edit : ItemModes.view

        if (this.props.menuItems.length === 0)
            return <h3>No Menu Items. Go to Menu to add some.</h3>
        return(
            <div className="row">
                <div className="col-12">
                    {this.props.mode === ItemsModes.menu &&
                        <MenuItem
                            menuItem={new MenuItemDTO()}
                            mode={ItemModes.add}
                            itemAdded={this.itemAdded}
                            />
                    }
                    {
                        this.state.menuItems.map((menuItemDTO: MenuItemDTO) => {
                            return(
                                <MenuItem
                                    key={`mi_${menuItemDTO.id}`}
                                    mode={mode}
                                    menuItem={menuItemDTO} 
                                    itemSelected={this.itemSelected}
                                    />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}