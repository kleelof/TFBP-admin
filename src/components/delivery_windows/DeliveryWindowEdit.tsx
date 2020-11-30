import React, {ChangeEvent, useEffect, useState, Fragment} from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import deliveryWindowService from '../../services/DeliveryWindowService';
import zoneService from '../../services/ZoneService';
import { useParams, useHistory } from 'react-router-dom';
import DeliveryWindow, {DELIVERY_WINDOW_TYPES} from "../../models/DeliveryWindowModel";
import Zone from "../../models/ZoneModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {EmailWidget} from "../widgets/email_widget/EmailWidget";
import {AppState} from "../../store/store";
import { useSelector } from 'react-redux';
import {OPERATOR_TYPES} from "../../models/OperatorModel";


export const DeliveryWindowEdit = (): React.ReactElement => {
    const history = useHistory();
    const params: any = useParams();
    const [showLoading, setShowLoading] = useState<boolean>(true);
    const [deliveryWindow, setWindow] = useState<DeliveryWindow>(new DeliveryWindow());
    const [disabled, setDisabled] = useState<boolean>(false);
    const [zones, setZones] = useState<Zone[]>([]);
    const [selectedZone, setSelectedZone] = useState<number>(-1)
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const isRestaurant = useSelector((state: AppState) => state.operatorReducer).settings?.type === OPERATOR_TYPES.restaurant;

    useEffect(() => {
        if (params.id === undefined) {
            zoneService.get<Zone[]>()
                .then((zones: Zone[]) => setZones(zones))
                .catch(() => window.alert('unable to load zones'))
                .then(() => setShowLoading(false));
        } else {
            Promise.all([
                deliveryWindowService.get<DeliveryWindow>(params.id),
                zoneService.get<Zone[]>()
            ])
                .then((values) => {
                    let deliveryWindow: DeliveryWindow = values[0];
                    setWindow(deliveryWindow);
                    setZones(values[1]);
                    if (values[1].length > 0) setSelectedZone(values[1][0].id);
                    setShowLoading(false);
                })
                .catch( err => window.alert('unable to load window'));
        }
    }, []);

    const addZone = (): void => {
        if (zones.length === 0) {
            history.push({pathname: '/dashboard/zone'})
        } else {
            deliveryWindowService.addZone(deliveryWindow.id, selectedZone)
                .then((deliveryWindow: DeliveryWindow) => setWindow(deliveryWindow))
                .catch(() => window.alert('unable to add zone'))
        }
    }

    const deleteWindow = (): void => {
        if (!window.confirm('are you sure you want to delete this window? \n\nWARNING:\nthis cannot be reversed.')) return;

        setDeleting(true)
        deliveryWindowService.delete(deliveryWindow.id)
            .then(() => history.goBack())
            .catch(err => window.alert('unable to delete'))
            .then(() => setDeleting(false))
    }
    const removeZone = (zone: Zone): void => {
        if (!window.confirm(`Are you sure you want to remove '${zone.name}'?`)) return

        deliveryWindowService.removeZone(deliveryWindow.id, zone.id)
            .then((deliveryWindow: DeliveryWindow) => setWindow(deliveryWindow))
            .catch(() => window.alert('unable to remove zone'))
    }

    const saveWindow = (): void => {
        setDisabled(true);
        setSaving(true);

        deliveryWindowService.update<DeliveryWindow>(deliveryWindow)
                .then(() => history.goBack())
                .catch( err => window.alert('unable to update window'))
    }

    const updateData = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setWindow({...deliveryWindow, [e.target.id]: e.target.value});
    }

    if (showLoading)
        return(<LoadingOverlay />)

    return (
        <div className={'row delivery_window_edit justify-content-center'}>
            <div className='col-12 col-md-6'>
                <div className='row'>
                    <div className='col-12'>
                        <h3>Edit Delivery Window</h3>
                        <hr/>
                    </div>
                    <div className='col-12 text-right'>
                        <button
                            onClick={() => history.goBack()}
                            className={'btn btn-sm btn-outline-info ml-2 delivery_window_edit__go_back'}
                            disabled={disabled}
                        >
                            go back
                        </button>
                        <LoadingIconButton label='save updates' onClick={saveWindow} busy={saving} disabled={disabled}
                                           btnClass={'btn btn-sm btn-outline-success'}
                        />
                        <LoadingIconButton label='delete' onClick={deleteWindow} busy={deleting} disabled={disabled}
                                           btnClass={'btn btn-sm btn-outline-danger'} outerClass={'ml-2'}
                        />
                        {!isRestaurant &&
                            <button
                                onClick={() => {setSendEmail(!sendEmail)}}
                                className={`btn btn-sm btn-outline-${sendEmail? 'warning' : 'primary'} ml-2`}
                            >
                                { sendEmail ? 'cancel email' : 'send email' }
                            </button>
                        }
                        <hr/>
                    </div>
                    <div className={'col-12 mt-2'}>
                        <div className={'row'}>
                            <div className={'col-12'}>
                                <div className={'delivery_window_edit__prompt'}>name:</div>
                                <input className={'form-control'} type={'text'} id={'name'}
                                       value={deliveryWindow.name}
                                       onChange={updateData} />
                            </div>
                            {
                                !isRestaurant ?
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
                                    :
                                    <div className='col-6 mt-2'>
                                        <div className={'delivery_window_edit__prompt'}>type:</div>
                                        <select className={'form-control'} id={'type'}
                                                value={deliveryWindow.type}
                                                onChange={updateData}
                                        >
                                            <option value={DELIVERY_WINDOW_TYPES.pickup}>pickup</option>
                                            <option value={DELIVERY_WINDOW_TYPES.delivery}>deliver ASAP</option>
                                            <option value={DELIVERY_WINDOW_TYPES.futureDelivery}>future delivery</option>
                                        </select>
                                    </div>
                            }
                            <div className={'col-6'}>
                                <div className={'delivery_window_edit__prompt'}>active:</div>
                                <input type='checkbox' className={''} id={'active'}
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
                            {!isRestaurant &&
                                <Fragment>
                                    <div className={'col-9 mt-2'}>
                                        <div className={'delivery_window_edit__prompt'}>start date:</div>
                                        <input type={'date'} className={'form-control'} id={'start_date'}
                                               value={deliveryWindow.start_date || ''} onChange={updateData}/>
                                    </div>
                                    <div className={'col-2 mt-4'}>
                                        <button className={'btn btn-sm btn-outline-danger'}
                                                onClick={() => setWindow({...deliveryWindow, start_date: null})}
                                        >clear</button>
                                    </div>
                                    <div className={'col-9 mt-2'}>
                                        <div className={'delivery_window_edit__prompt'}>end date:</div>
                                        <input type={'date'} className={'form-control'} id={'end_date'}
                                               value={deliveryWindow.end_date || ''} onChange={updateData} />
                                    </div>
                                    <div className={'col-2 mt-4'}>
                                        <button className={'btn btn-sm btn-outline-danger'}
                                                onClick={() => setWindow({...deliveryWindow, end_date: null})}>clear</button>
                                    </div>
                                </Fragment>
                            }
                        </div>
                    </div>
                    <div className='col-12'>
                        <hr/>
                    </div>
                    <div className='col-12 col-md-5 dwe_zones'>
                        <h5>zones</h5>
                        <div className='row'>
                            <div className='col-9'>
                                {
                                    zones.length > 0 ?
                                        <select className='form-control'
                                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedZone(parseInt(e.target.value))}>
                                            {
                                                zones.map((zone: Zone) =>
                                                    <option key={`zone_${zone.id}`} value={zone.id}>{zone.name}</option>
                                                )
                                            }
                                        </select>
                                        :
                                        <div className='dwe__no_zones_message'>
                                            no zones available
                                        </div>
                                }
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-sm btn-outline-success' onClick={addZone}>
                                    add zone
                                </button>
                            </div>
                        </div>
                        <hr/>
                        <div className='dwe_zones__zones'>
                            {deliveryWindow.zones &&
                                deliveryWindow.zones.map((zone: Zone) =>
                                    <div className='row dwe_zones__zone mt-1'>
                                        <div className='col-9'>{zone.name}</div>
                                        <div className='col-2'>
                                            <button className='btn btn-sm btn-outline-danger' onClick={()=>removeZone(zone)}>X</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {sendEmail &&
                        <div className='col-12 delivery_window_edit__emailer'>
                            <div className='row justify-content-center'>
                                <div className='col-12 col-md-6'>
                                    <EmailWidget
                                        finished={() => setSendEmail(false)}
                                        prompt={'this email will be sent to anyone in your mailing list who can order during this delivery window'}
                                        config={{
                                            email_type: 'delivery_window',
                                            entity_id: deliveryWindow.id
                                        }}
                                        />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}