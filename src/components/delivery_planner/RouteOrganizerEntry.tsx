import React from 'react';
import Route from "../../models/RouteModel";
import adminService from '../../services/AdminService';

import './delivery_planner.scss';

interface Props {
    routeEntry: Route,
    mode: string,
    moveEntry: (routeEntry: Route, direction: string) => void,
    canMoveUp: boolean,
    canMoveDown: boolean
}

export const RouteOrganizerEntry = (props: Props): React.ReactElement => {
    const leg: any = JSON.parse(props.routeEntry.leg);

    const alertAndNav = (): void => {
        adminService.alertDelivery(props.routeEntry.id)
            .then(() => {})
        openMap();
    }

    const openMap = (): void => {
        window.open(`http://maps.google.com/?q=${props.routeEntry.order.street_address} ${props.routeEntry.order.zip}`, '_blank');
    }

    return (
        <div className='row route_organizer_entry'>
            <div className='col-12'>
                <div className='row organizer_entry__inner'>
                    <div className='col-12'>
                        <div className='organizer_entry__address'>
                            {props.routeEntry.order.street_address}
                        </div>
                        <div className='organizer_entry__time'>
                            {leg.duration.text}
                        </div>
                    </div>
                    <div className='col-12 organizer_entry__notes'>
                        {props.routeEntry.order.notes}
                    </div>
                    {props.mode === 'delivery' &&
                        <div className='col-12 organizer_entry__delivery_controls'>
                            <button className='btn btn-sm btn-outline-success' onClick={openMap}>navigate</button>
                            <button className='btn btn-sm btn-outline-warning' onClick={alertAndNav}>alert and nav</button>
                        </div>
                    }
                    {props.mode === 'plan' &&
                        <div className='col-12 organizer_entry__plan_controls'>
                            <button className='btn btn-sm btn-outline-success plan_controls__up_btn' disabled={!props.canMoveUp}
                                    onClick={() => props.moveEntry(props.routeEntry, 'up')}
                            >+</button>
                            <button className='btn btn-sm btn-outline-success plan_controls__down_btn' disabled={!props.canMoveDown}
                                    onClick={() => props.moveEntry(props.routeEntry, 'down')}
                            >-</button>
                            <button className='btn btn-sm btn-outline-success plan_controls__top_btn' disabled={!props.canMoveUp}
                                    onClick={() => props.moveEntry(props.routeEntry, 'top')}
                            >t</button>
                            <button className='btn btn-sm btn-outline-success plan_controls__bottom_btn' disabled={!props.canMoveDown}
                                    onClick={() => props.moveEntry(props.routeEntry, 'bottom')}
                            >b</button>

                        </div>
                    }
                </div>
            </div>
        </div>
    )
}