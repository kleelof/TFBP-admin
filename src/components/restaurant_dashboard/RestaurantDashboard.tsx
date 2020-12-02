import React from 'react';
import {RestaurantDashboardPanel} from "./RestaurantDashboardPanel";
import {ORDER_TYPES} from "../../models/OrderModel";
import './restaurant_dashboard.scss';
import { useDispatch } from 'react-redux';
import {addOverlay} from "../../store/helpersReducer";
import {RouteOrder} from "../create_order/RouteOrder";

export const RestaurantDashboard = (): React.ReactElement => {

    const dispatch = useDispatch();

    return (
        <div className='row rest_dashboard'>
            <div className='col-12'>
                <h3>Dashboard</h3>
                <hr/>
            </div>
            <div className='col-12 text-center'>
                <button
                    className='btn btn-outline-info'
                    onClick={() => {
                        dispatch(
                            addOverlay(
                                <RouteOrder />
                            )
                        )
                    }}
                    >create order</button>
            </div>
            <div className='col-12'>
                <hr/>
            </div>
            <div className='col-12 col-md-4'>
                <RestaurantDashboardPanel
                    orders_type={ORDER_TYPES.pickUp}
                    />
            </div>
            <div className='col-12 col-md-4'>
                <RestaurantDashboardPanel
                    orders_type={ORDER_TYPES.jit_delivery}
                    />
            </div>
            <div className='col-12 col-md-4'>
                <RestaurantDashboardPanel
                    orders_type={ORDER_TYPES.future_delivery}
                    />
            </div>
        </div>
    )
}