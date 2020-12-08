import React, { useState } from 'react';
import './restaurant_delivery.scss';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import DeliveryWindow from "../../models/DeliveryWindowModel";
import deliveryWindowService from '../../services/DeliveryWindowService';
import { useHistory } from 'react-router-dom';
import LoadingOverlay from "../overlays/LoadingOverlay";
import moment from "moment";
import { pythonDays} from "../../constants";

export const RestaurantDelivery = (): React.ReactElement => {

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [creatingWindow, setCreatingWindow] = useState(false);
    const [deliveryWindows, setDeliveryWindows] = useState<DeliveryWindow[][]>([])

    const windowTypes: string[] = ['', 'pick-up', 'deliver ASAP', 'future delivery'];

    React.useEffect(() => {
        deliveryWindowService.get<DeliveryWindow[]>()
            .then((deliveryWindows: DeliveryWindow[]) => {
                let sortedWindows: DeliveryWindow[][] = [[], [], [], [], [], [], []];
                deliveryWindows.forEach((window: DeliveryWindow) => sortedWindows[window.day].push(window))
                setDeliveryWindows(sortedWindows);
                setLoading(false);
            })
    }, [])

    const createWindow = (day: number): void => {
        setCreatingWindow(true);
        deliveryWindowService.add<DeliveryWindow>(new DeliveryWindow(
            -1, '', '17:00:00', '21:00:00', day, true, null, null, 1
        ))
            .then((deliveryWindow: DeliveryWindow) => history.push({pathname: `/dashboard/delivery_window/edit/${deliveryWindow.id}/`}))
            .catch( err=> window.alert('unable to create window'))
    }

    const deleteWindow = (deliveryWindow: DeliveryWindow): void => {
        if (!window.confirm('Are you sure you want to remove this window?')) return;

        deliveryWindowService.delete(deliveryWindow.id)
            .then(() => {
                let delWindows: DeliveryWindow[][] = deliveryWindows;
                delWindows[deliveryWindow.day] = delWindows[deliveryWindow.day].filter((dw: DeliveryWindow) => dw.id !== deliveryWindow.id)
                setDeliveryWindows(delWindows);
            })
            .catch( err => window.alert('unable to delete window'))
    }

    if (loading)
        return <LoadingOverlay />

    return(
        <div className='row restaurant_delivery justify-content-center'>
            <div className='col-12 col-md-6'>
                <div className='row'>
                    <div className='col-12'>
                        <h3>activity windows</h3>
                        <hr/>
                    </div>
                    {
                        pythonDays.map((day: string, index: number) =>
                            <div className='col-12' key={day}>
                                <div className='row restaurant_delivery__day'>
                                    <div className='col-6 day_name'>
                                        {day}
                                    </div>
                                    <div className='col-6 text-right'>
                                        <LoadingIconButton
                                            label='add window'
                                            btnClass='btn btn-sm btn-outline-success'
                                            onClick={() => createWindow(index)}
                                            busy={creatingWindow}
                                            />
                                    </div>
                                    {
                                        deliveryWindows[index].map((window: DeliveryWindow) =>
                                            <div className='col-12 col-md-6' key={`window_${window.id}`}>
                                                <div className='row restaurant_delivery__window_inner'>
                                                    {!window.active &&
                                                        <div className='col-12 text-center restaurant_delivery--disabled'>
                                                            disabled
                                                        </div>
                                                    }
                                                    <div className='col-12'>
                                                        <strong>
                                                            {window.name || <div>&nbsp;</div>}
                                                        </strong>
                                                    </div>
                                                    <div className='col-12'>
                                                        {windowTypes[window.type]}
                                                    </div>
                                                    <div className='col-12'>
                                                        {moment(window.start_time, 'HH:mm:ss').format('h:mm a')} -&nbsp;
                                                        {moment(window.end_time, 'HH:mm:ss').format('h:mm a')}
                                                    </div>
                                                    <div className='col-12 text-right'>
                                                        <button
                                                            className='btn btn-sm btn-outline-primary mr-1'
                                                            onClick={() => history.push({pathname: `/dashboard/delivery_window/edit/${window.id}/`})}
                                                            >edit</button>
                                                        <button
                                                            className='btn btn-sm btn-outline-danger'
                                                            onClick={() => deleteWindow(window)}
                                                            >delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className='col-12'>
                                        <hr/>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}