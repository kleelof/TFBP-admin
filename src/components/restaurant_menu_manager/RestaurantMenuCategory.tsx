import React, {useState, Fragment, ChangeEvent} from 'react';
import {MenuCategory} from "../../models/MenuCategoryModel";

import './rest_menu_manager.scss';
import MenuItem from "../../models/MenuItemModel";
import {RestaurantMenuItem} from "./RestaurantMenuItem";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import menuCategoryItemService from '../../services/MenuCategoryItemService';
import { useHistory } from 'react-router-dom';
import MenuCategoryItem from "../../models/MenuCategoryItemModel";
import menuCategoryService from '../../services/MenuCategoryService';

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
        menuCategoryItemService.add<MenuCategoryItem>(new MenuCategoryItem(props.category.id, {name: newMenuItemName} as MenuItem))
            .then((categoryItem: MenuCategoryItem) => {
                history.push({pathname: `/dashboard/menu/edit/${categoryItem.menu_item.id}/`})
            })
            .catch( err => window.alert('unable to add menu item'))
    }

    const deleteMenuItem = (item: MenuCategoryItem): void => {
        menuCategoryItemService.delete(item.id)
            .then(() => setCategory({...category, items: category.items.filter((i: MenuCategoryItem) => i.id !== item.id)}))
            .catch( err => window.alert('unable to delete menu item'))
    }

    const updateCategory = (): void => {
        menuCategoryService.update<MenuCategory>(category)
            .then((cat: MenuCategory) => setCategory(cat))
            .catch( err => window.alert('unable to update category name'))
    }

    const categoryItemUpdated = (menuItem: MenuCategoryItem): void => {
        setCategory({...category, items: category.items.map((item: MenuCategoryItem) => item.id === menuItem.id ? menuItem : item)})
    }

    let hasSoldOut: boolean = category.items.filter((item: MenuCategoryItem) => item.sold_out).length > 0;

    return (
        <div className='row menu_category'>
            <div className='col-12 menu_category__inner'>
                <div className='row'>
                    <div className='col-8 col-md-8 menu_category__name'>
                        <input
                            className='form-control'
                            value={category.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory({...category, name: e.target.value})}
                            onBlur={updateCategory}
                            />
                    </div>
                    <div className='col-4 col-md-4 menu_category__controls text-right'>
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
                        {hasSoldOut &&
                            <div className='menu_category__has_sold_out'>has sold out item</div>
                        }
                    </div>
                </div>
            </div>
            {props.isOpen &&
                <Fragment>
                    <div className='col-7 col-md-6 mt-1'>
                        <input
                            className='form-control'
                            placeholder='new menu item name'
                            value={newMenuItemName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMenuItemName(e.target.value)}
                            />
                    </div>
                    <div className='col-3 col-md-3'>
                        <LoadingIconButton
                            btnClass='btn btn-sm btn-outline-success'
                            outerClass='mt-1'
                            label='+'
                            busy={creatingMenuItem}
                            onClick={createMenuItem}
                        />
                    </div>
                    {
                        category.items.map((item: MenuCategoryItem) =>
                            <div className='col-12 col-md-6'>
                                <RestaurantMenuItem
                                    categoryItem={item}
                                    deleteMenuItem={deleteMenuItem}
                                    categoryItemUpdated={categoryItemUpdated}
                                />
                            </div>
                        )
                    }
                </Fragment>
            }
        </div>
    )
}