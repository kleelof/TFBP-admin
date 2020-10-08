/*
    Lists each individual DeliveryDays in the delivery menus page
 */
import React from 'react';
import DeliveryDay from '../../models/DeliveryDayModel';
import momentHelper from '../../helpers/MomentHelper';
import helpers from '../../helpers/helpers';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import { config } from '../../config';
import { useHistory } from 'react-router-dom';

import './delivery.scss';

interface Props {
    deliveryDay: DeliveryDay
}

export const DeliveryDays = (props: Props): React.ReactElement => {
    const history = useHistory();

    return(
        <div className="row delivery_days" key={`days_${props.deliveryDay.id}`}>
            <div className='delivery_days__inner'>
                <div className="col-12 col-md-6 delivery_days__date">
                    {momentHelper.asFullDate(props.deliveryDay.date)} -
                </div>
                <div className="col-12 col-md-6 delivery_days__end_date">
                    {momentHelper.asFullDate(props.deliveryDay.end_date)}
                </div>
                <div className="col-12" style={{whiteSpace: "nowrap"}}>
                    <div className="delivery_days__menu_items">
                        {
                            helpers.sortDeliveryDayItemsByCategory(props.deliveryDay.day_items).map((item: DeliveryDayItem) =>
                                    <div className="delivery_days__item" key={`ddi_${item.id}`}>
                                        <small>{item.menu_item.name}</small>
                                        <div className='delivery_days__item_img'>
                                            <img
                                                src={`${config.API_URL + config.UPLOADS_PATH}/${item.menu_item.image}`}
                                                alt={item.menu_item.name} />
                                        </div>
                                    </div>
                            )
                        }
                    </div>
                </div>
                <div className="col-12 mt-3 text-center">
                    <button
                        className="btn btn-sm btn-outline-success"
                        onClick={()=> {history.push({pathname: `/dashboard/delivery/edit/${props.deliveryDay.id}/`})}}>
                            edit
                        </button>
                    <button
                        className="btn btn-sm btn-outline-warning ml-2"
                        onClick={()=> {history.push({pathname: `/dashboard/delivery/duplicate/${props.deliveryDay.id}`})}}>
                            duplicate
                        </button>
                </div>
            </div>
        </div>
    )
}