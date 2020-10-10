import React from 'react';

import deliveryDayService from '../../services/DeliveryDayService';
import DeliveryDay from '../../models/DeliveryDayModel';
import helpers from '../../helpers/helpers';
import momentHelper from '../../helpers/MomentHelper';
import LoadingOverlay from '../overlays/LoadingOverlay';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import {RouteComponentProps} from 'react-router-dom';
import {config} from "../../config";

interface Props extends RouteComponentProps {
    match: any
}

interface State {
    loaded: boolean,
    deliveryDay: DeliveryDay,
    startDate: string,
    endDate: string,
    duplicating: boolean
}

export default class DeliveryDuplicate extends React.Component<Props, State> {

    state = {
        loaded: false,
        deliveryDay: new DeliveryDay(),
        startDate: '',
        endDate: '',
        duplicating: false
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;
        deliveryDayService.get<DeliveryDay>(params.id)
            .then((deliveryDay: DeliveryDay) => {
                this.setState({deliveryDay, loaded: true})
            })
    }

    private datesAreValid = (): boolean => {
        return( 
            this.state.startDate !== '' &&
            this.state.endDate !== '' &&
            this.state.endDate > this.state.startDate
            )
    }

    private duplicate = (): void => {
        if(!window.confirm(`Are you sure you want duplicate: ${this.state.startDate} to ${this.state.endDate}`))
            return;

        deliveryDayService.duplicateDeliveryDay(this.state.deliveryDay, this.state.startDate, this.state.endDate)
            .then((deliveryDay: DeliveryDay) => {
                this.props.history.push({pathname: `/dashboard/delivery/edit/${deliveryDay.id}`})
            })
            .catch( err => window.alert("Unable to duplicate"));
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<State, keyof State>);
    }

    public render() {
        if (!this.state.loaded)
            return <LoadingOverlay />

        return(
            <div className="row delivery_duplicate">
                <div className="col-12 delivery_duplicate__dates">
                    <h3>duplicate delivery menu</h3>
                    {momentHelper.asFullDate(this.state.deliveryDay.date)} - {momentHelper.asFullDate(this.state.deliveryDay.end_date)}
                    <hr/>
                </div>
                <div className="col-12">
                    Duplicate to:
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-2 delivery_duplicate__date">
                            <small>start date</small>
                            <br/>
                            <input
                                type="date"
                                id="startDate"
                                value={this.state.startDate}
                                disabled={this.state.duplicating}
                                onChange={this.updateData} />
                        </div>
                        <div className="col-12 col-md-2 delivery_duplicate__date">
                            <small>end date</small>
                            <br/>
                            <input
                                type="date"
                                id="endDate"
                                value={this.state.endDate}
                                disabled={this.state.duplicating}
                                onChange={this.updateData} />
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-3">
                    <button 
                        className="btn btn-outline-success duplicate_btn" disabled={!this.datesAreValid()}
                        onClick={this.duplicate}>
                            Duplicate</button>
                    <button 
                        className="btn btn-default ml-3"
                        onClick={() => (this.props as any).history.push({pathname: '/dashboard/deliveries'})}>
                            Cancel</button>
                </div>
                <div className="col-12 delivery_duplicate_items">
                    <hr/>
                    <div className="row">
                        {
                            this.state.deliveryDay.day_items.map((item: DeliveryDayItem) => {
                                return(
                                    <div className="col-12 col-md-3 delivery_duplicate_items__item" key={`di_${item.id}`}>
                                        {item.menu_item.name}
                                        <div className='delivery_duplicate_items__item_image'>
                                            <img src={`${config.API_URL + config.UPLOADS_PATH}/${item.menu_item.image}`} alt={item.menu_item.name}/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}