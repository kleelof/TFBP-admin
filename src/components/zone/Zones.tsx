import React, {ChangeEvent, useEffect, useState} from 'react';
import Zone from "../../models/ZoneModel";
import zoneService from '../../services/ZoneService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { ZoneTool } from './ZoneTool';
import './zone.scss';
import { useHistory } from 'react-router-dom';

export const Zones = (): React.ReactElement => {

    const history = useHistory();
    const [zones, setZones] = useState<Zone[]>([]);
    const [showLoading, setShowLoading] = useState<boolean>(true);
    const [newZone, setNewZone] = useState<string>('');

    useEffect(() => {
        zoneService.get<Zone[]>()
            .then((zones:Zone[]) => {
                setZones(zones);
                setShowLoading(false)
            })
            .catch( err => window.alert('unable to load zones'))
    }, [])

    const addZone = (): void => {
        zoneService.add<Zone>(new Zone(-1, newZone))
            .then((zone: Zone) => {
                setZones([...zones, zone]);
                setNewZone('');
            })
            .catch(() => window.alert('unable to create new zone'))
    }

    const deleteZone = (zone: Zone): void => {
        if (!window.confirm(`Are you sure you want to delete the following zone?\n\n${zone.name}`)) return;
        zoneService.delete(zone.id)
            .then(() => {
                setZones(zones.filter((z: Zone) => z.id !== zone.id))
            })
            .catch( err => window.alert('unable to delete zone'))
    }

    if (showLoading)
        return( <LoadingOverlay /> )

    return (
        <div className={'row zones justify-content-center'}>
            <div className={'col-12 col-md-7'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h3>zones</h3>
                        <hr/>
                    </div>
                    <div className='col-2'>
                        <button
                            className='btn btn-sm btn-outline-info'
                            onClick={() => history.goBack()}
                            >back</button>
                    </div>
                    <div className='col-7 col-md-5'>
                        <input type='text' className='form-control' value={newZone} placeholder='new zone name'
                               onChange={(e:ChangeEvent<HTMLInputElement>) => setNewZone(e.target.value)}
                        />
                    </div>
                    <div className='col-2'>
                        <button className='btn btn-outline-success' onClick={addZone}>add</button>
                    </div>
                    <div className='col-12'>
                        <hr/>
                    </div>
                    {
                        zones.length > 0 ?
                            zones.sort(
                                (a: Zone, b: Zone) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0
                            ).map((zone: Zone) => {
                                return(
                                        <div className={'col-12 zones__zone_wrapper'} key={`zone_${zone.id}`}>
                                            <ZoneTool zone={zone} deleteZone={deleteZone}/>
                                        </div>
                                    )
                            })
                            :
                            <div className='col-12'>
                                <p>
                                    Delivery zones are defined by a collection of zip codes. Once you creat a zone, you will be ready to create your first Delivery Window.
                                </p>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}