import React from 'react';
import Order, { OrderDTO } from '../../models/OrderModel';

import orderService from '../../services/OrderService';
import OrderItem from '../../models/OrderItemModel';
import helpers, {OrderedItems} from '../../helpers/helpers';
import momentHelper from '../../helpers/MomentHelper';
import { Link, Redirect } from 'react-router-dom';
import OrderEmail from "./OrderEmail";

interface State {
    loading: boolean,
    order: Order,
    updating: boolean,
    updatesPending: boolean,
    returnToOrders: boolean
}

export default class OrderEdit extends React.Component<any, State> {

    state = {
        loading: true,
        order: new Order(),
        updating: false,
        updatesPending: false,
        returnToOrders: false
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;

        orderService.get<Order>(params.id)
            .then((order: Order) => this.setState({order, loading: false}))
            .catch( err => window.alert(err))
    }

    private saveUpdates = (): void => {
        this.setState({updating: true});
        orderService.update<any>(new OrderDTO(this.state.order))
            .then((order: Order) => this.setState({order, updating: false, updatesPending: false, returnToOrders: true}))
            .catch ( err => window.alert(err))
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        let order: any = this.state.order;
        order[e.target.id] = e.target.value;
        this.setState({order, updatesPending: true})
    }

    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        if (this.state.returnToOrders)
            return <Redirect to="/dashboard/orders" />

        const orderedItems: OrderedItems = helpers.sortOrderItemsByDate(this.state.order.items);

        return (
            <div className="row edit_order">
                <div className="col-12">
                    <Link to={'/dashboard/orders'}>{`<<< Return to Orders`}</Link>
                    <br/><br/>
                </div>
                <div className="col-12">
                    <h5>Order ID: {this.state.order.public_id}</h5>
                    <select id="order_status" defaultValue={this.state.order.order_status}
                            className={`order_status order_status--${this.state.order.order_status}`}
                            onChange={this.updateData} disabled={this.state.updating}>
                        <option value="0">Canceled</option>
                        <option value="1">Pending</option>
                        <option value="2">Paid</option>
                    </select>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group mt-2">
                        <label htmlFor="contact_name">contact name</label>
                        <input id="contact_name" type="text" className="form-control" disabled={this.state.updating}
                                value={this.state.order.contact_name} onChange={this.updateData}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">phone number</label>
                        <input id="phone_number" type="text" className="form-control" disabled={this.state.updating}
                                value={this.state.order.phone_number} onChange={this.updateData}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">city</label>
                        <input id="city" type="text" className="form-control" disabled={this.state.updating}
                                value={this.state.order.city} onChange={this.updateData}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="zip">zip</label>
                        <input id="zip" type="text" className="form-control" disabled={this.state.updating}
                                value={this.state.order.zip} onChange={this.updateData}/>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label htmlFor="email">email</label>
                        <input id="email" type="email" className="form-control" disabled={this.state.updating}
                                value={this.state.order.email} onChange={this.updateData}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="street_address">Street Address</label>
                        <input id="street_address" type="text" className="form-control" disabled={this.state.updating}
                                value={this.state.order.street_address} onChange={this.updateData}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="unit">unit</label>
                        <input id="unit" type="text" className="form-control" disabled={this.state.updating}
                                value={this.state.order.unit} onChange={this.updateData}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes">delivery notes</label>
                        <textarea id="notes" className="form-control" disabled={this.state.updating}
                                value={this.state.order.notes} onChange={this.updateData}/>
                    </div>
                </div>
                <div className="col-2">
                    <pre>
                        <code className="prettyprint">
                            {JSON.stringify(this.state.order.square_payment, null, 4)}
                        </code>
                    </pre>
                </div>
                <div className="col-12">
                    <button className="btn btn-outline-success" onClick={this.saveUpdates}
                            disabled={!this.state.updatesPending || this.state.updating}>Save Updates</button>
                </div>
                <div className="col-12 edit_order_deliveries">
                    <hr/>
                    <h5>Deliveries:</h5>
                    {
                        Object.keys(orderedItems).sort().map((key: string) => {
                            return (
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <b>{momentHelper.asFullDate(key)}</b>
                                        {
                                            orderedItems[key].map((orderItem: OrderItem) =>
                                                <div className="row">
                                                    <div className="col-12">
                                                        &nbsp;&nbsp;&nbsp;
                                                        {orderItem.cart_item.quantity}
                                                        &nbsp;
                                                        {helpers.extractCartItemDescription(orderItem.cart_item)}
                                                    </div>
                                                </div>
                                            ) 
                                        }
                                    </div> 
                                </div>
                            )
                        })
                    }
                </div>
                <div className={'col-12'}>
                    <hr/>
                    <h5>Email Customer:</h5>
                    <OrderEmail order={this.state.order}/>
                </div>
            </div> 
        )
    }
}