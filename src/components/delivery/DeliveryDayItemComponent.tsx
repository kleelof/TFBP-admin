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
            <div className={'col-12'}>
                <div className={'row delivery_day_item__inner'}>
                    <div className="col-12 delivery_day_item__name">{props.item.menu_item.name}</div>
                    <div className="col-12">
                        <div className='delivery_day_item__img'>
                            <img
                                src={`${config.API_URL + config.UPLOADS_PATH}/${props.item.menu_item.image}`}
                                alt={props.item.menu_item.name}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <DeliveryDayItemOptionsComponent deliveryDayItem={props.item} refreshItems={async () => props.refreshItems()} />
                    </div>
                </div>
            </div>
        </div>
    )
}