import React, {useEffect, useState} from 'react';
import Zone from "../../models/ZoneModel";
import zoneService from '../../services/ZoneService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { ZoneTool } from './ZoneTool';
import './zone.scss';

export const Zones = (): React.ReactElement => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [showLoading, setShowLoading] = useState<boolean>(true);

    useEffect(() => {
        zoneService.get<Zone[]>()
            .then((zones:Zone[]) => {
                setZones(zones);
                setShowLoading(false)
            })
            .catch( err => window.alert('unable to load zones'))
    }, [])

    if (showLoading)
        return( <LoadingOverlay /> )

    return (
        <div className={'row zones justify-content-center'}>
            <div className={'col-12 col-md-7'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h3>delivery zones</h3>
                        <hr/>
                    </div>
                    {
                        zones.map((zone: Zone) => {
                            return(
                                    <div className={'col-12 col-md-4 zones__zone_wrapper'} key={`zone_${zone.id}`}>
                                        <ZoneTool zone={zone}/>
                                    </div>
                                )
                        })
                    }
                </div>
            </div>
        </div>
    )
}