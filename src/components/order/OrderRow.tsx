import React from 'react';
import Order from '../../models/OrderModel';

interface IProps {
    order: Order
}

export default class OrderRow extends React.Component<IProps, any> {
    
    private ORDER_STATUSES: string[] = ['canceled', 'pending', 'paid'];

    public render() {
        
        return(
            <div className="row order-row">
                <div className="col-12 order-row-header">
                    <div className="row">
                        <div className="col-8 col-6">{this.props.order.contact_name}</div>
                        <div className="col-4">{this.ORDER_STATUSES[this.props.order.status]}</div>
                        <div className="col-5">{this.props.order.phone_number}</div>
                        <div className="col-7">{this.props.order.email}</div>
                    </div>
                </div>
            </div>
        )
    }
}