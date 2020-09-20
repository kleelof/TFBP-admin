import React, {useEffect, useState} from 'react';
import Order from "../../models/OrderModel";
import { useParams } from 'react-router-dom';
import deliveryWindowService from '../../services/DeliveryWindowService';
import DeliveryRouteDTO from "../../dto/DeliveryRouteDTO";
import GoogleMapReact, {Maps} from 'google-map-react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import RouteOrganizer from "./RouteOrganizer";

interface Props {
}

export const DeliveryPlanner = (props: Props): React.ReactElement => {
    const params: any = useParams();
    const [route, setRoute] = useState<Route[]>([]);
    // const [legs, setLegs] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadRoute();
    }, [])

    const handleApiLoaded = (map: any, maps: Maps) => {
      console.log(map, maps)
    };

    const loadRoute = (optimize: boolean = false): void => {
        deliveryWindowService.retrieveRoute(params.delivery_window, params.target_date, optimize)
            .then((route: Route[]) => {
                setRoute(route);
                setLoading(false);
            })
            .catch(() => window.alert('unable to load route'))
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

    if (loading)
        return <LoadingOverlay />

     return (

        <div className='row delivery_planner'>
            <div className='col-12'>
                <h3>route planner</h3>
                <hr/>
            </div>
            <div className='col-12 col-md-6 delivery_planner__map_div'>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyC0yq5uGlMfHp98X-L452J-dzR2HX5FEP8'}}
                  center={JSON.parse(route[0].leg)['start_location']}
                  zoom={10}
                  yesIWantToUseGoogleMapApiInternals={true}
                  options={createMapOptions}
                  onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                >
                    {
                        route.map((entry: Route, index: number) => {
                            let leg: any = JSON.parse(entry.leg);
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
            <div className='col-12 col-md-6'>
                <h5>stops</h5>
                <RouteOrganizer route={route} optimize={()=>loadRoute(true)} />
            </div>
        </div>
    )
}

const Marker = (props: any): React.ReactElement =>
    <div style={{fontSize: '2em', color: 'red', fontWeight: 'bold'}}>{props.text}</div>