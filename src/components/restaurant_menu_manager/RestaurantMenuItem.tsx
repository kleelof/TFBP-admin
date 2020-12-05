import React, {ChangeEvent, useState} from 'react';
import './rest_menu_manager.scss';
import { useHistory } from 'react-router-dom';
import MenuCategoryItem from "../../models/MenuCategoryItemModel";
import menuCategoryItemService from '../../services/MenuCategoryItemService';
import {config} from "../../config";
import DeliveryDayItem from "../../models/DeliveryDayItemModel";

interface Props {
    categoryItem: DeliveryDayItem,
    deleteMenuItem: (item: DeliveryDayItem) => void,
    categoryItemUpdated: (item: DeliveryDayItem) => void
}

export const RestaurantMenuItem = (props: Props): React.ReactElement => {

    let history = useHistory();
    const [categoryItem, setCategoryItem] = useState(props.categoryItem);

    const deleteMe = (): void => {
        if (window.confirm(`Are you sure you want to remove "${props.categoryItem.menu_item.name}"?`))
            props.deleteMenuItem(props.categoryItem);
    }

    const soldOut = (): void => {
        let item: DeliveryDayItem = categoryItem;
        if (categoryItem.sold_out) {
            item.sold_out = false;
        } else {
            if (!window.confirm(`Do you want to mark "${categoryItem.menu_item.name}" as SOLD OUT?\n\nMarking item sold out will exclude it from pick-up and delivery orders only.`)) return;
            item.sold_out = true;
        }
/*
        menuCategoryItemService.update<MenuCategoryItem>(item)
            .then((categoryItem: DeliveryDayItem) => {
                setCategoryItem(categoryItem);
                props.categoryItemUpdated(categoryItem);
            })
            .catch( err => window.alert('unable to update sold out status'))

 */
    }

    const updatePrice = (): void => {
    }

    return (
        <div
            className='row restaurant_menu_item'
        >
            <div className={`col-12 ${categoryItem.sold_out? "restaurant_menu_item--error" : ""} restaurant_menu_item__header`}>
                <div className='row'>
                    <div className='col-9'>
                        {categoryItem.menu_item.name}
                    </div>
                    <div className={`col-3 ${categoryItem.price === 0 ? "restaurant_menu_item--error" : ""}`}>
                        ${categoryItem.price.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className={`col-${categoryItem.menu_item.image ? '7' : '12'} restaurant_menu_item__description`}>
                {categoryItem.menu_item.description}
            </div>
            {categoryItem.menu_item.image &&
                <div className='col-5 restaurant_menu_item__image'>
                    <img src={config.API_URL + config.UPLOADS_PATH + '/' + categoryItem.menu_item.image} />
                </div>
            }
            <div className='col-5'>
                <input
                    className='form-control'
                    type='number'
                    value={categoryItem.price}
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setCategoryItem({...categoryItem, price: parseFloat(e.target.value)})}
                    onBlur={updatePrice}
                    />
            </div>
            <div className='col-7 text-right mt-1'>
                <button
                    className={`btn btn-sm btn-${categoryItem.sold_out ? 'danger' : 'outline-secondary'} mr-1`}
                    onClick={soldOut}
                >sold out</button>
                <button
                    className='btn btn-sm btn-outline-primary mr-1'
                    onClick={() => history.push({pathname: `/dashboard/menu/edit/${categoryItem.menu_item.id}/`})}
                    >E</button>
                <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={deleteMe}
                >X</button>
            </div>
        </div>
    )
}