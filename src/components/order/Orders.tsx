import React, { Fragment } from 'react';
import Order from '../../models/OrderModel';

import orderService from '../../services/OrderService';
import OrderItem from '../../models/OrderItemModel';
import helpers from '../../helpers/helpers';
import momentHelper from '../../helpers/MomentHelper';
import { Redirect } from 'react-router-dom';
import PagedResultsDTO from "../../dto/PagedResultsDTO";

interface State {
    loading: boolean,
    orders: Order[],
    editId: number,
    startDate: string,
    endDate: string
}

export default class Orders extends React.Component<any, State> {

    state = {
        loading: false,
        orders: [],
        editId: 0,
        startDate: '',
        endDate: ''
    }

    private orderStatuses: string[] = ['canceled', 'pending', 'paid'];

    public componentDidMount = (): void => {
        this.getByDateRange();
    }

    private getByDateRange = (startDate?: string, endDate?: string): void => {
        this.setState({loading: true});

        orderService.pagedSearchResults()
            .then((dto: PagedResultsDTO) => {
                this.setState({orders: dto.results as Order[], loading: false})
            })
    }

    private searchByOrderDateRange = (): void => {
        this.getByDateRange(this.state.startDate !== "" ? this.state.startDate : undefined, 
                                    this.state.endDate !== "" ? this.state.endDate : undefined)
    }
    
    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<State, keyof State>);
    }

    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        if (this.state.editId > 0)
            return <Redirect to={`/dashboard/orders/edit/${this.state.editId}`} /> 

        return(
            <div className="row orders">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-3">
                            Start Date: <input type="date" id="startDate" value={this.state.startDate} onChange={this.updateData}/>
                        </div>
                        <div className={'col-12 col-md-9'}>
                            End Date: <input type="date" id="endDate" value={this.state.endDate} onChange={this.updateData} />
                            &nbsp;&nbsp;
                            <button className="btn btn-outline-success" onClick={this.searchByOrderDateRange}>Search</button>
                        </div>
                    </div>
                    {
                        this.state.orders.length === 0 ?
                            <div>No Orders Found</div>
                            :
                            <table className={'table'}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Order ID</th>
                                        <th>Contact</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.orders
                                            .map((order: Order, index: number) => {
                                                let menuItemCount: number = 0;
                                                let total: number = 0;
                                                let deliveryDates: string[] = [];

                                                order.items.forEach((orderItem: OrderItem) => {
                                                    menuItemCount += orderItem.cart_item.quantity;
                                                    total += orderItem.cart_item.quantity * orderItem.cart_item.price;
                                                    if (deliveryDates.indexOf(orderItem.cart_item.delivery_date) === -1)
                                                        deliveryDates.push(orderItem.cart_item.delivery_date);
                                                })

                                                return (
                                                    <tr key={order.id} className={index % 2 ? '' : 'orders-line-highlight'}
                                                        onClick={()=> this.setState({editId: order.id})}>
                                                        <td>{order.contact_name}</td>
                                                        <td>{order.public_id}</td>
                                                        <td>{order.email}<br/>{order.phone_number}</td>
                                                        <td>{momentHelper.asFullDate(order.created_at)}</td>

                                                        <td className={`order-status-${order.order_status}`}>
                                                            {this.orderStatuses[order.order_status]}
                                                        </td>
                                                    </tr>
                                                )
                                        })
                                    }
                                </tbody>
                            </table>
                    }
                </div> 
            </div>
        )
    }
}