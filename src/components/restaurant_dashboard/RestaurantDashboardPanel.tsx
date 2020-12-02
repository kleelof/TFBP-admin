import React from 'react';
import {activityTypes} from "../../constants";

interface Props {
    orders_type: number
}

export const RestaurantDashboardPanel = (props: Props): React.ReactElement => {



    return(
        <div className='row rest_dashboard_panel'>
            <div className='col-12'>
                <h3>{activityTypes[props.orders_type]}</h3>
            </div>
        </div>
    )
}