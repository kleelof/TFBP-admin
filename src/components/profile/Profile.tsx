import React, {ChangeEvent, useEffect, useState} from 'react';
import operatorService from '../../services/OperatorService';
import './profile.scss';
import Operator from "../../models/OperatorModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import authService from '../../services/AuthService';
import actionsService from '../../services/APIActionService';

export const Profile = (): React.ReactElement => {
    const [operator, setOperator] = useState<Operator>(new Operator());
    const [savedOperator, setSavedOperator] = useState(new Operator());
    const [errors, setErrors] = useState<string[]>([]);
    const [hasUpdates, setHasUpdates] = useState(false);
    const [saving, setSaving] = useState(false);
    const [timeZones, setTimeZones] = useState<string[]>([]);

    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (operator.id === -1) {
            Promise.all([
                operatorService.getMe(),
                actionsService.getTimeZones()
            ])
                .then((values) => {
                    updateOperator(values[0]);
                    setSavedOperator(values[0]);
                    setTimeZones(values[1]);
                })
                .catch(() => window.alert('unable to load page'))
        } else {
            checkForUpdates()
        }
    }, )

    const checkForUpdates = (): void => {
        let updated: boolean = false;

        Object.keys(operator).forEach( key => {
            // @ts-ignore
            if (operator[key] !== savedOperator[key]) {
                updated = true;
            }
        })

        setHasUpdates(updated);
    }

    const savePassword = (): void => {
        setSavingPassword(true);
        authService.updatePassword(operator.user, currentPassword, newPassword)
            .then(() => {
                setUpdatingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                alert('password updated');
            })
            .catch(() => window.alert('unable to update password.\n\nCheck that the current password is correct'))
            .then(() => setSavingPassword(false))
    }

    const saveUpdates = (): void => {
        setSaving(true);
        operatorService.update(operator)
            .then((op: Operator) => {
                setSavedOperator(op);
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
        (['zip_code', 'city', 'street_address', 'name', 'phone', 'page_name', 'support_email', 'state', 'timezone',
            'ordering_cutoff_time'
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

        if (!op.self_hosted && op.storefront_template === '')
            errors.push('storefront_template');

        if (op.ordering_cutoff_time < 1)
            errors.push('ordering_cutoff_time');

        if (op.upcoming_delivery_days_notification_time < 1)
            errors.push('upcoming_delivery_days_notification_time');

        if (op.max_future_delivery_windows_time < 1)
            errors.push('max_future_delivery_windows_time');

        if (op.tax_rate > .99)
            errors.push('tax_rate');

        if (op.delivery_minimum < 10)
            errors.push('delivery_minimum');

        setErrors(errors);
        setOperator(op);
    }

    let passwordErrors: string[] = [];
    if (updatingPassword) {
        if (currentPassword === '') passwordErrors.push('current_password');
        if (newPassword === '') passwordErrors.push('new_password');
        if (confirmPassword === '' || confirmPassword !== newPassword) passwordErrors.push('confirm_password');
    }

    return (
        <div className='row profile justify-content-center'>
            <div className='col-12 col-md-7'>
                <h3>profile</h3>
                <hr/>
            </div>
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
                                        <div className='col-12 col-md-6 mt-1'>
                                            contact email:
                                            <h6>{operator.user.email}</h6>
                                            <span className='profile__prompt_note'>for emails regarding your account. contact admin to change</span>
                                        </div>
                                        <div className='col-12 col-md-6 mt-1'>
                                            phone number:
                                            <input className={`form-control ${errors.indexOf('phone') > -1 ? 'profile__error_border' : ''}`} type='email' value={operator.phone}
                                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                       updateOperator({...operator, phone: e.target.value})
                                                   }/>
                                        </div>
                                        <div className='col-12 col-md-6 text-center'>
                                            <button className={`btn btn-sm btn-${
                                                updatingPassword ? 'warning' : 'outline-info'
                                                } mt-4`}
                                                    onClick={() => {
                                                        setUpdatingPassword(!updatingPassword);
                                                    }}
                                            >
                                                {
                                                    updatingPassword ? 'cancel update password' : 'update password'
                                                }
                                            </button>
                                        </div>
                                        {updatingPassword &&
                                            <div className='col-12'>
                                                <hr/>
                                                <h5>update password:</h5>
                                                <div className='row'>
                                                    <div className='col-12 col-md-6 mt-1'>
                                                        current password:
                                                        <input className={`form-control ${passwordErrors.indexOf('current_password') > -1 ? 'profile__error_border' : ''}`}
                                                               type='password'
                                                               value={currentPassword}
                                                               onChange={(e:ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='col-12 col-md-6 mt-1'>
                                                        new password:
                                                        <input className={`form-control ${passwordErrors.indexOf('new_password') > -1 ? 'profile__error_border' : ''}`}
                                                               type='password'
                                                               value={newPassword}
                                                               onChange={(e:ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='col-12 col-md-6 mt-1'>
                                                        confirm password:
                                                        <input className={`form-control ${passwordErrors.indexOf('confirm_password') > -1 ? 'profile__error_border' : ''}`}
                                                               type='password'
                                                               value={confirmPassword}
                                                               onChange={(e:ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='col-12 mt-1 text-center'>
                                                        <LoadingIconButton
                                                            label='save password'
                                                            btnClass='btn btn-sm btn-success'
                                                            disabledBtnClass='btn btn-sm btn-outline-secondary'
                                                            onClick={savePassword}
                                                            busy={savingPassword}
                                                            disabled={passwordErrors.length > 0}
                                                            />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className='col-12'>asfsadf
                                            <LoadingIconButton
                                                key={Math.random()}
                                                busy={saving}
                                                label={'save updates'}
                                                onClick={saveUpdates}
                                                btnClass={'btn btn-sm btn-success'}
                                                disabledBtnClass={'btn btn-sm btn-outline-secondary'}
                                                outerClass={'float-right'}
                                                disabled={!hasUpdates || errors.length !== 0}
                                            />
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
                                            <select className={`form-control ${errors.indexOf('timezone') > -1 ? 'profile__error_border' : ''}`}
                                                    value={operator.timezone}
                                                    onChange={(e:ChangeEvent<HTMLSelectElement>) =>
                                                       updateOperator({...operator, timezone: e.target.value})
                                                   }
                                            >
                                                <option value={''}>choose</option>
                                                {
                                                    timeZones.map((zone: string) =>
                                                        <option value={zone} key={zone}>{zone}</option>
                                                    )
                                                }
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
                                            <hr/>
                                            <h5>store front hosting</h5>
                                            <p>
                                                You can host the store front application on your own website or host it on our platform.
                                                The implementation is simple HTML that requires no plugins or javascript.
                                            </p>
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
                                                <span className='profile__prompt_note'>
                                                    this needs to be a full URL to your website. ex; <strong>http://www.example.com</strong>.
                                                </span>
                                                <p>

                                                </p>
                                                <a href='/static/files/implement_sample.html' target='_blank'>Click for an example on how to add the store front app to your website </a>
                                            </div>
                                        }
                                        {!operator.self_hosted &&
                                            <div className='col-12 mt-2'>
                                                Copy and paste your HTML below:
                                                <ul>
                                                    <li>you need to provide hosting for your own images</li>
                                                    <li>do not include any tags that belong in the &lt;head&gt; tag</li>
                                                </ul>
                                                <textarea
                                                    className={`form-control ${errors.indexOf('storefront_template') > -1 ? 'profile__error_border' : ''}`}
                                                    value={operator.storefront_template}
                                                    onChange={(e:ChangeEvent<HTMLTextAreaElement>) =>
                                                       updateOperator({...operator, storefront_template: e.target.value})
                                                   }
                                                ></textarea>
                                            </div>

                                        }
                                        <div className='col-12'>asfsadf
                                            <LoadingIconButton
                                                key={Math.random()}
                                                busy={saving}
                                                label={'save updates'}
                                                onClick={saveUpdates}
                                                btnClass={'btn btn-sm btn-success'}
                                                disabledBtnClass={'btn btn-sm btn-outline-secondary'}
                                                outerClass={'float-right'}
                                                disabled={!hasUpdates || errors.length !== 0}
                                            />
                                        </div>
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
                                    <table className='table'>
                                        <tbody>
                                            <tr>
                                                <td colSpan={2}>
                                                    <h5>customer ordering</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>How many <strong>days</strong> before delivery day should ordering be disabled?</td>
                                                <td>
                                                    <input
                                                        type='number'
                                                        min={1}
                                                        className={`form-control ${errors.indexOf('ordering_cutoff_time') > -1 ? 'profile__error_border' : ''}`}
                                                        value={operator.ordering_cutoff_time > 0 ? operator.ordering_cutoff_time : ''}
                                                        onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                           updateOperator({...operator, ordering_cutoff_time: parseInt(e.target.value) || 0})
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>How many <strong>days</strong> out should delivery windows be shown?</td>
                                                <td>
                                                    <input type='number'
                                                           min={1}
                                                           className={`form-control ${errors.indexOf('max_future_delivery_windows_time') > -1 ? 'profile__error_border' : ''}`}
                                                           value={operator.max_future_delivery_windows_time > 0 ? operator.max_future_delivery_windows_time : ''}
                                                           onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                               updateOperator({...operator, max_future_delivery_windows_time: parseInt(e.target.value) || 0})
                                                           }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>What is the minimum per delivery?</td>
                                                <td>
                                                    <input type='number'
                                                           min={10}
                                                           className={`form-control ${errors.indexOf('delivery_minimum') > -1 ? 'profile__error_border' : ''}`}
                                                           value={operator.delivery_minimum > 0 ? operator.delivery_minimum : ''}
                                                           onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                               updateOperator({...operator, delivery_minimum: parseFloat(e.target.value) || 0})
                                                           }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Customer must be present to receive order?</td>
                                                <td>
                                                    <input type='checkbox' checked={operator.customer_must_be_present}
                                                       onChange={()=> updateOperator({...operator, customer_must_be_present: !operator.customer_must_be_present})}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <h5>notifications</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>How many <b>days</b> before an upcoming delivery day should the customer be notified?</td>
                                                <td>
                                                    <input
                                                        type='number'
                                                        min={1}
                                                        className={`form-control ${errors.indexOf('upcoming_delivery_days_notification_time') > -1 ? 'profile__error_border' : ''}`}
                                                        value={operator.upcoming_delivery_days_notification_time > 0 ? operator.upcoming_delivery_days_notification_time : ''}
                                                        onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                               updateOperator({...operator, upcoming_delivery_days_notification_time: parseInt(e.target.value) || 0})
                                                           }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Automatically notify customers of their upcoming delivery</td>
                                                <td>
                                                    <input type='checkbox' checked={operator.auto_notify_upcoming_deliveries}
                                                       onChange={()=> updateOperator({...operator, auto_notify_upcoming_deliveries: !operator.auto_notify_upcoming_deliveries})}
                                                    />
                                                </td>
                                            </tr>
                                            {operator.auto_notify_upcoming_deliveries &&
                                                <tr>
                                                    <td>How many <strong>days</strong> before a delivery should the customer be notified?</td>
                                                    <td>
                                                        <input
                                                            type='number'
                                                            min={1}
                                                            className={`form-control ${errors.indexOf('upcoming_delivery_notification_time') > -1 ? 'profile__error_border' : ''}`}
                                                            value={operator.upcoming_delivery_notification_time > 0 ? operator.upcoming_delivery_notification_time : ''}
                                                            onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                                   updateOperator({...operator, upcoming_delivery_notification_time: parseInt(e.target.value) || 0})
                                                               }
                                                        />
                                                    </td>
                                                </tr>
                                            }
                                            <tr>
                                                <td colSpan={2}>
                                                    <h5>fees and tips</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Allow tipping?</td>
                                                <td>
                                                    <input type='checkbox' checked={operator.allow_tipping}
                                                       onChange={()=> updateOperator({...operator, allow_tipping: !operator.allow_tipping})}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>What fee would  you  like to charge for each delivery?</td>
                                                    <td>
                                                        <input
                                                            type='number'
                                                            min={1}
                                                            className={`form-control ${errors.indexOf('delivery_fee') > -1 ? 'profile__error_border' : ''}`}
                                                            value={operator.delivery_fee}
                                                            onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                                   updateOperator({...operator, delivery_fee: parseFloat(e.target.value) || 0})
                                                               }
                                                        />
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td>What is the minimum order required for free delivery?</td>
                                                    <td>
                                                        <input
                                                            type='number'
                                                            min={1}
                                                            className={`form-control ${errors.indexOf('free_delivery_minimum') > -1 ? 'profile__error_border' : ''}`}
                                                            value={operator.free_delivery_minimum}
                                                            onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                                   updateOperator({...operator, free_delivery_minimum: parseFloat(e.target.value) || 0})
                                                               }
                                                        />
                                                    </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}><h5>tax</h5></td>
                                            </tr>
                                            <tr>
                                                <td>tax rate (enter as a percentage)</td>
                                                <td>
                                                    <input
                                                        type='number'
                                                        step='0.01'
                                                        min={0}
                                                        max='0.99'
                                                        className={`form-control ${errors.indexOf('tax_rate') > -1 ? 'profile__error_border' : ''}`}
                                                        value={operator.tax_rate}
                                                        onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                                               updateOperator({...operator, tax_rate: parseFloat(e.target.value) || 0})
                                                           }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tax tips?</td>
                                                <td>
                                                    <input type='checkbox' checked={operator.tax_tips}
                                                       onChange={()=> updateOperator({...operator, tax_tips: !operator.tax_tips})}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tax delivery fee?</td>
                                                <td>
                                                    <input type='checkbox' checked={operator.tax_delivery_fee}
                                                       onChange={()=> updateOperator({...operator, tax_delivery_fee: !operator.tax_delivery_fee})}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='col-12'>asfsadf
                                        <LoadingIconButton
                                            key={Math.random()}
                                            busy={saving}
                                            label={'save updates'}
                                            onClick={saveUpdates}
                                            btnClass={'btn btn-sm btn-success'}
                                            disabledBtnClass={'btn btn-sm btn-outline-secondary'}
                                            outerClass={'float-right'}
                                            disabled={!hasUpdates || errors.length !== 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    )
}