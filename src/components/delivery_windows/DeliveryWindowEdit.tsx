import React, {ChangeEvent, useEffect, useState} from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import deliveryWindowService from '../../services/DeliveryWindowService';
import zoneService from '../../services/ZoneService';
import { useParams, useHistory } from 'react-router-dom';
import DeliveryWindow from "../../models/DeliveryWindowModel";
import Zone from "../../models/ZoneModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";


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

        deliveryWindowService.update<DeliveryWindow>(deliveryWindow.id, deliveryWindow)
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
            <div className='col-12 col-md-10'>
                <h3>Edit Delivery Window</h3>
                <hr/>
            </div>
            <div className={'col-12 col-md-5'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <div className={'delivery_window_edit__prompt'}>name:</div>
                        <input className={'form-control'} type={'text'} id={'name'}
                               value={deliveryWindow.name}
                               onChange={updateData} />
                    </div>
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
                    <div className={'col-6 mt-2'}>
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
                </div>
            </div>
            <div className='col-12 d-md-none'>
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
            <div className={'col-12 col-md-10 mt-2 text-center'}>
                <hr/>
                <LoadingIconButton label='save updates' onClick={saveWindow} busy={saving} disabled={disabled}
                                   btnClass={'btn btn-outline-success'}
                />
                <LoadingIconButton label='delete' onClick={deleteWindow} busy={deleting} disabled={disabled}
                                   btnClass={'btn btn-outline-danger'} outerClass={'ml-2'}
                />
            </div>
            <div className='col-12 col-md-10 text-center mt-2'>
                <button
                    onClick={() => history.goBack()}
                    className={'btn btn-outline-info ml-2'}
                    disabled={disabled}
                >
                    go back
                </button>
            </div>
        </div>
    )
}