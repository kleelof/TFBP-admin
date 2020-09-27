import React, {useEffect, useState} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import deliveryWindowService from '../../services/DeliveryWindowService';
import GoogleMapReact, {Maps} from 'google-map-react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import RouteOrganizer from "./RouteOrganizer";
import RouteStop from "../../models/RouteStopModel";
import MomentHelper from "../../helpers/MomentHelper";

export const DeliveryPlanner = (props: any): React.ReactElement => {
    const params: any = useParams();
    const history = useHistory();
    const [route, setRoute] = useState<Route>(new Route());
    const [loading, setLoading] = useState<boolean>(true);

    let map: any;
    let maps: any;
    let markers: any[] = [];

    useEffect(() => {
        deliveryWindowService.retrieveRoute(params.delivery_window, params.target_date)
            .then((route: Route) => {
                setRoute(route);
                setLoading(false);
                firstBuild();
            })
            .catch(() => window.alert('unable to load route'))
    }, [])

    const handleApiLoaded = (imap: any, imaps: Maps) => {
      map = imap;
      maps = imaps;
      firstBuild();
    };

    const firstBuild = (): void => {
        return;
        if (route.id === -1 || map === undefined) return;
        updateStops(route.stops);
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

    const updateStops = (stops: RouteStop[]): void => {
        if (map !== undefined) {

            // clear old markers
            markers.forEach((marker: any) => marker.setMap(null));
            markers = [];

            // add new markers
            stops.forEach((stop: RouteStop, index: number) => {
                markers.push(
                    new maps.Marker({
                        position: JSON.parse(stop.leg).end_location,
                        map,
                        title: stop.order.street_address,
                        label: {
                            color: '#00ff00',
                            fontWeight: 'bold',
                            fontSize: '3em',
                            text: (index + 1).toString()
                        },
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    })
                )
            })
        }
    }

    if (loading)
        return <LoadingOverlay />

     return (
        <div className='row delivery_planner justify-content-center'>
            <div className='col-12'>
                <h3>route planner</h3>
                <b>{MomentHelper.asShortDate(route.delivery_date)}</b>
                <button
                    className='btn btn-sm btn-outline-info delivery_planner__back_btn'
                    onClick={() => history.goBack()}
                >
                    back to tools
                </button>
                <hr/>
            </div>
            <div className={`d-none ${route.route_status !== 0 ? 'd-md-none' : 'd-md-block'}  col-md-8 delivery_planner__map_div`}>
                {route.route_status === 0 &&
                    <GoogleMapReact
                        key={Math.random()}
                        bootstrapURLKeys={{key: 'AIzaSyC0yq5uGlMfHp98X-L452J-dzR2HX5FEP8'}}
                        center={JSON.parse(route.stops[0].leg)['start_location']}
                        zoom={10}
                        yesIWantToUseGoogleMapApiInternals={true}
                        options={createMapOptions}
                        onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                    >
                        {
                            route.stops.sort((a, b) => (a.current_index > b.current_index) ? 1 : ((b.current_index > a.current_index) ? -1 : 0)).map((stop: RouteStop, index: number) => {
                                    let leg: any = JSON.parse(stop.leg);
                                    return (
                                        <Marker
                                            key={Math.random()}
                                            lat={leg.end_location.lat}
                                            lng={leg.end_location.lng}
                                            text={(index += 1).toString()}
                                        />)
                                }
                            )
                        }
                    </GoogleMapReact>
                }
            </div>
            <div className='col-12 col-md-4'>
                <RouteOrganizer
                    key={Math.random()}
                    route={route}
                    updateRoute={(route: Route) => setRoute(route)}
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