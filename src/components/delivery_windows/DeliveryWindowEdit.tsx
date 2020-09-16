import React, {ChangeEvent, useEffect, useState} from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import deliveryWindowService from '../../services/DeliveryWindowService';
import { useParams, useHistory } from 'react-router-dom';
import DeliveryWindow from "../../models/DeliveryWindowModel";


export const DeliveryWindowEdit = (): React.ReactElement => {
    const history = useHistory();
    const params: any = useParams();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [deliveryWindow, setWindow] = useState<DeliveryWindow>(new DeliveryWindow());
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (params.id === undefined) {
            setShowLoading(false);
        } else {
            deliveryWindowService.get<DeliveryWindow>(params.id)
                .then((deliveryWindow: DeliveryWindow) => {
                    setWindow(deliveryWindow);
                    setShowLoading(false);
                })
                .catch( err => window.alert('unable to load window'));
        }
    }, []);

    const saveWindow = (): void => {
        setDisabled(true);

        if (deliveryWindow.id === -1) {
            deliveryWindowService.add<DeliveryWindow>(deliveryWindow)
                .then((deliveryWindow: DeliveryWindow) => {
                    setWindow(deliveryWindow);
                    window.alert('your delivery window has been created')
                })
                .catch( err => window.alert('unable to create window'))
                .then(() => setDisabled(false))
        } else {
            deliveryWindowService.update<DeliveryWindow>(deliveryWindow.id, deliveryWindow)
                .then(() => {})
                .catch( err => window.alert('unable to update window'))
                .then(() => setDisabled(false))
        }
    }

    const updateData = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setWindow({...deliveryWindow, [e.target.id]: e.target.value});
    }

    if (showLoading)
        return(<LoadingOverlay />)

    return (
        <div className={'row delivery_window_edit justify-content-center'}>
            <div className={'col-12 col-md-5'}>
                <h3>Edit Delivery Window</h3>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <div className={'delivery_window_edit__prompt'}>name:</div>
                        <input className={'form-control'} type={'text'} id={'name'}
                               value={deliveryWindow.name}
                               onChange={updateData} />
                    </div>
                    <div className={'col-6 mt-2'}>
                        <div className={'delivery_window_edit__prompt'}>day:</div>
                        <select className={'form-control'} id={'day'}
                                value={deliveryWindow.day}
                                onChange={updateData}
                        >
                            <option value={6}>sunday</option>
                            <option value={0}>monday</option>
                            <option value={1}>tuesday</option>
                            <option value={2}>wednesday</option>
                            <option value={3}>thursday</option>
                            <option value={4}>friday</option>
                            <option value={5}>saturday</option>
                        </select>
                    </div>
                    <div className={'col-6 mt-2'}>
                        <div className={'delivery_window_edit__prompt'}>active:</div>
                        <input type={'checkbox'} className={''} id={'active'}
                               checked={deliveryWindow.active}
                               onChange={() => setWindow({...deliveryWindow, active: !deliveryWindow.active})}
                        />
                    </div>
                    <div className={'col-6 mt-2'}>
                        <div className={'delivery_window_edit__prompt'}>start time:</div>
                        <input type={'time'} className={'form-control'} id={'start_time'}
                        value={deliveryWindow.start_time}
                        onChange={updateData}/>
                    </div>
                    <div className={'col-6 mt-2'}>
                        <div className={'delivery_window_edit__prompt'}>end time:</div>
                        <input type={'time'} className={'form-control'} id={'end_time'}
                        value={deliveryWindow.end_time} onChange={updateData}/>
                    </div>
                    <div className={'col-10 mt-2'}>
                        <div className={'delivery_window_edit__prompt'}>start date:</div>
                        <input type={'date'} className={'form-control'} id={'start_date'}
                               value={deliveryWindow.start_date || ''} onChange={updateData}/>
                    </div>
                    <div className={'col-2 mt-4'}>
                        <button className={'btn btn-outline-danger'}
                                onClick={() => setWindow({...deliveryWindow, start_date: null})}
                        >clear</button>
                    </div>
                    <div className={'col-10 mt-2'}>
                        <div className={'delivery_window_edit__prompt'}>end date:</div>
                        <input type={'date'} className={'form-control'} id={'end_date'}
                               value={deliveryWindow.end_date || ''} onChange={updateData} />
                    </div>
                    <div className={'col-2 mt-4'}>
                        <button className={'btn btn-outline-danger'}
                                onClick={() => setWindow({...deliveryWindow, end_date: null})}>clear</button>
                    </div>
                    <div className={'col-12 mt-2 text-center'}>
                        <button
                            className={'btn btn-success'}
                            disabled={disabled}
                            onClick={saveWindow}
                        >
                            save
                        </button>

                        <button
                            onClick={() => history.push({pathname: '/dashboard/delivery_window'})}
                            className={'btn btn-outline-info ml-2'}
                            disabled={disabled}
                        >
                            return to delivery windows
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}