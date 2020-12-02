import React, {ChangeEvent, useState, Fragment} from 'react';
import './create_order.scss';
import {addOverlay} from "../../store/helpersReducer";
import { useDispatch } from 'react-redux';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import mailingListService from '../../services/MailingListService';
import { useHistory } from 'react-router-dom';

export const RouteOrder = (): React.ReactElement => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [mode, setMode] = useState('landing');
    const [zip, updateZip] = useState('');
    const [checkingZip, setCheckingZip] = useState(0); //1 = Delivery ASAP, 2 = Future Delivery
    const [email, updateEmail] = useState('');
    const [savingEmail, setSavingEmail] = useState(false);

    const checkZip = (deliveryChoice: number): void => {
        setCheckingZip(deliveryChoice);

        mailingListService.confirmZipCode(zip)
            .then( resp => {
                    if (resp === 'OK') {
                        gotoCreateOrder(deliveryChoice === 1 ? 'asap' : 'future');
                    } else {
                        setCheckingZip(0);
                        setMode('collect_email')
                    }
                }
            )
            .catch( resp => window.alert('unable to confirm zip'))
    }

    const closeMe = (): void => {
        dispatch(addOverlay(null));
    }

    const gotoCreateOrder = (action: string): void => {
        history.push({pathname: `/dashboard/create_order/${action}/${zip !== '' ? zip : '_'}`});
        closeMe()
    }

    const saveEmail = (): void => {
        setSavingEmail(true);

        mailingListService.add({email: email, code: zip})
            .then(closeMe)
            .catch( err => window.alert('unable to save email address'));
    }

    return (
        <div className='row route_order justify-content-center'>
            {
                mode === 'landing' ?
                    <Fragment>
                        <div className='col-12 text-center'>
                            <button
                                className='btn btn-outline-success'
                                onClick={() => gotoCreateOrder('pickup')}
                                >Pick-Up Order</button>
                        </div>
                        <div className='col-12'>
                            <hr/>
                        </div>
                        <div className='col-12 text-center'>
                            <h3>Delivery</h3>
                        </div>
                        <div className='col-2 text-center'>
                            <input
                                className='form-control'
                                placeholder='zipcode'
                                disabled={checkingZip !== 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => updateZip(e.target.value)}
                                />
                        </div>
                        <div className='col-12 text-center'>
                            <LoadingIconButton
                                btnClass='btn btn-outline-primary mr-2'
                                label='Deliver ASAP'
                                onClick={() => checkZip(1)}
                                busy={checkingZip === 1}
                                disabled={checkingZip === 2 || zip === ''}
                                />

                            <LoadingIconButton
                                btnClass='btn btn-outline-primary mr-2'
                                label='Future Delivery'
                                onClick={() => checkZip(2)}
                                busy={checkingZip === 2}
                                disabled={checkingZip === 1 || zip === ''}
                                />
                        </div>
                   </Fragment>
                :
                    <Fragment>
                        <div className='col-12 text-center'>
                            <p>
                                "I'm sorry, but we do not currently deliver to your area."
                            </p>
                            <p>
                                "If I can get your email address, we will let you know when we begin delivering to your area!"
                            </p>
                        </div>
                        <div className='col-5 text-center'>
                            <input
                                className='form-control'
                                disabled={savingEmail}
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => updateEmail(e.target.value)}
                                />

                            <LoadingIconButton
                                label='Save Email Address'
                                btnClass='btn btn-outline-success'
                                outerClass='mt-2'
                                onClick={saveEmail}
                                busy={savingEmail}
                                disabled={email === '' || savingEmail}
                                />
                        </div>
                    </Fragment>
            }

            <div
                className='route_order__close theme__warning'
                onClick={() => dispatch(addOverlay(null))}
            >
                X
            </div>
        </div>
    )
}