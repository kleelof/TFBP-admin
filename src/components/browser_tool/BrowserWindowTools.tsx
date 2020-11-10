import React, {Fragment} from 'react';
import {DeliveryWindowWithCountsDTO} from "../../models/DeliveryWindowModel";
import OrderItem from "../../models/OrderItemModel";
import helpers from "../../helpers/helpers";
import Order from "../../models/OrderModel";
import deliveryWindowService from '../../services/DeliveryWindowService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import { RouteComponentProps, withRouter } from 'react-router-dom';

import './browser.scss';
import moment from "moment";
import {EmailWidget} from "../widgets/email_widget/EmailWidget";
import momentHelper from "../../helpers/MomentHelper";
import printHelper from '../../helpers/PrintHelper';

interface Props extends RouteComponentProps {
    dto: DeliveryWindowWithCountsDTO,
    date: Date,
    printDocument: (component: React.ReactElement) => void
}

interface State {
    showLoading: boolean,
    orders: Order[],
    sendingEmail: boolean
}

interface SpreadSheetColumn {
    title: string,
    slug: string
}

class BrowserWindowTools extends React.Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            showLoading: true,
            orders: [],
            sendingEmail: false
        }
    }

    public componentDidMount() {
        deliveryWindowService.retrieveOrders(this.props.dto.window.id, this.props.date)
            .then((orders: Order[]) => this.setState({orders, showLoading: false}))
            .catch( err => window.alert('unable to load data'))
    }


    private downloadDeliveryTags = (): void => {
        deliveryWindowService.generateDeliveryTags(this.props.dto.window.id, this.props.date)
            .then((pdf: any) => printHelper.download('delivery_tags.pdf', pdf))
            .catch(() => window.alert('unable to download prep board'))

        // this.print('delivery_tags');
    }

    private downloadOrdersSpreadsheet = (): void => {
        deliveryWindowService.generateOrdersTSV(this.props.dto.window.id, this.props.date)
            .then((tsv: string) => printHelper.download(`orders_${momentHelper.asDateSlug(this.props.date)}.tsv`, tsv))
            .catch(() => window.alert('unable to download prep board'))
    }

    private downloadPrepBoard = (): void => {
        deliveryWindowService.generateProductionBoard(this.props.dto.window.id, this.props.date)
            .then((pdf: any) => printHelper.download('prepboard.pdf', pdf))
            .catch(() => window.alert('unable to download prep board'))
    }

    private downloadShoppingList = (): void => {
        deliveryWindowService.generateShoppingList(this.props.dto.window.id, this.props.date)
            .then((pdf: any) => printHelper.download('shopping_list.pdf', pdf))
            .catch(() => window.alert('unable to download shopping list'))
    }

    private downloadOrderingSheet = (): void => {
        deliveryWindowService.generateOrderingSpreadsheet(this.props.dto.window.id, this.props.date)
            .then((pdf: any) => printHelper.download(`ordering_sheet_${momentHelper.asDateSlug(this.props.date)}.tsv`, pdf))
            .catch(() => window.alert('unable to download ordering sheet'))
    }

    private emailingComplete = (): void => {
        this.setState({sendingEmail: false})

    }

    private print = (pullType: string): void => {
        let orderItems: OrderItem[] = [];
        for (let x: number = 0; x < this.state.orders.length; x ++)
            for (let y: number = 0; y < this.state.orders[x].items.length; y ++)
                if (this.state.orders[x].items[y].cart_item.delivery_date === moment(this.props.date).utc().format('YYYY-MM-DD'))
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
                                <button className={'btn btn-sm btn-outline-success'} onClick={() => this.downloadPrepBoard()}
                                disabled={this.state.orders.length === 0}>print prep list</button>
                                <button className={'btn btn-sm btn-outline-success ml-2'} onClick={() => this.downloadDeliveryTags()}
                                disabled={this.state.orders.length === 0}>print delivery tags</button>
                        </div>
                        <div className='col-12 mt-2'>
                            <button className={'btn-btn btn-sm btn-outline-success'} onClick={() => this.downloadOrdersSpreadsheet()}
                                disabled={this.state.orders.length === 0}>download orders spreadsheet</button>
                            <button className={'btn-btn btn-sm btn-outline-success ml-2'} onClick={() => this.downloadOrderingSheet()}
                                disabled={this.state.orders.length === 0}>download Ordering Sheet</button>
                        </div>
                        <div className={'col-12 mt-2'}>
                            <button className={'btn btn-sm btn-outline-success'}
                                    onClick={() => this.props.history.push({
                                        pathname:`/dashboard/delivery_planner/${this.props.dto.window.id}/${moment(this.props.date).utc().format('YYYY-MM-DD')}`})}
                                    disabled={this.state.orders.length === 0}>
                                route planner</button>

                            <button
                                className={'btn btn-sm btn-info'}
                                onClick={() => this.setState({sendingEmail: true})}
                                disabled={this.state.orders.length === 0}>
                                send mail</button>
                        </div>
                    </div>

                    {this.state.sendingEmail &&
                        <div className='browser_window_tools__emailer'>
                            <EmailWidget
                                finished={this.emailingComplete}
                                prompt='send email to all deliveries'
                                config={{
                                    email_type: 'deliveries_email',
                                    entity_id: this.props.dto.window.id,
                                    target_date: momentHelper.asDateSlug(this.props.date, true)
                                }}
                            />
                        </div>
                    }
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
    const target_date: string = moment(props.date).utc().format('YYYY-MM-DD');
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
        protein = (orderItem.cart_item.protein !== "") ?
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
            <span className='prep_list__header'>{moment(props.date).utc().format('YYYY-MM-DD')} &nbsp;&nbsp;:&nbsp;&nbsp;{dishCount} items</span>
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