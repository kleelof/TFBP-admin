import React from 'react';
import {pythonDays} from "../../constants";
import { useHistory } from 'react-router-dom';
import DeliveryWindow from "../../models/DeliveryWindowModel";
import momentHelper from '../../helpers/MomentHelper';
import moment from 'moment';

interface Props {
    window: DeliveryWindow
}
export const DeliveryWindowsWindow = (props: Props): React.ReactElement => {
    const history = useHistory();

    let runText: string = 'recurring';
    switch (true) {
        case (props.window.end_date && new Date(props.window.end_date) < new Date(moment().utc().format('YYYY-DD-MM'))): runText = 'expired'; break;
        case (props.window.start_date !== null && props.window.end_date !== null):
            runText = `${momentHelper.asShortDate(new Date(props.window.start_date || ''))} - ${momentHelper.asShortDate(new Date(props.window.end_date || ''))}`
            break;
    }

    return (
        <tr
            key={`dw_${props.window.id}`}
            className={`delivery_windows__window ${props.window.active ? '' : 'delivery_windows__window-inactive'}`}
            onClick={() => history.push({pathname: `/dashboard/delivery_window/edit/${props.window.id}`})}
        >
            <td>{props.window.active ? 'yes' : 'no'}</td>
            <td>{props.window.name}</td>
            <td>{pythonDays[props.window.day]}</td>
            <td>{moment(props.window.start_time, 'HH:mm:ss').format('h:mm a') + ' - ' + moment(props.window.end_time, 'HH:mm:ss').format('h:mm a')}</td>
            <td>{runText}</td>
        </tr>
    )
}