import React from 'react';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import {config} from '../../config';
import DeliveryDayItemOptionsComponent from './DeliveryMenuItemOptionsComponent';

interface Props {
    item: DeliveryDayItem,
    refreshItems: () => void
}

export const DeliveryDayItemComponent = (props:Props) => {
    return(
        <div className="row delivery_day_item">
            <div className="col-12 delivery_day_item__name">{props.item.menu_item.name}</div>
            <div className="col-12">
                <img 
                    src={
                        props.item.menu_item.image.indexOf('http') === -1 ? 
                        config.API_URL + props.item.menu_item.image : props.item.menu_item.image
                    } 
                    alt={props.item.menu_item.name} />
            </div>
            <div className="col-12">
                <DeliveryDayItemOptionsComponent deliveryDayItem={props.item} refreshItems={async () => props.refreshItems()} />
            </div>
        </div>
    )
}