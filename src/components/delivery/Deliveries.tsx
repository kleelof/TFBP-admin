import React from 'react';

import deliveryDayService from '../../services/DeliveryDayService';

import './delivery.css';
import { Redirect } from 'react-router-dom';
import DeliveryDay from '../../models/DeliveryDayModel';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import helpers from '../../helpers/helpers';

interface IState {
    loaded: boolean,
    deliveryDays: DeliveryDay[],
    newDate: string,
    creatingDeliveryDay: boolean,
    editId: number
}

export default class Deliveries extends React.Component<any, IState> {

    state = {
        loaded: false,
        deliveryDays: [],
        newDate: "",
        creatingDeliveryDay: false,
        editId: 0
    }

    public componentDidMount = (): void => {
        deliveryDayService.get<DeliveryDay[]>()
            .then((deliveryDays: DeliveryDay[]) => this.setState({deliveryDays, loaded: true}))
            .catch( err => window.alert("Unable to load weeks"))
    }

    private createDeliveryDay = (): void => {
        this.setState({creatingDeliveryDay: true})
        deliveryDayService.add<DeliveryDay>(new DeliveryDay(this.state.newDate))
            .then((deliveryDay: DeliveryDay) => {
                this.setState({deliveryDays: [deliveryDay, ...this.state.deliveryDays], newDate: "", creatingDeliveryDay: false})
            }) 
            .catch( err => window.alert("Unable to create week"))
    }

    private deleteDeliveryDay = (deliveryDay: DeliveryDay): void => {
         
    }

    private duplicateDeliveryDay = (deliveryDay: DeliveryDay): void => {
        if (this.state.newDate === ""){
            window.alert("Selecte a date to duplicate to.");
        }

        if(!window.confirm(`Are you sure you want duplicate ${deliveryDay.date} to ${this.state.newDate}`))
            return;

        deliveryDayService.duplicateDeliveryDay(deliveryDay, this.state.newDate)
            .then((deliveryDay: DeliveryDay) => {
                this.setState({editId: deliveryDay.id})
            })
            .catch( err => window.alert("Unable to duplicate"));
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<IState, keyof IState>);
    }

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div> 

        if (this.state.editId !== 0)
            return <Redirect to={`delivery/edit/${this.state.editId}`} />
        
        const deliveries: DeliveryDay[] = this.state.deliveryDays;
        deliveries.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));

        return(
            
            <div className="row weeks">
                <div className="col-12">
                    <h5>Add A Delivery Day:</h5>
                    <input
                        type="date"
                        id="newDate"
                        value={this.state.newDate}
                        disabled={this.state.creatingDeliveryDay}
                        onChange={this.updateData} />
                    <button 
                        className="btn btn-success ml-2"
                        onClick={this.createDeliveryDay}
                        disabled={this.state.creatingDeliveryDay}
                        >Add</button> 
                    <hr/>
                </div>
                <div className="col-12">
                    {
                        
                        deliveries.map((deliveryDay: DeliveryDay) => 
                            <div className="row deliveries-day" key={`week_${deliveryDay.id}`}>
                                <div className="col-4">
                                    {deliveryDay.date}
                                </div>
                                <div className="col-8">
                                    <button
                                        className="btn btn-success"
                                        onClick={()=> this.setState({editId: deliveryDay.id})}>
                                            Edit
                                        </button>
                                    <button
                                        className="btn btn-warning ml-2"
                                        onClick={()=> this.duplicateDeliveryDay(deliveryDay)}>
                                            Duplicate
                                        </button>
                                </div>
                                {
                                    helpers.sortDeliveryDayItemsByCategory(deliveryDay.day_items).map((item: DeliveryDayItem) =>
                                            <div className="col-3 deliveries-day-item" key={`ddi_${item.id}`}>
                                                <small>{item.menu_item.name}</small>
                                                <div>
                                                    <img src={`${item.menu_item.image}`} alt={item.menu_item.name} />
                                                </div>
                                            </div>
                                    )
                                }
                                <div className="col-12"><hr/></div>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}