import React, {ChangeEvent, useEffect, useState} from 'react';
import Zone from "../../models/ZoneModel";
import zoneService from '../../services/ZoneService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { ZoneTool } from './ZoneTool';
import './zone.scss';

export const Zones = (): React.ReactElement => {
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
        zoneService.add<Zone>(new Zone(newZone))
            .then((zone: Zone) => {
                setZones([...zones, zone]);
                setNewZone('');
            })
            .catch(() => window.alert('unable to create new zone'))
    }

    if (showLoading)
        return( <LoadingOverlay /> )

    return (
        <div className={'row zones justify-content-center'}>
            <div className={'col-12 col-md-10'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h3>delivery zones</h3>
                        <hr/>
                    </div>
                    <div className={'col-12'}>
                        <div className='row'>
                            <div className='col-8 col-md-10'>
                                <input type='text' className='form-control' value={newZone} placeholder='new zone name'
                                       onChange={(e:ChangeEvent<HTMLInputElement>) => setNewZone(e.target.value)}
                                />
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-outline-success' onClick={addZone}>add zone</button>
                            </div>
                        </div>
                        <hr/>
                    </div>
                    {
                        zones.length > 0 ?
                            zones.map((zone: Zone) => {
                                return(
                                        <div className={'col-12 col-md-6 zones__zone_wrapper'} key={`zone_${zone.id}`}>
                                            <ZoneTool zone={zone}/>
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