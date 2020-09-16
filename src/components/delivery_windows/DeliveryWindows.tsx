import React, {useEffect, useState} from 'react';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import deliveryWindowService from '../../services/DeliveryWindowService';

import './delivery_windows.scss';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { DeliveryWindowsWindow } from './DeliveryWindowsWindow';

import { pythonDays } from '../../constants';
import { useHistory, Link } from 'react-router-dom';

interface Props {
}

export const DeliveryWindows = (props: Props): React.ReactElement => {
    const [showLoading, setShowLoading] = useState(true);
    const [deliveryWindows, setDeliveryWindows] = useState<DeliveryWindow[]>([])
    const history = useHistory();

    useEffect(() => {
        deliveryWindowService.get<DeliveryWindow[]>()
            .then((deliveryWindows: DeliveryWindow[]) => {
                setShowLoading(false);
                setDeliveryWindows(deliveryWindows);
            })
            .catch( err => window.alert('Unable to load delivery windows'))
    }, [])


        if (showLoading)
            return(<LoadingOverlay />)

        return (
            <div className="row delivery_windows">
                <div className={'col-12'}>
                    <Link className={'btn btn-outline-info'} to={'/dashboard/delivery_window/add'}>add new delivery window</Link>
                </div>
                <div className={'col-12 mt-2'}>
                    <table className={'table'}>
                        <thead>
                            <tr>
                                <th>active</th>
                                <th>name</th>
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