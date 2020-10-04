import React, {ChangeEvent, useState} from 'react';
import './email_widget.scss';
import {LoadingIconButton} from "../loading_icon_button/LoadingIconButton";
import apiActionsService from "../../../services/APIActionService";

interface EmailConfig {
    email_type: string,
    entity_id: number
}

interface DeliveriesEmailConfig extends  EmailConfig{
    target_date: string
}

interface Props {
    finished: () => void,
    prompt: string,
    config: DeliveriesEmailConfig
}

export const EmailWidget = (props: Props): React.ReactElement => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const cancel = (): void => {
        if (!window.confirm('do you want to cancel this email?')) return;
        props.finished();
    }
    const sendEmail = (): void => {
        setSending(true);
        apiActionsService.sendMassMail({...props.config, ...{message}})
            .then(() => {
                window.alert('message sent');
                props.finished();
            })
            .catch(() => window.alert('unable to send message'))
            .then(() => setSending(false))
    }

    return(
        <div className='row email_widget'>
            <div className='col-12'>
                {props.prompt}
            </div>
            <div className='col-12 mt-2'>
                <textarea
                    className='form-control'
                    value={message}
                    placeholder='enter message'
                    disabled={sending}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <div className='col-12 text-center'>
                <LoadingIconButton
                    label='send'
                    onClick={sendEmail}
                    disabled={message === ''}
                    busy={sending}
                    btnClass='btn btn-sm btn-outline-success'
                />
                <button className='btn btn-sm btn-outline-info ml-2'
                        onClick={cancel}
                        disabled={sending}
                        >cancel</button>
            </div>
        </div>
    )
}