import React, {useState, Fragment} from 'react';
import routeStopService from '../../services/RouteStopService';

import './delivery_planner.scss';
import RouteStop from "../../models/RouteStopModel";
import moment from "moment";
import Route from "../../models/RouteModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import MomentHelper from "../../helpers/MomentHelper";

interface Props {
    stop: RouteStop,
    route: Route,
    moveStop: (stop: RouteStop, direction: string) => void,
    canMoveUp: boolean,
    canMoveDown: boolean
}

export const RouteOrganizerEntry = (props: Props): React.ReactElement => {

    const [stop, setStop] = useState(props.stop);
    const [loadButtonActive, setLoadButtonActive] = useState('');

    const atStop = (): void => {
        setLoadButtonActive('at_stop');
        routeStopService.at_stop(props.stop)
            .then((stop:RouteStop) => setStop(stop))
            .catch(() => window.alert('unable to at_stop'))
            .then(() => setLoadButtonActive(''))
    }

    const cancelDelivery = (): void => {
        if (!window.confirm('are you sure you want to cancel this stop? \n\nThis cannot be reversed.')) return;

        setLoadButtonActive('canceling_delivery');
        routeStopService.cancel(props.stop)
            .then((stop:RouteStop) => setStop(stop))
            .catch(() => window.alert('unable to cancel'))
            .then(() => setLoadButtonActive(''))
    }

    const completeDelivery = (): void => {
        setLoadButtonActive('completing_delivery');
        routeStopService.delivered(props.stop)
            .then((s: RouteStop) => {setStop(s)})
            .catch(() => window.alert('unable to complete'))
            .then(() => setLoadButtonActive('canceling_delivery'))
    }

    const navigate = (): void => {
        openMap();
        routeStopService.en_route(props.stop)
            .then((stop:RouteStop) => setStop(stop))
            .catch(() => window.alert('unable to en_route'))
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
                            {stop.current_index + 1}. &nbsp;
                            {stop.order.street_address}
                        </div>
                        {(props.route.route_status > 0 && props.route.route_status < 4) &&
                            <div className='organizer_entry__time'>
                                {`${moment(props.route.delivery_window.start_time, 'HH:mm:ss')
                                    .add(stop.eta, 'seconds')
                                    .subtract(10, 'minutes')
                                    .format('HH:mm')} - 
                                    ${moment(props.route.delivery_window.start_time, 'HH:mm:ss')
                                        .add(stop.eta, 'seconds')
                                        .subtract(10, 'minutes')
                                        .add(20, 'minutes')
                                        .format('HH:mm')}`}
                            </div>
                        }
                    </div>
                    <div className='col-12 organizer_entry__notes'>
                        {stop.order.notes}
                    </div>
                    <div className='col-12 text-center'>
                            {stop.stop_status === 3 && // delivery completed
                                <Fragment>
                                    {
                                        <Fragment>
                                            delivered: {MomentHelper.asFullDateTime(stop.delivered_at)}
                                        </Fragment>
                                    }

                                </Fragment>
                            }
                            {(props.route.route_status === 3 && stop.stop_status !== 3) && // route completed
                                <Fragment>
                                    there was no delivery time recorded
                                </Fragment>
                            }
                            {stop.stop_status === 4 &&
                                <Fragment>
                                    canceled
                                </Fragment>
                            }

                            {stop.stop_status < 3 &&
                                <Fragment>
                                    <div className='col-12 organizer_entry__delivery_controls'>
                                        {(props.route.route_status === 2 && stop.stop_status === 0) &&
                                            <button className='btn btn-sm btn-outline-success delivery_controls__navigate mr-2' onClick={() => navigate()}>navigate</button>
                                        }
                                        {(props.route.route_status === 2 && stop.stop_status !== 0) &&
                                            <Fragment>
                                                {stop.stop_status === 1 &&
                                                    <LoadingIconButton
                                                        busy={loadButtonActive ==='at_stop'}
                                                        outerClass='mr-2 delivery_controls__arrive'
                                                        btnClass={'btn btn-sm btn-outline-info'}
                                                        label={'arrive'}
                                                        onClick={atStop} />
                                                }
                                                {stop.stop_status === 2 &&
                                                    <LoadingIconButton
                                                        busy={loadButtonActive ==='completing_delivery'}
                                                        outerClass='mr-2 delivery_controls__finished'
                                                        btnClass={'btn btn-sm btn-outline-success'}
                                                        label={'finished'}
                                                        onClick={completeDelivery} />
                                                }
                                            </Fragment>
                                        }
                                        {props.route.route_status === 2 &&
                                            <LoadingIconButton
                                                busy={loadButtonActive ==='canceling_delivery'}
                                                outerClass='mr-2 organizer_entry__cancel'
                                                btnClass={'btn btn-sm btn-outline-danger'}
                                                label={'cancel'}
                                                onClick={cancelDelivery} />
                                        }
                                    </div>
                                    {props.route.route_status === 0 && // non commited
                                        <div className='col-12 organizer_entry__plan_controls'>
                                            <button className='btn btn-sm btn-outline-success plan_controls__up_btn mr-2' disabled={!props.canMoveUp}
                                                    onClick={() => props.moveStop(stop, 'up')}
                                            >up</button>
                                            <button className='btn btn-sm btn-outline-success plan_controls__down_btn mr-2' disabled={!props.canMoveDown}
                                                    onClick={() => props.moveStop(stop, 'down')}
                                            >down</button>
                                            <button className='btn btn-sm btn-outline-success plan_controls__top_btn mr-2' disabled={!props.canMoveUp}
                                                    onClick={() => props.moveStop(stop, 'top')}
                                            >first</button>
                                            <button className='btn btn-sm btn-outline-success plan_controls__bottom_btn' disabled={!props.canMoveDown}
                                                    onClick={() => props.moveStop(stop, 'bottom')}
                                            >last</button>

                                        </div>
                                    }
                                </Fragment>
                            }
                    </div>

                </div>
            </div>
        </div>
    )
}