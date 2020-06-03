import React from 'react';
import MenuItems, { ItemsModes } from '../menu/MenuItems';
import MenuItemDTO from '../../../dto/MenuItemDTO';
import WeekDTO from '../../../dto/WeekDTO';

interface IProps {
    week: WeekDTO,
    menuItems: MenuItemDTO[]
}

interface IState {
    loaded: boolean,   //TODO: FINISH ADDING LOAD ALL MENU ITEMS, have MenuItems confirm if 
    menuItems: MenuItemDTO[]
}

export default class WeekMenu extends React.Component<IProps, IState> {

    public render() {
        return(
            <div className="row">
                <div className="col-12">
                    <MenuItems
                        menuItems={this.props.menuItems}
                        week={this.props.week} 
                        mode={ItemsModes.week} /> 
                </div>
            </div>
        )
    }
}