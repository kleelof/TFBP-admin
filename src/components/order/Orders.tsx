import React from 'react';
import Order from '../../models/OrderModel';
import OrderRow from './OrderRow';

import orderService from '../../services/OrderService';

interface IState {
    loading: boolean,
    orders: Order[]
}

export default class Orders extends React.Component<any, IState> {

    state = {
        loading: false,
        orders: []
    }

    public componentDidMount = (): void => {
        this.getByDateRange();
    }

    private getByDateRange = (): void => {
        this.setState({loading: true});

        orderService.getByDateRange<Order[]>('2020-06-16', '2020-06-19')
            .then((orders: Order[]) => {
                this.setState({orders, loading: false})
            })
    }

    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        if (this.state.orders.length === 0)
            return <div></div>

        return(
            <div className="row">
                <div className="col-12">
                    {
                        this.state.orders.map((order: Order) => <OrderRow order={order} key={order.id} />)
                    }
                </div>
            </div>
        )
    }
}