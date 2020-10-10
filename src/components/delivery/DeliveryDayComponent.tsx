/*
    Mange MenuItems in DelliveryDay
 */
import React from 'react';

import {MenuItemDTO} from '../../models/MenuItemModel';
import DeliveryDay from '../../models/DeliveryDayModel';
import MenuItem from '../../models/MenuItemModel';
import menuItemService from '../../services/MenuItemService';
import deliveryDayItemService from '../../services/DeliveryDayItemService';
import deliveryDayService from '../../services/DeliveryDayService';
import momentHelper from '../../helpers/MomentHelper';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import SearchWidget from '../widgets/searchWidget/SearchWidget';
import DeliveryDayItem, { DeliveryDayItemDTO } from '../../models/DeliveryDayItemModel';
import { DeliveryDayItemComponent } from './DeliveryDayItemComponent';
import './delivery.scss';
import { Link } from 'react-router-dom';
import {RouteComponentProps} from 'react-router-dom';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {EmailWidget} from "../widgets/email_widget/EmailWidget";

interface Props extends RouteComponentProps {
    match: any;
}

interface State {
    loading: boolean,   //TODO: FINISH ADDING LOAD ALL MENU ITEMS, have MenuItems confirm if 
    menuItems: MenuItemDTO[],
    deliveryDay: DeliveryDay,
    deliveryWindows: DeliveryWindow[],
    deleting: boolean,
    sendEmail: boolean
}

export default class DeliveryDayComponent extends React.Component<Props, State> {

    state ={
        loading: true,
        menuItems: [],
        deliveryDay: new DeliveryDay(""),
        deliveryWindows: [],
        deleting: false,
        sendEmail: false
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;
        this.refreshDay(params.id);
    }

    private delete = (): void => {
        if (!window.confirm('are you sure you want to delete this delivery menu?')) return;

        this.setState({deleting: true});
        deliveryDayService.delete(this.state.deliveryDay.id)
            .then(() => this.props.history.push({pathname: '/dashboard/deliveries'}))
            .catch(() => window.alert('unable to delete'))
            .then(() => this.setState({deleting: false}))
    }

    private itemSelected = (item: MenuItem) => {
        deliveryDayItemService.add(new DeliveryDayItemDTO(this.state.deliveryDay.id, item.id, false, item.price))
            .then((item: any) => {
                const deliveryDay: DeliveryDay = this.state.deliveryDay;
                deliveryDay.day_items.unshift(item);
                this.setState({deliveryDay});
                console.log(deliveryDay);
            })
            .catch( err => window.alert('unable to add menu item'))
    }

    private refreshDay = (id: number): void => {
        deliveryDayService.get<DeliveryDay>(id)
            .then((deliveryDay: DeliveryDay) => {
                this.setState({deliveryDay, loading: false})
            })
            .catch( err => window.alert("Unable to load week"))
    }
    
    public render() {
        if (this.state.loading)
            return <div>Loading...</div>

        return(
            <div className="row delivery_day_component">
                <div className='col-12 delivery_day_component__header'>
                    <h3>delivery menu</h3>
                    <div className='delivery_day_component__date'>{momentHelper.asFullDate(this.state.deliveryDay.date)} -&nbsp;</div>
                    <div className='delivery_day_component__date'>{momentHelper.asFullDate(this.state.deliveryDay.end_date)}</div>
                    <div className='clear_both'></div>
                    <hr/>
                </div>
                <div className={"col-12 mb-2"}>
                    <Link className={'btn btn-sm btn-outline-info'} to={'/dashboard/deliveries'}>go back</Link>
                    <button
                        className='btn btn-sm btn-outline-primary float-right ml-2'
                        >send email</button>
                    <LoadingIconButton
                        label='delete'
                        onClick={this.delete}
                        busy={this.state.deleting}
                        btnClass='btn btn-sm btn-outline-danger'
                        outerClass='float-right'
                        />
                    <hr/>
                </div>
                <div className="col-12 delivery_day_component__search_widget mb-2">
                    <SearchWidget service={menuItemService} itemSelected={this.itemSelected} />
                </div>
                {
                    this.state.deliveryDay.day_items.map((item: DeliveryDayItem) => {
                        return (
                            <div className="col-12 col-md-3" key={`dd_${item.id}`}>
                                <div className="row">
                                    <div className="col-12">
                                        <DeliveryDayItemComponent item={item} refreshItems={() => this.refreshDay(this.state.deliveryDay.id)}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {this.state.sendEmail &&
                    <div className='col-12 delivery_window_edit__emailer'>
                        <div className='row justify-content-center'>
                            <div className='col-12 col-md-6'>
                                <EmailWidget
                                    finished={() => this.setState({sendEmail: false})}
                                    prompt={'this email will be sent to all customers who have ordered from this delivery menu'}
                                    config={{
                                        email_type: 'delivery_day',
                                        entity_id: this.state.deliveryDay.id
                                    }}
                                    />
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}