import React, {useEffect, useState} from 'react';
import Order from "../../models/OrderModel";
import { useParams } from 'react-router-dom';
import deliveryWindowService from '../../services/DeliveryWindowService';
import DeliveryRouteDTO from "../../dto/DeliveryRouteDTO";
import GoogleMapReact, {Maps} from 'google-map-react';
import LoadingOverlay from "../overlays/LoadingOverlay";

interface Props {
}

export const DeliveryPlanner = (props: Props): React.ReactElement => {
    const params: any = useParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [legs, setLegs] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        deliveryWindowService.retrieveRoute(params.delivery_window, params.target_date)
            .then((dto: DeliveryRouteDTO) => {
                setOrders(dto.orders);
                setLegs(dto.response['routes'][0]['legs']);
                setLoading(false);
            })
            .catch(() => window.alert('unable to load route'))
    }, [])

    const handleApiLoaded = (map: any, maps: Maps) => {
      console.log(map, maps)
    };

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

    console.log(legs[0]['start_location'])
    return (

        <div className='delivery_planner' style={{width: '100%', height: '600px'}}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyC0yq5uGlMfHp98X-L452J-dzR2HX5FEP8'}}
              center={legs[0]['start_location']}
              zoom={10}
              yesIWantToUseGoogleMapApiInternals={true}
              options={createMapOptions}
              onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
            >
                {
                    legs.map((leg: any, index: number) =>
                      <Marker
                          key={`leg`}
                          lat={leg.start_location.lat}
                          lng={leg.start_location.lng}
                          text={index.toString()}
                      />
                    )
                }
            </GoogleMapReact>
        </div>
    )
}

const Marker = (props: any): React.ReactElement =>
    <div style={{fontSize: '2em', color: 'red', fontWeight: 'bold'}}>{props.text}</div>