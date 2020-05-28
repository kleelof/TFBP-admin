import React from 'react';

import weekService from '../../../services/WeekService';
import WeekDTO from '../../../dto/WeekDTO';
import WeekMenu from './WeekMenu';
import MenuItemDTO from '../../../dto/MenuItemDTO';
import menuItemService from '../../../services/AdminMenuItemService';

interface IState {
    loaded: boolean,
    week: WeekDTO,
    menuItems: MenuItemDTO[]
}

export default class Week extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            loaded: false,
            week: new WeekDTO(""),
            menuItems: []
        }
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;

        const week: Promise<WeekDTO> = weekService.get<WeekDTO>(params.id);
        const menuItems: Promise<MenuItemDTO[]> = menuItemService.get<MenuItemDTO[]>();

        Promise.all([week, menuItems])
            .then((values: any) => {
                this.setState({week: values[0], menuItems: values[1], loaded: true})
            })
            .catch( err => window.alert("Unable to load week"))
    } 

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div>
            
        return(
            <WeekMenu week={this.state.week} menuItems={this.state.menuItems} />
        )
    }
}