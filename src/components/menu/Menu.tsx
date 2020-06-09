import React, { Fragment } from 'react';
import MenuItemDTO from '../../dto/MenuItemDTO';
import menuItemService from '../../services/AdminMenuItemService';
import MenuItems, { ItemsModes } from './MenuItems';

interface IState {
    menuItems: MenuItemDTO[],
    loaded: boolean
}
export default class Menu extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            menuItems: [],
            loaded: false
        }
    }

    public componentDidMount = (): void => {
        menuItemService.get<MenuItemDTO[]>()
            .then((menuItems: MenuItemDTO[]) => {
                this.setState({menuItems, loaded: true})
            })
            .catch( err => {
                window.alert(`Unable to load Menu Items: ${err}`);
            })
    }

    public render() {

        if (!this.state.loaded)
            return <div>Loading...</div>

        return(
            <Fragment>
                <div className="row mt-4">
                    <div className="col-12">
                        <h3>Menu Items</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <MenuItems
                            menuItems={this.state.menuItems}
                            mode={ItemsModes.menu}/>
                    </div>
                </div>
            </Fragment>
        )
    }
}