import React from 'react';
import DeliveryDay from '../../models/DeliveryDayModel';
import helpers from '../../helpers/helpers';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import { config } from '../../config';
import { useHistory } from 'react-router-dom';

import './delivery.css';

interface Props {
    deliveryDay: DeliveryDay
}

export const DeliveryDays = (props: Props): React.ReactElement => {
    const history = useHistory();

    return(
        <div className="row delivery_days" key={`days_${props.deliveryDay.id}`}>
            <div className="col-12 col-md-6 delivery_days__date">
                {helpers.formatDate(props.deliveryDay.date)}
            </div>
            <div className="col-12 col-md-6 delivery_days__end_date">
                {helpers.formatDate(props.deliveryDay.end_date)}
            </div>
            <div className="col-12">
                <div className="row">
                    {
                        helpers.sortDeliveryDayItemsByCategory(props.deliveryDay.day_items).map((item: DeliveryDayItem) =>
                                <div className="col-4 delivery_days_item" key={`ddi_${item.id}`}>
                                    <small>{item.menu_item.name}</small>
                                    <div>
                                        <img
                                            src={`${config.API_URL + item.menu_item.image}`}
                                            alt={item.menu_item.name} />
                                    </div>
                                </div>
                        )
                    }
                </div>
            </div>
            <div className="col-12 text-center mt-3">
                <button
                    className="btn btn-success"
                    onClick={()=> {history.push({pathname: `/dashboard/delivery/edit/${props.deliveryDay.id}/`})}}>
                        Edit
                    </button>
                <button
                    className="btn btn-warning ml-2"
                    onClick={()=> {history.push({pathname: `/dashboard/delivery/duplicate/${props.deliveryDay.id}`})}}>
                        Duplicate
                    </button>
            </div>
        </div>
    )
}