import React, {Fragment} from 'react';
import {DeliveryWindowWithCountsDTO} from "../../models/DeliveryWindowModel";
import OrderItem from "../../models/OrderItemModel";
import helpers from "../../helpers/helpers";
import momentHelper from '../../helpers/MomentHelper';
import Order from "../../models/OrderModel";
import deliveryWindowService from '../../services/DeliveryWindowService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { RouteComponentProps, withRouter } from 'react-router-dom';

import './browser.scss';

interface Props extends RouteComponentProps {
    dto: DeliveryWindowWithCountsDTO,
    date: Date,
    printDocument: (component: React.ReactElement) => void
}

interface State {
    showLoading: boolean,
    orders: Order[]
}

class BrowserWindowTools extends React.Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            showLoading: true,
            orders: []
        }
    }

    public componentDidMount() {
        deliveryWindowService.retrieveOrders(this.props.dto.window.id, this.props.date)
            .then((orders: Order[]) => this.setState({orders, showLoading: false}))
            .catch( err => window.alert('unable to load data'))
    }

    private downloadDeliverySpreadsheet = (): void => {console.log('xx')
        let fileContent: string = "Address line 1\tAddress line 2\tCity\tState\tZip\tName\tEmail Address\tPhone Number\tExternal ID\tOrder Count\tDriver\n";
        let orderItems: OrderItem[] = [];

        this.state.orders.forEach((order: Order) => {
            orderItems = order.items.filter((orderItem: OrderItem) => orderItem.cart_item.delivery_date === momentHelper.asDateSlug(this.props.date));
            if (orderItems.length > 0) {
                fileContent += `${order.street_address}\t${order.unit}\t${order.city}\tCA\t${order.zip}\t${order.contact_name}\t${order.email}\t${order.phone_number}\t${order.public_id}\t${orderItems.length}\tLee\n`;
            }
        })

        const bb = new Blob([fileContent ], { type: 'text/plain' });
        const a = document.createElement('a');
        a.download = `delivery_route_${momentHelper.asDateSlug(this.props.date)}.tsv`;
        a.href = window.URL.createObjectURL(bb);
        a.click();
        console.log(a);
    }

    private print = (pullType: string): void => {
        let orderItems: OrderItem[] = [];
        for (let x: number = 0; x < this.state.orders.length; x ++)
            for (let y: number = 0; y < this.state.orders[x].items.length; y ++)
                if (this.state.orders[x].items[y].cart_item.delivery_date === momentHelper.asDateSlug(this.props.date))
                    orderItems.push(this.state.orders[x].items[y])

        switch(pullType) {
            case 'prep': this.props.printDocument(<PrepDisplay orderItems={orderItems} date={this.props.date} />); break;
            case 'delivery_tags': this.props.printDocument(
                <DeliveryTagsDisplay orders={this.state.orders} date={this.props.date} />
                ); break;
        }
    }

    public render() {
        if (this.state.showLoading)
            return( <LoadingOverlay /> );

        return(
            <div className={'row browser_window_tools mb-2'}>
                <div className={'col-12 browser_window_tools__inner'}>
                    <div className={'row'}>
                        <div className={'col-12'}>{this.props.dto.window.name}</div>
                        <div className={'col-6 mt-2'}>Deliveries: {this.props.dto.order_count}</div>
                        <div className={'col-6 mt-2'}>Dishes: {this.props.dto.dish_count}</div>
                        <div className={'col-12'}><hr/></div>
                        <div className={'d-none d-md-block col-md-12 browser_window_tools__controls mt-2'}>
                                <button className={'btn-block btn-outline-success'} onClick={() => this.print('prep')}
                                disabled={this.state.orders.length === 0}>print prep list</button>
                                <button className={'btn-block btn-outline-success'} onClick={() => this.print('delivery_tags')}
                                disabled={this.state.orders.length === 0}>print delivery tags</button>
                                <button className={'btn-block btn-outline-success'} onClick={this.downloadDeliverySpreadsheet}
                                disabled={this.state.orders.length === 0}>download delivery spreadsheet</button>

                        </div>
                        <div className={'col-12 mt-2'}>
                            <button
                                className={'btn-block btn-info'}
                                onClick={() =>
                                    this.props.history.push(
                                        {pathname: `/dashboard/mail/mass_mailer/upcoming_delivery/${momentHelper.asDateSlug(this.props.date)}`})}
                            disabled={this.state.orders.length === 0}>send mail</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(BrowserWindowTools);

interface DeliveryTagsDisplayProps {
    orders: Order[],
    date: Date
}

export const DeliveryTagsDisplay = (props: DeliveryTagsDisplayProps): React.ReactElement => {
    const target_date: string = momentHelper.asDateSlug(props.date);
    return (
        <div className='delivery_tags'>
            {
                props.orders.map((order: Order) => {
                    const orderItems: OrderItem[] = order.items.filter((orderItem: OrderItem) => orderItem.cart_item.delivery_date === target_date)

                    return (
                        <div className='quarter_print_page' key={`order_${order.id}`}>
                            <span className="contact-info">{order.contact_name}</span>
                            <span className="street-address">{order.street_address} {order.unit}</span>
                            <span className="street-address">{order.city} {order.zip}</span>
                            <span className="contact-info">{order.phone_number}</span>
                            <b>Items:</b>
                            <div className="delivery-tag-items">
                                {
                                    orderItems.map((orderItem: OrderItem) => {
                                        return(
                                            <div className="delivery-tag-item" key={`oi_${orderItem.id}`}>
                                                {orderItem.cart_item.quantity.toString() + " " + helpers.extractCartItemDescription(orderItem.cart_item)}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {order.notes &&
                                <div className="delivery-instructions">
                                    <br/>
                                    _______________________________
                                    <h4>Delivery Instructions:</h4>
                                    <div className="delivery_instructions_text">
                                        {order.notes}
                                    </div>
                                </div>
                            }
                        </div>
                    )
                    })
            }
        </div>
    )
}

interface PrepDisplayProps {
    orderItems: OrderItem[],
    date: Date
}

export const PrepDisplay = (props: PrepDisplayProps): React.ReactElement => {

    type CondensedListItems = {count: number, dish: string, protein: string, spicy_text:string};

    const spicy: string[] = ['No', 'mild', 'spicy'];
    let condensedList: {[key: string]: CondensedListItems} = {};
    let key: string = "";
    let dish: string = "";
    let protein: string = "";
    let spicy_text: string = "";
    let dishCount: number = 0;

    props.orderItems.forEach((orderItem: OrderItem) => {
        dish = orderItem.cart_item.menu_item.name;
        protein = (orderItem.cart_item.menu_item.proteins.split(':').length > 1 && orderItem.cart_item.protein !== "") ?
                    orderItem.cart_item.protein : "";
        spicy_text = (orderItem.cart_item.menu_item.spicy) ? spicy[orderItem.cart_item.spicy] : "";

        key = `${dish}:${protein}:${spicy_text}`;
        if (!(key in condensedList))
            condensedList[key] = {count: 0, dish, protein, spicy_text};

        condensedList[key].count += orderItem.cart_item.quantity;
        dishCount += orderItem.cart_item.quantity;
    });

    return (
        <div className={'prep_list'}>
            <span className='prep_list__header'>{momentHelper.asDateSlug(props.date)} &nbsp;&nbsp;:&nbsp;&nbsp;{dishCount} items</span>
            <table className='prep_list__list'>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Dish</td>
                        <td>Protein</td>
                        <td>Spicy</td>
                        <td>L</td>
                        <td>P</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(condensedList).sort().map((key: string, index: number) => {
                            return (
                                <tr className={`${index % 2 ? '' : 'print-row-dark'}`} key={key}>
                                    <td>{condensedList[key].count}</td>
                                    <td>{condensedList[key].dish}</td>
                                    <td>{condensedList[key].protein}</td>
                                    <td>{condensedList[key].spicy_text}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}