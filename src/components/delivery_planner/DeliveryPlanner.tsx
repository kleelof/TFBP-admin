import React, {useEffect, useState} from 'react';
import Order from "../../models/OrderModel";
import { useParams } from 'react-router-dom';
import deliveryWindowService from '../../services/DeliveryWindowService';
import routeService from '../../services/RouteService';
import GoogleMapReact, {Maps} from 'google-map-react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import RouteOrganizer from "./RouteOrganizer";
import RouteStop from "../../models/RouteStopModel";

export const DeliveryPlanner = (props: any): React.ReactElement => {
    const params: any = useParams();
    const [route, setRoute] = useState<Route>(new Route());
    // const [legs, setLegs] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadRoute();
    }, [])

    const handleApiLoaded = (map: any, maps: Maps) => {
      console.log(map, maps)
    };

    const loadRoute = (optimize: boolean = false, callback: any = undefined): void => {
        deliveryWindowService.retrieveRoute(params.delivery_window, params.target_date, optimize)
            .then((route: Route) => {
                setRoute(route);
                setLoading(false);
            })
            .catch(() => window.alert('unable to load route'))
            .then(() => {
                if (callback !== undefined) callback();
            })
    }

    const createMapOptions = (maps: any): any => {
      return {
        zoomControlOptions: {
          position: maps.ControlPosition.RIGHT_CENTER,
          style: maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
          position: maps.ControlPosition.TOP_RIGHT
        },
        mapTypeControl: true
      };
    }

    const reorderAndRecalculate = (ndxs: number[], callback: any): void => {
        routeService.reorderAndRecalculate(route, ndxs)
            .then((route: Route) => setRoute(route))
            .catch(() => window.alert('unable to update'))
            .then(() => callback())
    }

    if (loading)
        return <LoadingOverlay />

     return (
        <div className='row delivery_planner'>
            <div className='col-12'>
                <h3>route planner</h3>
                <hr/>
            </div>
            <div className='d-none d-md-block col-md-8 delivery_planner__map_div'>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyC0yq5uGlMfHp98X-L452J-dzR2HX5FEP8'}}
                  center={JSON.parse(route.stops[0].leg)['start_location']}
                  zoom={10}
                  yesIWantToUseGoogleMapApiInternals={true}
                  options={createMapOptions}
                  onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                >
                    {
                        route.stops.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0)).map((stop: RouteStop, index: number) => {
                            let leg: any = JSON.parse(stop.leg);
                            return(
                                <Marker
                                    key={`leg_${index}`}
                                    lat={leg.end_location.lat}
                                    lng={leg.end_location.lng}
                                    text={(index += 1).toString()}
                                />)
                            }
                        )
                    }
                </GoogleMapReact>
            </div>
            <div className='col-12 col-md-4'>
                <RouteOrganizer
                    key={Math.random()}
                    route={route}
                    optimize={(callback: any)=>loadRoute(true, callback)}
                    reorderAndRecalculate={reorderAndRecalculate}
                />
            </div>
        </div>
    )
}

interface MarkerProps {
    lat: number,
    lng: number,
    text: string
}
export const Marker = (props: MarkerProps): React.ReactElement =>
    <div style={{fontSize: '2em', color: 'red', fontWeight: 'bold'}}>{props.text}</div>