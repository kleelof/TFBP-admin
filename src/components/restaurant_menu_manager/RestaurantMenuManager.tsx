import React, {ChangeEvent, useState} from 'react';
import deliveryDayService from '../../services/DeliveryDayService';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import DeliveryDay from "../../models/DeliveryDayModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {PageSelector} from "../widgets/page_selector/PageSelector";
import { useHistory } from 'react-router-dom';
import {DeliveryDays} from "../delivery/DeliveryDays";

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
        if (startDate > endDate) {
            window.alert('End date must be after start date');
            return;
        }

        setCreatingDeliveryDay(true);
        deliveryDayService.add<DeliveryDay>(new DeliveryDay(startDate, -1, endDate))
            .then((deliveryDay: DeliveryDay) => history.push(`rest/menu/edit/${deliveryDay.id}`))
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
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            disabled={creatingDeliveryDay}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateStartDate(e.target.value)} />

                        <input
                            className={'ml-2'}
                            type="date"
                            id="endDate"
                            value={endDate}
                            disabled={creatingDeliveryDay}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateEndDate(e.target.value)} />

                        <LoadingIconButton
                            label='create'
                            busy={creatingDeliveryDay}
                            btnClass="btn btn-sm btn-outline-success"
                            outerClass='ml-2 mt-2 mt-m-0'
                            onClick={createDeliveryDay}
                            disabled={creatingDeliveryDay}
                            />
                        <PageSelector numItems={paginationCount} currentPage={currentPage} gotoPage={changePages} />
                        <hr/>
                    </div>
                    <div className='col-12'>
                        <table className='table'>
                            <thead>
                                <th>menu name</th>
                                <th></th>
                                <th>active</th>
                            </thead>
                            <tbody>
                                {
                                    deliveryDays.map((deliveryDay: DeliveryDay) =>
                                        <tr key={`delday_${deliveryDay.id}`}>
                                            <td>{deliveryDay.name}</td>
                                            <td>

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