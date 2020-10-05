/*
    Handles listing DeliveryDayComponent
 */
import React from 'react';
import {format} from 'date-fns';
import deliveryDayService from '../../services/DeliveryDayService';

import './delivery.scss';
import { Redirect } from 'react-router-dom';
import DeliveryDay from '../../models/DeliveryDayModel';

import { DeliveryDays } from './DeliveryDays';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import couponService from "../../services/CouponService";
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import Coupon from "../../models/Coupon";
import LoadingOverlay from "../overlays/LoadingOverlay";
import {PageSelector} from "../widgets/page_selector/PageSelector";

interface State {
    loading: boolean,
    deliveryDays: DeliveryDay[],
    startDate: string,
    endDate: string,
    creatingDeliveryDay: boolean,
    editId: number,
    currentPage: number,
    paginationCount: number
}

export default class Deliveries extends React.Component<any, State> {

    state = {
        loading: true,
        deliveryDays: [],
        startDate: "",
        endDate: "",
        creatingDeliveryDay: false,
        editId: 0,
        currentPage: 0,
        paginationCount: 0
    }

    public componentDidMount = (): void => {
        this.changePages(1);
    }

    private changePages = (pageNumber: number): void => {
        this.setState({currentPage: pageNumber, loading: true});

        deliveryDayService.pagedSearchResults(pageNumber)
            .then((dto: PagedResultsDTO) => {
                this.setState({
                    deliveryDays: dto.results as DeliveryDay[],
                    loading: false,
                    paginationCount: dto.count
                })
                }
            )
            .catch( err => console.log(err))
    }

    private createDeliveryDay = (): void => {
        if (this.state.startDate > this.state.endDate) {
            window.alert('End date must be after start date');
            return;
        }

        this.setState({creatingDeliveryDay: true})
        deliveryDayService.add<DeliveryDay>(new DeliveryDay(this.state.startDate, -1, this.state.endDate))
            .then((deliveryDay: DeliveryDay) => {
                this.setState({
                    editId: deliveryDay.id, 
                    startDate: "",
                    creatingDeliveryDay: false}) 
            }) 
            .catch( err => window.alert("Unable to create week"))
            .then(() => this.setState({creatingDeliveryDay: false}))
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<State, keyof State>);
    }

    public render() {
        if (this.state.loading)
            return <LoadingOverlay />

        if (this.state.editId !== 0)
            return <Redirect to={`delivery/edit/${this.state.editId}`} />
        
        const deliveries: DeliveryDay[] = this.state.deliveryDays;
        deliveries.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));

        return(
            <div className="row weeks">
                <div className={'col-12'}>
                    <h3>delivery menus</h3>
                    <hr/>
                </div>
                <div className="col-12">
                    <h5>create delivery menu</h5>
                    <input
                        type="date"
                        id="startDate"
                        value={this.state.startDate}
                        disabled={this.state.creatingDeliveryDay}
                        onChange={this.updateData} />

                    <input
                        className={'ml-2'}
                        type="date"
                        id="endDate"
                        value={this.state.endDate}
                        disabled={this.state.creatingDeliveryDay}
                        onChange={this.updateData} />

                    <LoadingIconButton
                        label='create'
                        busy={this.state.creatingDeliveryDay}
                        btnClass="btn btn-sm btn-outline-success"
                        outerClass='ml-2 mt-2 mt-m-0'
                        onClick={this.createDeliveryDay}
                        disabled={this.state.creatingDeliveryDay}
                        />
                    <PageSelector numItems={this.state.paginationCount} currentPage={this.state.currentPage} gotoPage={this.changePages} />
                    <hr/>
                </div>
                {
                    deliveries.map((deliveryDay: DeliveryDay) =>
                        <div className="col-12 col-md-6 deliveries__delivery_days" key={`dd_${deliveryDay.id}`}>
                            <DeliveryDays 
                                deliveryDay={deliveryDay}
                                key={`dd_${deliveryDay.id}`}/>
                        </div>
                    )
                }
            </div>
        )
    }
}