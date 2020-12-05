import React, {ChangeEvent, useState} from 'react';
import deliveryDayService from '../../services/DeliveryDayService';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import DeliveryDay from "../../models/DeliveryDayModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {PageSelector} from "../widgets/page_selector/PageSelector";
import { useHistory } from 'react-router-dom';
import momentHelper from "../../helpers/MomentHelper";
import { Fragment } from 'react';

export const RestaurantMenuManager = (): React.ReactElement => {

    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deliveryDays, setDeliveryDays] = useState<DeliveryDay[]>([]);
    const [paginationCount, setPaginationCount] = useState(0);
    const [startDate, updateStartDate] = useState('');
    const [endDate, updateEndDate] = useState('');
    const [creatingDeliveryDay, setCreatingDeliveryDay] = useState(false);
    const [isPerpetual, setIsPerpetual] = useState(false);
    const [newMenuName, updateNewMenuName] = useState('');



    React.useEffect(() => {
        changePages(1);
    }, [])

    const changePages = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
        setLoading(true);

        deliveryDayService.pagedSearchResults(pageNumber)
            .then((dto: PagedResultsDTO) => {
                setDeliveryDays(dto.results as DeliveryDay[])
                setLoading(false);
                setPaginationCount(dto.count);
                }
            )
            .catch( err => console.log(err))
    }

    const createDeliveryDay = (): void => {
        if (startDate > endDate ||
            (!isPerpetual &&
                (startDate === '' || endDate === ''))) {
            window.alert('invalid dates');
            return;
        }

        if (newMenuName === '') {
            window.alert('enter a name for this menu');
            return;
        }

        setCreatingDeliveryDay(true);
        deliveryDayService.add<DeliveryDay>(new DeliveryDay(
            startDate !== '' ? startDate : '1970-01-01',
            -1,
            endDate !== '' ? endDate : '1970-01-01',
            [],
            isPerpetual,
            newMenuName)
        )
            .then((deliveryDay: DeliveryDay) => console.log() )//history.push(`rest/menu/edit/${deliveryDay.id}`))
            .catch( err => {
                window.alert("Unable to create week");
                setCreatingDeliveryDay(false);
            })
    }

    return (
        <div className='row restaurant_menu_manager justify-content-center'>
            <div className='col-12 col-md-7'>
                <div className='row'>
                    <div className='col-12'>
                        <h3>menu manager</h3>
                        <hr/>
                    </div>
                    <div className="col-12">
                        <h5>create delivery menu</h5>
                        <div className='row'>
                            <div className='col-12 mb-2'>
                                <input
                                    className='form-control'
                                    placeholder='menu name'
                                    value={newMenuName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateNewMenuName(e.target.value)}
                                    />
                            </div>
                            <div className='col-6 col-md-3'>
                                <div className="checkbox_selector">
                                    <input
                                        type='checkbox'
                                        checked={isPerpetual}
                                        onClick={() => setIsPerpetual(!isPerpetual)}
                                        />
                                    <span>perpetual</span>
                                </div>
                            </div>
                            <div className='col-6 col-md-9 text-right'>
                                <LoadingIconButton
                                    label='create'
                                    busy={creatingDeliveryDay}
                                    btnClass="btn btn-sm btn-outline-success"
                                    outerClass='ml-2 mt-2 mt-m-0'
                                    onClick={createDeliveryDay}
                                    disabled={creatingDeliveryDay}
                                    />
                            </div>
                            {!isPerpetual &&
                                <Fragment>
                                    <div className='col-12 col-md-6'>
                                        <small>start date:</small>
                                        <br/>
                                        <input
                                            type="date"
                                            id="startDate"
                                            value={startDate}
                                            disabled={creatingDeliveryDay || isPerpetual}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateStartDate(e.target.value)} />
                                    </div>
                                    <div className='col-12 col-md-6'>
                                        <small>end date:</small>
                                        <br/>
                                        <input
                                            type="date"
                                            id="endDate"
                                            value={endDate}
                                            disabled={creatingDeliveryDay || isPerpetual}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateEndDate(e.target.value)} />
                                    </div>
                                </Fragment>
                            }
                        </div>
                        <PageSelector numItems={paginationCount} currentPage={currentPage} gotoPage={changePages} />
                        <hr/>
                    </div>
                    <div className='col-12 restaurant_menu_manager__menus'>
                        <table className='table'>
                            <thead>
                                <th>menu name</th>
                                <td><small>click on menu to edit</small></td>
                                <th>active</th>
                            </thead>
                            <tbody>
                                {
                                    deliveryDays.map((deliveryDay: DeliveryDay) =>
                                        <tr
                                            key={`delday_${deliveryDay.id}`}
                                            onClick={() => history.push({pathname: `/dashboard/rest/menu/edit/${deliveryDay.id}`})}
                                        >
                                            <td>{deliveryDay.name}</td>
                                            <td>
                                                {
                                                    deliveryDay.is_perpetual ?
                                                        <div
                                                            className='col-12'
                                                            >
                                                            perpetual
                                                        </div>
                                                        :
                                                        <Fragment>
                                                            <div className="col-12 delivery_days__date">
                                                                {momentHelper.asShortDate(deliveryDay.date)} -
                                                            </div>
                                                            <div className="col-12 col-md-6 delivery_days__end_date">
                                                                {momentHelper.asShortDate(deliveryDay.end_date)}
                                                            </div>
                                                        </Fragment>
                                                }
                                            </td>
                                            <td>
                                                {
                                                    deliveryDay.is_active ? 'yes' : 'no'
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}