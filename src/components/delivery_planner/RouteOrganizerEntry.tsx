import React from 'react';
import routeStopService from '../../services/RouteStopService';

import './delivery_planner.scss';
import RouteStop from "../../models/RouteStopModel";

interface Props {
    stop: RouteStop,
    mode: string,
    moveStop: (stop: RouteStop, direction: string) => void,
    canMoveUp: boolean,
    canMoveDown: boolean
}

export const RouteOrganizerEntry = (props: Props): React.ReactElement => {
    const leg: any = JSON.parse(props.stop.leg);

    const alertAndNav = (): void => {
        routeStopService.alertDelivery(props.stop.id)
            .then(() => {})
        openMap();
    }

    const openMap = (): void => {
        window.open(`http://maps.google.com/?q=${props.stop.order.street_address} ${props.stop.order.zip}`, '_blank');
    }

    return (
        <div className='row route_organizer_entry'>
            <div className='col-12'>
                <div className='row organizer_entry__inner'>
                    <div className='col-12'>
                        <div className='organizer_entry__address'>
                            {props.stop.order.street_address}
                        </div>
                        <div className='organizer_entry__time'>
                            {leg.duration.text}
                        </div>
                    </div>
                    <div className='col-12 organizer_entry__notes'>
                        {props.stop.order.notes}
                    </div>
                    {props.mode === 'delivery' &&
                        <div className='col-12 organizer_entry__delivery_controls'>
                            <button className='btn btn-sm btn-outline-success' onClick={openMap}>navigate</button>
                            <button className='btn btn-sm btn-outline-danger' onClick={alertAndNav}>alert and nav</button>
                        </div>
                    }
                    {props.mode === 'plan' &&
                        <div className='col-12 organizer_entry__plan_controls'>
                            <button className='btn btn-sm btn-outline-success plan_controls__up_btn' disabled={!props.canMoveUp}
                                    onClick={() => props.moveStop(props.stop, 'up')}
                            >+</button>
                            <button className='btn btn-sm btn-outline-success plan_controls__down_btn' disabled={!props.canMoveDown}
                                    onClick={() => props.moveStop(props.stop, 'down')}
                            >-</button>
                            <button className='btn btn-sm btn-outline-success plan_controls__top_btn' disabled={!props.canMoveUp}
                                    onClick={() => props.moveStop(props.stop, 'top')}
                            >t</button>
                            <button className='btn btn-sm btn-outline-success plan_controls__bottom_btn' disabled={!props.canMoveDown}
                                    onClick={() => props.moveStop(props.stop, 'bottom')}
                            >b</button>

                        </div>
                    }
                </div>
            </div>
        </div>
    )
}