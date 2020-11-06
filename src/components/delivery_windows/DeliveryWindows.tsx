import React, {ChangeEvent, useEffect, useState} from 'react';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import deliveryWindowService from '../../services/DeliveryWindowService';

import './delivery_windows.scss';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { DeliveryWindowsWindow } from './DeliveryWindowsWindow';

import { useHistory, Link } from 'react-router-dom';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";

interface Props {
}

export const DeliveryWindows = (props: Props): React.ReactElement => {
    const [showLoading, setShowLoading] = useState(true);
    const [deliveryWindows, setDeliveryWindows] = useState<DeliveryWindow[]>([])
    const [newWindow, setNewWindow] = useState('');
    const [addingWindow, setAddingWindow] = useState(false);

    const history = useHistory()

    useEffect(() => {
        deliveryWindowService.get<DeliveryWindow[]>()
            .then((deliveryWindows: DeliveryWindow[]) => {
                setShowLoading(false);
                setDeliveryWindows(deliveryWindows);
            })
            .catch( err => window.alert('Unable to load delivery windows'))
    }, [])

    const addWindow = (): void => {
        setAddingWindow(true)
        deliveryWindowService.add(new DeliveryWindow(
            -1, newWindow, '17:00:00', '19:00:00', 0, false
        ))
            .then((window: DeliveryWindow) => history.push({pathname: `/dashboard/delivery_window/edit/${window.id}`}))
            .catch(() => window.alert('unable to create window'))
            .then(() => setAddingWindow(false))
    }

    if (showLoading)
        return(<LoadingOverlay />)

    return (
        <div className="row delivery_windows">
            <div className='col-12'>
                <h3>delivery windows</h3>
                <hr/>
            </div>
            <div className={'col-12'}>
                <div className='row'>
                    <div className='col-8 col-md-3'>
                        <input type='text' className='form-control'placeholder='new delivery window name'
                               onChange={(e:ChangeEvent<HTMLInputElement>) => setNewWindow(e.target.value)}
                        />
                    </div>
                    <div className='col-2'>
                        <LoadingIconButton label={'add window'} onClick={addWindow} busy={addingWindow}
                                           btnClass='btn btn-sm btn-outline-success' disabled={newWindow === ''}
                        />
                    </div>
                </div>
            </div>
            <div className={'col-12 mt-2'}>
                <table className={'table'}>
                    <thead>
                        <tr>
                            <th className='d-none d-md-table-cell'>name</th>
                            <th>day</th>
                            <th>time</th>
                            <th>run</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        deliveryWindows.map((window: DeliveryWindow) =>
                            <DeliveryWindowsWindow window={window}/>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const DeliveryWindowContainer = (props: {deliveryWindow: DeliveryWindow, windowSelected: (deliveryWindow: DeliveryWindow) => void}): any => {
    return (
        <div className="delivery-window-container" onDoubleClick={()=>{props.windowSelected(props.deliveryWindow)}}>
            {props.deliveryWindow.name}
        </div>
    )
}