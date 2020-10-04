import React, {useEffect, useState, Fragment} from 'react';
import DeliveryWindow, {DeliveryWindowWithCountsDTO} from "../../models/DeliveryWindowModel";
import deliveryWindowService from '../../services/DeliveryWindowService';

import './browser.scss';
import { useHistory } from 'react-router-dom';
import momentHelper from '../../helpers/MomentHelper';
import LoadingOverlay from "../overlays/LoadingOverlay";

interface Props {
    date: Date
}

export const BrowserDay = (props: Props): React.ReactElement => {
    const [countsData, setCountsData] = useState<DeliveryWindowWithCountsDTO[] | string>([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        deliveryWindowService.listWithCounts(momentHelper.asDateSlug(props.date))
            .then((countsData: DeliveryWindowWithCountsDTO[]) => {
                setCountsData(countsData);
            })
            .catch( err => window.alert(`unable to load date: ${props.date.toISOString().slice(0,10)}`))
            .then(() => setLoading(false))

    }, []);

    if (loading)
        return <LoadingOverlay />

    const today: string = momentHelper.asDateSlug(new Date());
    let hasWindows: boolean = false
    let deliveryCount: number = 0;
    let dishCount: number = 0;

    // check if the day has any delivery windows
    if (typeof countsData === 'object'){
        hasWindows = true;
        countsData?.forEach((dto: DeliveryWindowWithCountsDTO) => {
            deliveryCount += dto.order_count;
            dishCount += dto.dish_count
        })
    }

    return(
        <div
            className={'browser_day'}
        >
            <div className={'nopadding'}>
                <div className={`browser_day__date ${momentHelper.asDateSlug(props.date) === today ? 'browser_day__date--today' : ''}`}
                     onClick={() => history.push({pathname: `/dashboard/browser/day/${momentHelper.asDateSlug(props.date)}`})}
                >
                    {props.date.getDate()}
                </div>
                <div className='browser_day__data'>
                    {(hasWindows && deliveryCount === 0) &&
                            <div className='browser_day__no_orders'>
                                <span className='d-none d-md-inline'>
                                    no orders
                                </span>
                                <br/>
                                &nbsp;
                            </div>
                    }
                    {(hasWindows && deliveryCount > 0) &&
                        <Fragment>
                            <div className='browser_day__delivery_count'><span className='d-none d-md-inline'>deliveries: </span>{deliveryCount}</div>
                            <div className='browser_day__dish_count'><span className='d-none d-md-inline'>dishes: </span>{dishCount}</div>
                        </Fragment>
                    }
                    {!hasWindows &&
                        <div>&nbsp;<br/>&nbsp;</div>
                    }
                </div>
            </div>
        </div>
    )
}