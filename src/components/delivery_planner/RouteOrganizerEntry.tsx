import React from 'react';
import Route from "../../models/RouteModel";
import adminService from '../../services/AdminService';

import './delivery_planner.scss';

interface Props {
    routeEntry: Route
}

export const RouteOrganizerEntry = (props: Props): React.ReactElement => {
    const leg: any = JSON.parse(props.routeEntry.leg);

    const alertAndNav = (): void => {
        adminService.alertDelivery(props.routeEntry.id);
        openMap();
    }

    const openMap = (): void => {
        window.open(`http://maps.google.com/?q=${props.routeEntry.order.street_address} ${props.routeEntry.order.zip}`, '_blank');
    }

    return (
        <div className='row route_organizer_entry'>
            <div className='col-12'>
                <div className='organizer_entry__address'>
                    {props.routeEntry.order.street_address}
                </div>
                <div className='organizer_entry__time'>
                    {leg.duration.text}
                </div>
            </div>
            <div className='col-12'>
                <button className='btn btn-outline-success' onClick={openMap}>navigate</button>
                <button className='btn btn-outline-warning' onClick={alertAndNav}>alert and nav</button>
            </div>
        </div>
    )
}