import React, {ChangeEvent, useState} from 'react';
import Zone from "../../models/ZoneModel";
import './zone.scss';
import Zipcode from "../../models/ZipcodeModel";
import {ZoneCode} from "./ZoneCode";
import zipService from '../../services/ZipService';
import zoneService from '../../services/ZoneService';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import { states } from '../../constants';
import SearchWidget from "../widgets/searchWidget/SearchWidget";

interface Props {
    zone: Zone,
    deleteZone: (zone: Zone) => void;
}

export const ZoneTool = (props: Props): React.ReactElement => {

    const [codes, setCodes] = useState<Zipcode[]>(props.zone.zip_codes);
    const [newCode, updateNewCode] = useState('');
    const [searchCity, updateSearchCity] = useState('');
    const [addState, updateAddState] = useState(states[0].code);
    const [addingCode, setAddingCode] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [tZone, setTZone] = useState(props.zone);
    const [zone, setZone] = useState(props.zone);


    const removeCode = (code: Zipcode): void => {
        if (!window.confirm(`Are you sure you want to remove: ${code.code}?`)) return
        zipService.delete<Zipcode>(code.id)
            .then(() => setCodes(codes.filter((tcode: Zipcode) => tcode.code !== code.code)))
            .catch(() => window.alert('unable to remove code'))
    }

    const addCode = (action: number, value: string | number): void => {
        setAddingCode(action);

        if (codes.filter((code: Zipcode) => code.code === newCode).length > 0) {
            alert('that code already exists');
            return;
        }

        if (action === 1) {
            zipService.add<Zipcode>(new Zipcode(-1, newCode, props.zone.id))
            .then((code: Zipcode) => {
                setCodes([...codes, code]);
                updateNewCode('');
            })
            .catch(() => window.alert('unable to add code'))
            .finally(() => setAddingCode(0))

        } else {
            zoneService.import_zip_codes(
                props.zone,
                ['city', 'state'][action - 2],
                value
                )
                .then((cs: Zipcode[]) => setCodes([...codes, ...cs]))
                .catch( err => window.alert('unable to import zip codes'))
                .finally(() => setAddingCode(0))
        }
    }

    const updateZone = (): void => {
        setUpdating(true)
        zoneService.update<Zone>(tZone)
            .then((z: Zone) => {
                setUpdating(false);
                setZone(z);
                setTZone(z);
            })
    }

    let hasUnsavedChanges: boolean =
        tZone.name !== zone.name ||

        tZone.fdel_tax !== zone.fdel_tax ||
        tZone.fdel_free_del_min !== zone.fdel_free_del_min ||
        tZone.fdel_del_charge !== zone.fdel_del_charge ||
        tZone.fdel_min !== zone.fdel_min ||

        tZone.jdel_tax !== zone.jdel_tax ||
        tZone.jdel_free_del_min !== zone.jdel_free_del_min ||
        tZone.jdel_del_charge !== zone.jdel_del_charge ||
        tZone.jdel_min !== zone.jdel_min ||

        tZone.ship_tax !== zone.ship_tax ||
        tZone.ship_free_del_min !== zone.ship_free_del_min ||
        tZone.ship_del_charge !== zone.ship_del_charge ||
        tZone.ship_min !== zone.ship_min

    return (
        <div className={'row zone_tool'}>
            <div className={'col-6'}>
                <h4>zone name:</h4>
                <input
                    className={'form-control zone_tool__name'}
                    placeholder='zone name'
                    type={'text'}
                    value={tZone.name}
                    disabled={updating}
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setTZone({...tZone, name: e.target.value})}
                />
            </div>
            <div className='col-12 mt-4'>
                <fieldset disabled={updating}>
                    <h4>fees and taxes:</h4>
                    <div className='row'>
                        <div className='col-4'>

                        </div>
                        <div className='col-2'>
                            <small>minimum order</small>
                        </div>
                        <div className='col-2'>
                            <small>delivery charge</small>
                        </div>
                        <div className='col-2'>
                            <small>free delivery min.</small>
                        </div>
                        <div className='col-2'>
                            <small>tax rate</small>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-4'>
                            <strong>delivery:</strong>
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='number'
                                value={tZone.jdel_min || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, jdel_min: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.jdel_del_charge || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, jdel_del_charge: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.jdel_free_del_min || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, jdel_free_del_min: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.jdel_tax || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, jdel_tax: parseFloat(e.target.value)})}
                                />
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div className='col-4'>
                            <strong>planned-meal delivery:</strong>
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.fdel_min || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, fdel_min: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.fdel_del_charge || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, fdel_del_charge: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.fdel_free_del_min || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, fdel_free_del_min: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.fdel_tax || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, fdel_tax: parseFloat(e.target.value)})}
                                />
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div className='col-4'>
                            <strong>shipping:</strong>
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.ship_min || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, ship_min: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.ship_del_charge || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, ship_del_charge: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.ship_free_del_min || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, ship_free_del_min: parseFloat(e.target.value)})}
                                />
                        </div>
                        <div className='col-2'>
                            <input
                                className='form-control'
                                type='numeric'
                                value={tZone.ship_tax || 0}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTZone({...tZone, ship_tax: parseFloat(e.target.value)})}
                                />
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className='col-12 text-right mt-2'>
                <button
                    className='btn btn-sm btn-outline-danger mr-2'
                    onClick={() => props.deleteZone(zone)}
                    disabled={updating}
                >delete</button>
                <LoadingIconButton
                    btnClass='btn btn-sm btn-outline-success'
                    label='save updates'
                    onClick={updateZone}
                    busy={updating}
                    disabled={!hasUnsavedChanges}
                    />
                <hr/>
            </div>
            <div className='col-12 mt-4'>
                <h4>zipcode management:</h4>
                <div className='row'>
                    <div className={'col-6'}>
                        <div className={'zone_tool__note'}>select code to remove</div>
                        <div className={'zone_tool__codes'}>
                            {
                                codes.sort(
                                    (a: Zipcode, b:Zipcode) => a.code > b.code ? 1 : a.code < b.code ? -1 : 0
                                ).map((code: Zipcode) =>
                                    <ZoneCode
                                        code={code}
                                        removeCode={removeCode}
                                        key={code.code}
                                    />)
                            }
                        </div>
                    </div>
                    <div className={'col-6 text-right mt-3'}>
                        <fieldset disabled={addingCode !== 0}>
                            <div className='row'>
                                <div className='col-12'>
                                    <input
                                        className={'form-control'}
                                        placeholder={'new code'}
                                        value={newCode}
                                        onChange={(e:ChangeEvent<HTMLInputElement>) => updateNewCode(e.target.value)}
                                    />
                                    <LoadingIconButton
                                        label='add code'
                                        outerClass='mt-2'
                                        btnClass='btn btn-sm btn-outline-success'
                                        onClick={() => addCode(1, newCode)}
                                        busy={addingCode === 1}
                                        disabled={newCode.length === 0 || addingCode !== 0}
                                        />
                                    <hr/>
                                </div>
                                <div className='col-12'>
                                    <SearchWidget
                                        placeholder={'add by city'}
                                        serviceFunction={zoneService.searchZipDb}
                                        itemSelected={(item: any) => {
                                            if (typeof item !== 'string')
                                                addCode(2, item.id)

                                        }}
                                        />
                                    <LoadingIconButton
                                        label='remove codes'
                                        outerClass='mt-2 mr-2'
                                        btnClass='btn btn-sm btn-outline-danger'
                                        onClick={() => addCode(1, newCode)}
                                        busy={addingCode === 1}
                                        disabled={addingCode !== 0}
                                        />
                                    <LoadingIconButton
                                        label='add codes'
                                        outerClass='mt-2'
                                        btnClass='btn btn-sm btn-outline-success'
                                        onClick={() => addCode(2, searchCity)}
                                        busy={addingCode === 2}
                                        disabled={addingCode !== 0}
                                        />
                                    <hr/>
                                </div>
                                <div className='col-12'>
                                    <small>add by state</small>
                                    <select
                                        className='form-control'
                                        value={addState}
                                        onChange={(e:ChangeEvent<HTMLSelectElement>) => updateAddState(e.target.value)}
                                        >
                                        {
                                            states.map( state =>
                                                <option
                                                    key={state.code}
                                                    value={state.code}
                                                >{state.name}</option>

                                            )
                                        }
                                    </select>
                                    <LoadingIconButton
                                        label='remove codes'
                                        outerClass='mt-2 mr-2'
                                        btnClass='btn btn-sm btn-outline-danger'
                                        onClick={() => addCode(1, newCode)}
                                        busy={addingCode === 1}
                                        disabled={newCode.length === 0 || addingCode !== 0}
                                        />
                                    <LoadingIconButton
                                        label='add codes'
                                        outerClass='mt-2'
                                        btnClass='btn btn-sm btn-outline-success'
                                        onClick={() => addCode(3, addState)}
                                        busy={addingCode === 3}
                                        disabled={addingCode !== 0}
                                        />
                                    <hr/>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )
}