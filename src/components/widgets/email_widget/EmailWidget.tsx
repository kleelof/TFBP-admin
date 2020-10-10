import React, {ChangeEvent, useState} from 'react';
import './email_widget.scss';
import {LoadingIconButton} from "../loading_icon_button/LoadingIconButton";
import apiActionsService from "../../../services/APIActionService";
import MassMailResponseDTO from "../../../dto/MassMailResponseDTO";


interface EmailConfig {
    email_type: string,
    entity_id: number,
    message?: string,
    target_date?: string
}

interface Props {
    finished: () => void,
    prompt: string,
    config: EmailConfig
}

export const EmailWidget = (props: Props): React.ReactElement => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const cancel = (): void => {
        if (!window.confirm('do you want to cancel this email?')) return;
        props.finished();
    }

    const confirmEmailSend = (): void => {
        sendEmail()
            .then((emails: string[]) => {
                if (window.confirm(`You are about to send ${emails.length} emails.`)) {
                    sendEmail(true)
                        .then(() => {
                            window.alert('emails have been sent');
                            props.finished();
                        })
                        .catch(() => window.alert('unable to send emails'))
                        .then(() => setSending(false))
                } else {
                    setSending(false);
                }
            })
            .catch(() => window.alert('unable to send message'))

    }

    const sendEmail = (send_email: boolean = false): Promise<any> => {
        setSending(true);
        return apiActionsService.sendMassMail({...props.config, ...{message, send_email}})

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
            <div className='col-12 text-center mt-2'>
                <LoadingIconButton
                    label='send'
                    onClick={confirmEmailSend}
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