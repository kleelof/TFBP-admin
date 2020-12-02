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

    const createWindow = (): void => {
        setCreatingWindow(true);
        deliveryWindowService.add<DeliveryWindow>(new DeliveryWindow(
            -1, '', '17:00:00', '21:00:00', 0, true, null, null, 1
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
                                <div className='row restaurant_delivery__day justify-content-center'>
                                    <div className='col-6 day_name'>
                                        {day}
                                    </div>
                                    <div className='col-6 text-right'>
                                        <LoadingIconButton
                                            label='add window'
                                            btnClass='btn btn-sm btn-outline-success'
                                            onClick={createWindow}
                                            busy={creatingWindow}
                                            />
                                    </div>
                                    <div className='col-11'>
                                        {
                                            deliveryWindows[index].map((window: DeliveryWindow) =>
                                                <div className='row' key={`window_${window.id}`}>
                                                    <div className='col-3'>
                                                        {windowTypes[window.type]}
                                                    </div>
                                                    <div className='col-5'>
                                                        {moment(window.start_time, 'HH:mm:ss').format('h:mm a')} -&nbsp;
                                                        {moment(window.end_time, 'HH:mm:ss').format('h:mm a')}
                                                    </div>
                                                    <div className='col-3 text-right'>
                                                        <button
                                                            className='btn btn-sm btn-outline-primary mr-1'
                                                            onClick={() => history.push({pathname: `/dashboard/delivery_window/edit/${window.id}/`})}
                                                            >E</button>
                                                        <button
                                                            className='btn btn-sm btn-outline-danger'
                                                            onClick={() => deleteWindow(window)}
                                                            >X</button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
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