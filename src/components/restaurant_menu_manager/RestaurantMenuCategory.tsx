import React, {useState, Fragment} from 'react';
import {MenuCategory} from "../../models/MenuCategoryModel";

import './rest_menu_manager.scss';
import MenuItem from "../../models/MenuItemModel";
import {RestaurantMenuItem} from "./RestaurantMenuItem";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import menuItemService from '../../services/MenuItemService';
import { useHistory } from 'react-router-dom';

interface Props {
    category: MenuCategory,
    move: (direction: number, category: MenuCategory) => void,
    canMoveUp: boolean,
    canMoveDown: boolean,
    isOpen: boolean,
    categorySelected: (category: MenuCategory | null) => void;
}

export const RestaurantMenuCategory = (props: Props): React.ReactElement => {

    const history = useHistory();
    const [newMenuItemName, setNewMenuItemName] = useState('');
    const [creatingMenuItem, setCreatingMenuItem] = useState(false);
    const [category, setCategory] = useState<MenuCategory>(props.category);

    const createMenuItem = (): void => {
        setCreatingMenuItem(true)
        menuItemService.add<MenuItem>({name: newMenuItemName, menu_category: props.category.id} as MenuItem)
            .then((menuItem: MenuItem) => {
                history.push({pathname: `/dashboard/menu/edit/${menuItem.id}/`})
                //setCategory({...category, menu_items: [...category.menu_items, menuItem]})
            })
            .catch( err => window.alert('unable to add menu item'))
    }


    return (
        <div className='row menu_category'>
            <div className='col-12 menu_category__inner'>
                <div className='row'>
                    <div className='col-12 col-md-8 menu_category__name'>
                        {props.category.name}
                    </div>
                    <div className='col-12 col-md-4 menu_category__controls text-right'>
                        <button
                            className={`btn btn-sm btn-outline-${props.canMoveUp ? 'primary' : 'secondary'}`}
                            disabled={!props.canMoveUp}
                            onClick={() => props.move(-1, category)}
                        >UP</button>
                        <button
                            className={`btn btn-sm btn-outline-${props.canMoveDown ? 'primary' : 'secondary'} mr-1`}
                            disabled={!props.canMoveDown}
                            onClick={() => props.move(1, category)}
                        >DN</button>
                        <button
                            className='btn btn-sm btn-outline-info'
                            onClick={() => props.categorySelected(props.isOpen ? null : category)}
                        >
                            {
                                props.isOpen ? '-' : '+'
                            }
                        </button>
                    </div>
                </div>
            </div>
            {props.isOpen &&
                <Fragment>
                    <div className='col-9 col-md-6 mt-1'>
                        <input
                            className='form-control'
                            placeholder='new menu item name'
                            value={newMenuItemName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMenuItemName(e.target.value)}
                            />
                    </div>
                    <div className='col-3 col-md-6'>
                        <LoadingIconButton
                            btnClass='btn btn-sm btn-outline-success'
                            outerClass='mt-1'
                            label='+'
                            busy={creatingMenuItem}
                            onClick={createMenuItem}
                        />
                    </div>
                    {
                        category.menu_items.map((menuItem: MenuItem) =>
                            <div className='col-12 col-md-6'>
                                <RestaurantMenuItem
                                    menuItem={menuItem}
                                />
                            </div>
                        )
                    }
                </Fragment>
            }
        </div>
    )
}