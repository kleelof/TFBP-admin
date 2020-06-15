import React from 'react';
import Order from '../../models/OrderModel';

// import orderService from '../../services/OrderService';

interface IState {
    loading: boolean,
    orders: Order[]
}

export default class Orders extends React.Component<any, IState> {

    state = {
        loading: true,
        orders: []
    }

    public componentDidMount = (): void => {

    }

    public render() {
        return(
            <div>Orders</div>
        )
    }
}