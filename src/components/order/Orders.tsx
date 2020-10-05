import React, { Fragment } from 'react';
import Order from '../../models/OrderModel';

import orderService from '../../services/OrderService';
import OrderItem from '../../models/OrderItemModel';
import helpers from '../../helpers/helpers';
import momentHelper from '../../helpers/MomentHelper';
import { Redirect } from 'react-router-dom';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import LoadingOverlay from "../overlays/LoadingOverlay";
import {PageSelector} from "../widgets/page_selector/PageSelector";
import InputWidget from "../widgets/inputWidget/InputWidget";

interface State {
    loading: boolean,
    orders: Order[],
    editId: number,
    startDate: string,
    endDate: string,
    currentPage: number,
    paginationCount: number
}

export default class Orders extends React.Component<any, State> {

    state = {
        loading: false,
        orders: [],
        editId: 0,
        startDate: '',
        endDate: '',
        currentPage: 0,
        paginationCount: 0
    }

    private orderStatuses: string[] = ['canceled', 'pending', 'paid'];

    public componentDidMount = (): void => {
        this.changePage(1);
    }

    private changePage = (pageNumber: number, searchPattern?: string): void => {
        this.setState({loading: true, currentPage: pageNumber});

        orderService.pagedSearchResults(pageNumber, searchPattern)
            .then((dto: PagedResultsDTO) => {
                this.setState({
                    orders: dto.results as Order[],
                    loading: false,
                    paginationCount: dto.count
                })
            })
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<State, keyof State>);
    }

    public render() {
        if (this.state.editId > 0)
            return <Redirect to={`/dashboard/orders/edit/${this.state.editId}`} /> 

        return(
            <div className="row orders">
                <div className="col-12">
                    <div className="row">
                        <div className='col-12'>
                            <InputWidget
                                id='orders_search_input'
                                type='text'
                                onUpdate={(id: string, searchPattern: string) => this.changePage(this.state.currentPage, searchPattern)}
                                />
                            <PageSelector
                                numItems={this.state.paginationCount}
                                currentPage={this.state.currentPage}
                                gotoPage={this.changePage}
                                />
                        </div>
                    </div>
                    {this.state.loading &&
                        <LoadingOverlay />
                    }
                    {!this.state.loading &&
                        this.state.orders.length === 0 ?
                            <div>No Orders Found</div>
                            :
                            <table className={'table'}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th className='d-none d-md-block'>Order ID</th>
                                        <th>Contact</th>
                                        <th className='d-none d-md-block'>Date</th>
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
                                                        <td className='d-none d-md-block'>{order.public_id}</td>
                                                        <td>{order.email}<br/>{order.phone_number}</td>
                                                        <td className='d-none d-md-block'>{momentHelper.asFullDate(order.created_at)}</td>

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