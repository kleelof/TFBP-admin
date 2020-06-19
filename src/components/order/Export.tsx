import React, { Fragment } from 'react';

import orderItemService from '../../services/OrderItemService';
import orderService from '../../services/OrderService';
import OrderItem from '../../models/OrderItemModel';

import './order.scss';
import Order from '../../models/OrderModel';

interface IState {
    pullDate: string,
    orderItems: OrderItem[],
    pullType: string,
    orders: Order[]
}

export default class Export extends React.Component<any, IState> {

    state = {
        pullDate: "2020-06-16",
        orderItems: [],
        pullType: "route",
        orders: []
    }
    

    public componentDidMount = (): void => {
        /*
        orderItemService.getByDate('2020-06-16')
            .then((prepListItems: OrderItem[]) => {
                if (prepListItems.length === 0) {
                    window.alert('There are not prep items for this day');
                    return;
                }
                //this.setState({prepListItems})
            })
            .catch( err => window.alert('Unable to display prep list'));
            */
    }

    private loadData = (): void => {
        if (this.state.pullType === 'prep') {
            this.loadOrderItems();
        } else {
            this.loadOrders();
        }
    }

    private loadOrderItems = (): void => {
        orderItemService.getByDate<OrderItem[]>(this.state.pullDate)
            .then((orderItems: OrderItem[]) => {
                if (orderItems.length === 0) {
                    window.alert('There are not items for this day');
                    return;
                }
                this.setState({orderItems}, ()=> window.print())
            })
            .catch( err => window.alert('Unable to display'));
    }

    private loadOrders = (): void => {
        orderService.getByDate<Order[]>(this.state.pullDate)
            .then((orders: Order[]) => {
                if (orders.length === 0) {
                    window.alert('There are not items for this day');
                    return;
                }

                if (this.state.pullType === 'route') {
                    let fileContent: string = "Address line 1\tAddress line 2\tCity\tState\tZip\tName\tEmail Address\tPhone Number\tExternal ID\tOrder Count\tDriver\n";
                    let orderItems: OrderItem[] = [];

                    orders.forEach((order: Order) => {
                        orderItems = order.items.filter((orderItem: OrderItem) => orderItem.cart_item.delivery_date === this.state.pullDate);
                        if (orderItems.length > 0) {
                            fileContent += `${order.street_address}\t${order.unit}\t${order.city}\tCA\t${order.zip}\t${order.contact_name}\t${order.email}\t${order.phone_number}\t${order.id}\t${orderItems.length}\tLee\n`;
                        }
                    })
                    
                    var bb = new Blob([fileContent ], { type: 'text/plain' });
                    var a = document.createElement('a');
                    a.download = `delivery_route_${this.state.pullDate}.tsv`;
                    a.href = window.URL.createObjectURL(bb);
                    a.click();
                } else {
                    this.setState({orders},()=> window.print())
                }
            })
            .catch( err => window.alert('Unable to display'));
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<IState, keyof IState>);
    }

    public render() {

        return(
            <div className="row">
                <div className="col-12 col-md-6 export-panel">
                    <select id="pullType" className="control-form" onChange={this.updateData} defaultValue={this.state.pullType}>
                        <option value="prep">Prep List</option>
                        <option value="delivery_tags">Delivery Tags</option>
                        <option value="route">Route CSV</option>
                    </select>
                    <br/><br/>
                    Select a date: 
                    <input type="date" id="pullDate" className="form-control"
                            value={this.state.pullDate} onChange={this.updateData}/>
                    <button className="btn btn-success mt-2" onClick={this.loadData}>Print</button>
                </div>
                {(this.state.orderItems.length + this.state.orders.length > 0) &&
                    <div className="col-12 print-sheet">
                        {
                            this.state.pullType === 'prep' ?
                                <PrepDisplay orderItems={this.state.orderItems} date={this.state.pullDate} />
                                :
                                <DeliveryTagsDisplay orders={this.state.orders} date={this.state.pullDate} />
                                    
                        }
                    </div>
                }
            </div>
        )
    }
}

function DeliveryTagsDisplay(props: any) {
    const spicy: string[] = ['Not Spicy', 'Mild', 'Spicy'];

    return (
        <div className='delivery-tags-print'>
            {
                props.orders.map((order: Order) => {
                    const orderItems: OrderItem[] = order.items.filter((orderItem: OrderItem) => orderItem.cart_item.delivery_date === props.date)
                    
                    return (
                        <Fragment key={`order_${order.id}`}>
                            <div className='quarter-page'>
                                <span className="contact-info">{order.contact_name}</span>
                                <span className="street-address">{order.street_address} {order.unit}</span>
                                <span className="street-address">{order.city} {order.zip}</span>
                                <span className="contact-info">{order.phone_number}</span>
                                <b>Items:</b>
                                <div className="delivery-tag-items">
                                    {
                                        orderItems.map((orderItem: OrderItem) => {
                                            let item: string = orderItem.cart_item.quantity.toString() + " " + orderItem.cart_item.menu_item.name;
                                            if (orderItem.cart_item.protein !== "" && orderItem.cart_item.menu_item.proteins.split(':').length > 2) item += ` with ${orderItem.cart_item.protein}`
                                            if (orderItem.cart_item.menu_item.spicy) item += `, ${spicy[orderItem.cart_item.spicy]}`
                                            return(
                                                <div className="delivery-tag-item" key={`oi_${orderItem.id}`}> 
                                                    {item}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Fragment>
                    )
                    })
            }
        </div>
    )
}

function PrepDisplay(props: any) {

    type CondenensedListItem = {count: number, dish: string, protein: string, spicy_text:string};

    const spicy: string[] = ['No', 'mild', 'spicy'];
    let condensedList: {[key: string]: CondenensedListItem} = {};
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
        <Fragment>
            <span className='print-sheet-header'>{props.date} &nbsp;&nbsp;:&nbsp;&nbsp;{dishCount} items</span>
            <table className='prep-sheet'> 
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Dish</td>
                        <td>Protein</td>
                        <td>Spicy</td>
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
                                </tr> 
                            )
                        })
                    }
                </tbody>
            </table>
        </Fragment>
    )
}