import React, {useState, Fragment, ChangeEvent} from 'react';

import './rest_menu_manager.scss';
import MenuItem from "../../models/MenuItemModel";
import {RestaurantMenuItem} from "./RestaurantMenuItem";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import deliveryDayItemService from '../../services/DeliveryDayItemService';
import { useHistory } from 'react-router-dom';
import menuItemService from '../../services/MenuItemService';
import DeliveryDayMenuCategory from "../../models/DeliveryDayMenuCategory";
import deliveryDayService from '../../services/DeliveryDayItemService';
import DeliveryDayItem, {DeliveryDayItemDTO} from "../../models/DeliveryDayItemModel";
import SearchWidget from "../widgets/searchWidget/SearchWidget";
import DeliveryDay from "../../models/DeliveryDayModel";

interface Props {
    deliveryDay: DeliveryDay,
    category: DeliveryDayMenuCategory,
    move: (direction: number, category: DeliveryDayMenuCategory) => void,
    canMoveUp: boolean,
    canMoveDown: boolean,
    isOpen: boolean,
    categorySelected: (category: DeliveryDayMenuCategory | null) => void;
}

export const RestaurantMenuCategory = (props: Props): React.ReactElement => {

    const history = useHistory();
    const [creatingMenuItem, setCreatingMenuItem] = useState(false);
    const [category, setCategory] = useState<DeliveryDayMenuCategory>(props.category);
    const [menuItem, setMenuItem] = useState<MenuItem | string>('');

    const createMenuItem = (): void => {
        setCreatingMenuItem(true);

        if (typeof menuItem === 'string') {
            menuItemService.add<MenuItem>({name: menuItem, delivery_category: category.id} as any)
                .then((menuItem: MenuItem) => completeCreateMenuItem(menuItem, true))
                .catch( err => window.alert('unable to create menu item'))
        } else {
            completeCreateMenuItem(menuItem);
        }
    }

    const completeCreateMenuItem = (menuItem: MenuItem, isNew: boolean = false): void => {
        deliveryDayItemService.add<DeliveryDayItem>(
                {
                    delivery_day: props.deliveryDay.id,
                    menu_item: menuItem.id,
                    delivery_category: category.id
                } as any
            )
            .then((item: DeliveryDayItem) => {
                if (isNew) { // new menu item, go edit
                    history.push({pathname: `/dashboard/menu/edit/${menuItem.id}/`})
                } else { // existing menu item, no edit
                    setMenuItem('');
                    setCategory({
                        ...category,
                        delivery_day_items: [...category.delivery_day_items, item as any]
                    })
                }
            })
            .catch( err => window.alert('unable to add menu item'))
            .finally(() => setCreatingMenuItem(false))
    }

    const deleteDeliveryDayItem = (item: DeliveryDayItem): void => {
        deliveryDayService.delete(item.id)
            .then(() => setCategory({
                ...category,
                delivery_day_items: category.delivery_day_items.filter((i: DeliveryDayItem) => i.id !== item.id)
            }))
            .catch( err => window.alert('unable to delete menu item'))
    }
/*
    const updateCategory = (): void => {
        menuCategoryService.update<MenuCategory>(category)
            .then((cat: MenuCategory) => setCategory(cat))
            .catch( err => window.alert('unable to update category name'))
    }

 */

    const categoryItemUpdated = (menuItem: DeliveryDayItem): void => {
        setCategory({
            ...category,
            delivery_day_items: category.delivery_day_items.map((item: DeliveryDayItem) => item.id === menuItem.id ? menuItem : item)
        })
    }

    const menuItemSelected = (menuItem: MenuItem | string): void => {
        setMenuItem(menuItem);
    }

    let hasSoldOut: boolean = category.delivery_day_items.filter((item: DeliveryDayItem) => item.sold_out).length > 0;

    return (
        <div className='row menu_category'>
            <div className='col-12 menu_category__inner'>
                <div className='row'>
                    <div className='col-8 col-md-8 menu_category__name'>
                        {category.menu_category.name}
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
                        <SearchWidget
                            placeholder='new menu item name'
                            serviceFunction={menuItemService.pagedSearchResults}
                            itemSelected={menuItemSelected}
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
                        category.delivery_day_items.map((item: DeliveryDayItem) =>
                            <div className='col-12 col-md-6'>
                                <RestaurantMenuItem
                                    menuItem={item}
                                    deleteMenuItem={deleteDeliveryDayItem}
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