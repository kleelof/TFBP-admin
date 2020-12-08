import React, {ChangeEvent, useState} from 'react';
import './rest_menu_manager.scss';
import { useHistory } from 'react-router-dom';
import {config} from "../../config";
import DeliveryDayItem from "../../models/DeliveryDayItemModel";
import deliveryDayItemService from '../../services/DeliveryDayItemService';

interface Props {
    menuItem: DeliveryDayItem,
    deleteMenuItem: (item: DeliveryDayItem) => void,
    categoryItemUpdated: (item: DeliveryDayItem) => void
}

export const RestaurantMenuItem = (props: Props): React.ReactElement => {

    let history = useHistory();
    const [menuItem, setCategoryItem] = useState(props.menuItem);

    const deleteMe = (): void => {
        if (window.confirm(`Are you sure you want to remove "${props.menuItem.menu_item.name}"?`))
            props.deleteMenuItem(props.menuItem);
    }

    const soldOut = (): void => {
        let item: DeliveryDayItem = menuItem;
        
        if (menuItem.sold_out) {
            item.sold_out = false;
        } else {
            if (!window.confirm(`Do you want to mark "${menuItem.menu_item.name}" as SOLD OUT?\n\nMarking item sold out will exclude it from pick-up and delivery orders only.`)) return;
            item.sold_out = true;
        }

        deliveryDayItemService.update<DeliveryDayItem>(item)
            .then((mi: DeliveryDayItem) => {
                setCategoryItem(mi);
                props.categoryItemUpdated(mi);
            })
            .catch( err => window.alert('unable to update sold out status'))
    }

    const updatePrice = (): void => {
    }

    return (
        <div
            className='row restaurant_menu_item'
        >
            <div className={`col-12 ${menuItem.sold_out? "restaurant_menu_item--error" : ""} restaurant_menu_item__header`}>
                <div className='row'>
                    <div className='col-9'>
                        {menuItem.menu_item.name}
                    </div>
                    <div className={`col-3 ${menuItem.price === 0 ? "restaurant_menu_item--error" : ""}`}>
                        ${menuItem.price.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className={`col-${menuItem.menu_item.image ? '7' : '12'} restaurant_menu_item__description`}>
                {menuItem.menu_item.description}
            </div>
            {menuItem.menu_item.image &&
                <div className='col-5 restaurant_menu_item__image'>
                    <img src={config.API_URL + config.UPLOADS_PATH + '/' + menuItem.menu_item.image} />
                </div>
            }
            <div className='col-12'>
                <div className='row'>
                    <div className='col-6 text-center'>
                        <input
                            className='form-control'
                            type='number'
                            value={menuItem.price}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setCategoryItem({...menuItem, price: parseFloat(e.target.value)})}
                            onBlur={updatePrice}
                            />
                            <small>price</small>
                    </div>
                    <div className='col-6 text-right'>
                        <button
                            className={`btn btn-sm btn-${menuItem.sold_out ? 'danger' : 'outline-secondary'} mr-1`}
                            onClick={soldOut}
                        >sold out</button>
                    </div>
                </div>
            </div>
            <div className='col-12 text-right mt-1'>
                <button
                    className='btn btn-sm btn-outline-primary mr-1'
                    onClick={() => history.push({pathname: `/dashboard/menu/edit/${menuItem.menu_item.id}/`})}
                    >edit</button>
                <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={deleteMe}
                >delete</button>
            </div>
        </div>
    )
}