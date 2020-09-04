import React, {useEffect, useState, Fragment} from 'react';
import DeliveryWindow, {DeliveryWindowWithCountsDTO} from "../../models/DeliveryWindowModel";
import deliveryWindowService from '../../services/DeliveryWindowService';

import './browser_day.scss';
import { useHistory } from 'react-router-dom';
import helpers from "../../helpers/helpers";

interface Props {
    date: Date
}

export const BrowserDay = (props: Props): React.ReactElement => {
    const [countsData, setCountsData] = useState<DeliveryWindowWithCountsDTO[] | undefined>(undefined)
    const history = useHistory();

    useEffect(() => {
        deliveryWindowService.listWithCounts(props.date)
            .then((countsData: DeliveryWindowWithCountsDTO[]) => {
                setCountsData(countsData);
            })
            .catch( err => window.alert(`unable to load date: ${props.date.toISOString().slice(0,10)}`))

    }, []);

    return(
        <div
            className={'row browser_day nopadding'}
            onClick={() => history.push({pathname: `/dashboard/browser/day/${helpers.dateToShortISO(props.date)}`})}
        >
            <div className={'col-12 nopadding'}>
                <div className={`browser_day__date ${helpers.dateToShortISO(props.date) == helpers.dateToShortISO(new Date()) ? 'browser_day__date--today' : ''}`}>
                    {props.date.getDate()}
                </div>
                <div className='browser_day__windows'>
                    {
                        countsData === undefined ? <div></div> :
                            countsData.map((dto: DeliveryWindowWithCountsDTO) =>
                                <div className={'browser_day__window'} key={`dto_${dto.window.id}`}>
                                    <div className={'d-none d-md-block'}>
                                        {dto.window.name}
                                    </div>
                                    <div className={''}>
                                        {
                                            `${dto.order_count}  ${dto.dish_count}`
                                        }
                                    </div>
                                    <hr/>
                                </div>
                            )

                    }
                </div>
            </div>
        </div>
    )
}