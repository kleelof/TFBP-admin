import React, {useState, Fragment} from 'react';
import routeStopService from '../../services/RouteStopService';

import './delivery_planner.scss';
import RouteStop from "../../models/RouteStopModel";
import moment from "moment";

interface Props {
    stop: RouteStop,
    mode: string,
    moveStop: (stop: RouteStop, direction: string) => void,
    canMoveUp: boolean,
    canMoveDown: boolean
}

export const RouteOrganizerEntry = (props: Props): React.ReactElement => {
    const leg: any = JSON.parse(props.stop.leg);
    const [atStop, setAtStop] = useState(false);
    const [completed, setCompleted] = useState<boolean>(props.stop.delivered_at !== null)
    const [stop, setStop] = useState(props.stop)

    const alertAndNav = (): void => {
        routeStopService.alertDelivery(props.stop)
            .then(() => {})
        openMap();
    }

    const completeDelivery = (): void => {
        routeStopService.delivered(props.stop)
            .then((s: RouteStop) => {
                setAtStop(false);
                setCompleted(true);
                setStop(s);
            })
    }

    const openMap = (): void => {
        window.open(`http://maps.google.com/?q=${stop.order.street_address} ${props.stop.order.zip}`, '_blank');
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
                    {completed &&
                        <Fragment>
                            Delivered at: {moment(stop.delivered_at).utc().format('h:mm a')}
                        </Fragment>
                    }
                    {!completed &&
                        <Fragment>
                            {(props.mode === 'delivery' && !atStop) &&
                                <div className='col-12 organizer_entry__delivery_controls'>
                                    <button className='btn btn-sm btn-outline-success' onClick={openMap}>navigate</button>
                                    <button className='btn btn-sm btn-outline-danger ml-2' onClick={alertAndNav}>alert and nav</button>
                                    <button className='btn btn-sm btn-outline-info ml-2' onClick={()=>setAtStop(true)}>arrive</button>
                                </div>
                            }
                            {(props.mode === 'delivery' && atStop) &&
                                <div className='col-12 organizer_entry__delivery_controls'>
                                    <button className='btn btn-sm btn-outline-success' onClick={completeDelivery}>completed</button>
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
                        </Fragment>
                    }

                </div>
            </div>
        </div>
    )
}