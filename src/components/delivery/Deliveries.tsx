import React from 'react';

import deliveryDayService from '../../services/DeliveryDayService';

import './delivery.css';
import { Redirect } from 'react-router-dom';
import DeliveryDay from '../../models/DeliveryDayModel';

interface IState {
    loaded: boolean,
    deliveryDays: DeliveryDay[],
    newDate: string,
    creatingDeliveryDay: boolean,
    editId: number
}

export default class Deliveries extends React.Component<any, IState> {

    constructor(props: any){
        super(props);

        this.state = {
            loaded: false,
            deliveryDays: [],
            newDate: "",
            creatingDeliveryDay: false,
            editId: 0
        }
    }

    public componentDidMount = (): void => {
        deliveryDayService.get<DeliveryDay[]>()
            .then((deliveryDays: DeliveryDay[]) => this.setState({deliveryDays, loaded: true}))
            .catch( err => window.alert("Unable to load weeks"))
    }

    public createDeliveryDay = (): void => {
        this.setState({creatingDeliveryDay: true})
        deliveryDayService.add<DeliveryDay>(new DeliveryDay(this.state.newDate))
            .then((deliveryDay: DeliveryDay) => {
                this.setState({deliveryDays: [deliveryDay, ...this.state.deliveryDays], newDate: "", creatingDeliveryDay: false})
            }) 
            .catch( err => window.alert("Unable to create week"))
    }

    private updateDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({newDate: e.target.value});
    }

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div> 

        if (this.state.editId !== 0)
            return <Redirect to={`delivery/edit/${this.state.editId}`} />
        
        const deliveries: DeliveryDay[] = this.state.deliveryDays;
        deliveries.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));

        return(
            <div className="row weeks">
                <div className="col-12">
                    <h5>Add A Delivery Day:</h5>
                    <input
                        type="date"
                        value={this.state.newDate}
                        disabled={this.state.creatingDeliveryDay}
                        onChange={this.updateDate} />
                    <button 
                        className="btn btn-success ml-2"
                        onClick={this.createDeliveryDay}
                        disabled={this.state.creatingDeliveryDay}
                        >Add</button> 
                    <hr/>
                </div>
                {
                    deliveries.map((deliveryDay: DeliveryDay) => {
                        return(
                            <div 
                                className="col-12 week-listing"
                                key={`week_${deliveryDay.id}`}
                                onClick={()=> this.setState({editId: deliveryDay.id})}>
                                    {deliveryDay.date}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}