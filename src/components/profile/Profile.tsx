import React, {ChangeEvent, useEffect, useState} from 'react';
import operatorService from '../../services/OperatorService';
import './profile.scss';
import Operator from "../../models/OperatorModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";

export const Profile = (): React.ReactElement => {
    const [operator, setOperator] = useState<Operator>(new Operator());
    const [errors, setErrors] = useState<string[]>([]);
    const [hasUpdates, setHasUpdates] = useState(false);
    const [saving, setSaving] = useState(false);

    let savedOperator: Operator;

    useEffect(() => {
        operatorService.getMe()
            .then((op: Operator) => {
                updateOperator(op);
                savedOperator = op;
            })
            .catch((err) => window.alert('unable to load operator info'))
    }, [])

    const saveUpdates = (callback: any = undefined): void => {
        setSaving(true);
        operatorService.update(operator.id, operator)
            .then((op: Operator) => {
                savedOperator = op;
                updateOperator(op);
            })
            .catch((err) => window.alert(JSON.stringify(err.response.data)))
            .then(() => {
                setSaving(false)
            })
    }

    const updateOperator = (op: Operator): void =>  {

        let errors: string[] = [];

        // each to check fields
        (['zip_code', 'city', 'street_address', 'name', 'phone', 'page_name', 'support_email', 'state', 'timezone'
        ]).forEach((field: any) => {
            // @ts-ignore
            if (op[field] === '')
                errors.push(field);
        })

        // fields with more checking
        if (op.self_hosted &&
            (op.domain === '' || op.domain.indexOf('https://') !== 0)
        ) errors.push('domain');

        if (op.auto_notify_upcoming_deliveries && op.upcoming_delivery_notification_time < 1)
            errors.push('upcoming_delivery_notification_time');

        if (op.ordering_cutoff_time < 1)
            errors.push('ordering_cutoff_time')

        if (op.upcoming_delivery_days_notification_time < 1)
            errors.push('upcoming_delivery_days_notification_time');

        console.log(errors);
        setHasUpdates(errors.length === 0);
        setErrors(errors);
        setOperator(op);
    }

    return (
        <div className='row profile justify-content-center'>
            <div className='col-12 col-md-7'>
                <fieldset disabled={saving}>
                    <div className="accordion" id="myAccordion">
                        <div className="card">
                            <div className="card-header" id="headingOne">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link" data-toggle="collapse"
                                            data-target="#collapseOne">contact info
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne"
                                 data-parent="#myAccordion">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-12 col-md-6'>
                                            full name:
                                            <input className={`form-control ${errors.indexOf('name') > -1 ? 'profile__error_border' : ''}`} value={operator.name}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, name: e.target.value})
                                                   }
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            contact email:
                                            <input className='form-control' type='email' value={operator.user.email}/>
                                            <span className='profile__prompt_note'>for emails regarding your account</span>
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            phone number:
                                            <input className={`form-control ${errors.indexOf('phone') > -1 ? 'profile__error_border' : ''}`} type='email' value={operator.phone}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, phone: e.target.value})
                                                   }/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingTwo">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse"
                                            data-target="#collapseTwo">business info
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                                 data-parent="#myAccordion">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-12 col-md-6'>
                                            business name:
                                            <input className={`form-control ${errors.indexOf('page_name') > -1 ? 'profile__error_border' : ''}`} value={operator.page_name}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, page_name: e.target.value})
                                                   }/>
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            time zone:
                                            <select className={`form-control ${errors.indexOf('timezone') > -1 ? 'profile__error_border' : ''}`} value={operator.timezone}
                                                    onChange={(e:ChangeEvent<HTMLSelectElement>) =>
                                                       updateOperator({...operator, timezone: e.target.value})
                                                   }
                                            >
                                                <option value={''}>choose</option>
                                                <option value={'tz1'}>tz1</option>
                                                <option value={'tz2'}>tz2</option>
                                            </select>
                                        </div>
                                        <div className='col-12 col-md-6 mt-2'>
                                            contact email:
                                            <input className={`form-control ${errors.indexOf('support_email') > -1 ? 'profile__error_border' : ''}`}
                                                   type='email' value={operator.support_email}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, support_email: e.target.value})
                                                   }/>
                                            <span className='profile__prompt_note'>for messages from your customers and alerts</span>
                                        </div>
                                        <div className='col-12 mt-2'>
                                            street address:
                                            <input className={`form-control ${errors.indexOf('street_address') > -1 ? 'profile__error_border' : ''}`}
                                                   type='text' value={operator.street_address}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, street_address: e.target.value})
                                                   }/>
                                            <span className='profile__prompt_note'>this should be the location deliveries will start from</span>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            unit:
                                            <input className={`form-control`}
                                                   type='text' value={operator.unit}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, unit: e.target.value})
                                                   }/>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            city:
                                            <input className={`form-control ${errors.indexOf('city') > -1 ? 'profile__error_border' : ''}`}
                                                   type='text' value={operator.city}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, city: e.target.value})
                                                   }/>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            state:
                                            <input className={`form-control ${errors.indexOf('state') > -1 ? 'profile__error_border' : ''}`}
                                                   type='text' value={operator.state}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, state: e.target.value})
                                                   }/>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            zip code:
                                            <input className={`form-control ${errors.indexOf('zip_code') > -1 ? 'profile__error_border' : ''}`}
                                                   type='text' value={operator.zip_code}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, zip_code: e.target.value})
                                                   }/>
                                        </div>
                                        <div className='col-12 mt-2'>
                                            <input type='checkbox' checked={operator.self_hosted}
                                                   onChange={()=> updateOperator({...operator, self_hosted: !operator.self_hosted})}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                            host on my own server
                                        </div>
                                        {operator.self_hosted &&
                                            <div className='col-12 mt-2'>
                                                <input type='text' placeholder='url to  your website'
                                                       className={`form-control ${errors.indexOf('domain') > -1 ? 'profile__error_border' : ''}`}
                                                       value={operator.domain}
                                                       onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                           updateOperator({...operator, domain: e.target.value})
                                                       }/>
                                                <span className='profile__prompt_note'>this needs to be a full URL to your website. ex; <b>https://</b>www.example.com.
                                                    &nbsp;<b>**your site must have an SSL (can use https://)</b>
                                                </span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingThree">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse"
                                            data-target="#collapseThree">settings
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree"
                                 data-parent="#myAccordion">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-12'>
                                            how many <strong>hours</strong> before delivery time should ordering be disabled?
                                            &nbsp;&nbsp;
                                            <input type='number'
                                                   min={1}
                                                   className={`form-control ${errors.indexOf('ordering_cutoff_time') > -1 ? 'profile__error_border' : ''}`}
                                                   value={operator.ordering_cutoff_time}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, ordering_cutoff_time: parseInt(e.target.value)})
                                                   }
                                            />
                                        </div>

                                        <div className='col-12 mt-4'>
                                            <hr/>
                                        </div>
                                        <div className='col-12 mt-2'>
                                            how many <b>days</b> before an upcoming delivery day should the customer be notified?
                                            &nbsp;&nbsp;
                                            <input
                                                type='number'
                                                min={1}
                                                className={`form-control ${errors.indexOf('upcoming_delivery_days_notification_time') > -1 ? 'profile__error_border' : ''}`}
                                                value={operator.upcoming_delivery_days_notification_time}
                                                onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, upcoming_delivery_days_notification_time: parseInt(e.target.value)})
                                                   }
                                            />
                                        </div>
                                        <div className='col-12 mt-2'>
                                            <input type='checkbox' checked={operator.auto_notify_upcoming_deliveries}
                                                   onChange={()=> updateOperator({...operator, auto_notify_upcoming_deliveries: !operator.auto_notify_upcoming_deliveries})}
                                            />
                                            &nbsp;&nbsp; automatically notify customers of their upcoming delivery
                                        </div>
                                        {operator.auto_notify_upcoming_deliveries &&
                                            <div className='col-12 mt-2'>
                                                how many <strong>days</strong> before a delivery should the customer be notified?
                                                &nbsp;&nbsp;
                                                <input
                                                    type='number'
                                                    min={1}
                                                    className={`form-control ${errors.indexOf('upcoming_delivery_notification_time') > -1 ? 'profile__error_border' : ''}`}
                                                    value={operator.upcoming_delivery_notification_time}
                                                    onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                           updateOperator({...operator, upcoming_delivery_notification_time: parseInt(e.target.value)})
                                                       }
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div className='col-12 text-right'>
                    <LoadingIconButton
                        key={Math.random()}
                        busy={saving}
                        label={'save updates'}
                        onClick={saveUpdates}
                        btnClass={'btn btn-outline-success'}
                        outerClass={'mt-2'}
                        disabled={!hasUpdates || errors.length !== 0}
                    />
                </div>
            </div>
        </div>
    )
}