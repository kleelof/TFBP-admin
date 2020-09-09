import React, {useEffect, useState} from 'react';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import deliveryWindowService from '../../services/DeliveryWindowService';

import './delivery_windows.scss';
import LoadingOverlay from "../overlays/LoadingOverlay";

import { pythonDays } from '../../constants';
import { useHistory } from 'react-router-dom';

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
                    <table className={'table'}>
                        <thead>
                            <tr>
                                <th>active</th>
                                <th>name</th>
                                <th>day</th>
                                <th>time</th>
                                <th>date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            deliveryWindows.map((window: DeliveryWindow) =>
                                <tr
                                    key={`dw_${window.id}`}
                                    className={`delivery_windows__window ${window.active ? '' : 'delivery_windows__window-inactive'}`}
                                    onClick={() => history.push({pathname: `/dashboard/delivery_window/edit/${window.id}`})}
                                >
                                    <td>{window.active ? 'yes' : 'no'}</td>
                                    <td>{window.name}</td>
                                    <td>{pythonDays[window.day]}</td>
                                    <td>{window.start_time + ' - ' + window.end_time}</td>
                                    <td>{window.one_off_date}</td>
                                </tr>
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