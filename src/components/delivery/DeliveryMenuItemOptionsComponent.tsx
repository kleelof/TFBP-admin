import React from 'react';
import deliveryDayItemService from '../../services/DeliveryDayItemService';
import DeliveryDayItem, { DeliveryDayItemDTO } from '../../models/DeliveryDayItemModel';

import './delivery.scss';

interface Props {
    deliveryDayItem: DeliveryDayItem,
    refreshItems: () => {}
}

interface State {
    deliveryDayItem: DeliveryDayItem,
    saving: boolean,
    active: boolean
}

export default class DeliveryMenuItemOptions extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            deliveryDayItem: props.deliveryDayItem,
            saving: false,
            active: props.deliveryDayItem.id ? true : false 
        }
    }

    private remove = (): void => {
        if (!window.confirm("Are you sure you want to remove this menu item?")) return;

        this.setState({saving: true});
        deliveryDayItemService.delete(this.state.deliveryDayItem.id)
            .then( resp => this.setState({
                deliveryDayItem: new DeliveryDayItem(this.state.deliveryDayItem.delivery_day, this.state.deliveryDayItem.menu_item, false, 0),
                active: false,
                saving: false
            }, () => this.props.refreshItems()))
            .catch( resp => window.alert("Unable to deactivate"));
    }

    private save = (): void => {
        this.setState({saving: true});
        deliveryDayItemService.update<DeliveryDayItem>(this.state.deliveryDayItem.id, this.state.deliveryDayItem)
            .then((item: DeliveryDayItem) => this.setState({deliveryDayItem: item, saving: false}))
            .catch( resp => window.alert("Unable to update"))
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let deliveryDayItem: DeliveryDayItem = this.state.deliveryDayItem
        switch (e.target.id) {
            case 'active': this.setState({active: !this.state.active}); break;
            case 'sold_out': deliveryDayItem.sold_out = !deliveryDayItem.sold_out; break;
            case 'price': deliveryDayItem.price = parseFloat(e.target.value)
        }
        this.setState({deliveryDayItem});
    }

    public render() {
        return(
            <div className="row delivery_item_options">
                <div className="col-12"><hr/></div>
                <div className="col-4">
                    <input
                        type="number"
                        id="price"
                        value={this.state.deliveryDayItem.price}
                        onChange={this.updateData}
                        disabled={this.state.saving || !this.state.active}
                        className="form-control delivery_item_options__price"/>
                </div>
                <div className=" col-8 mt-3">
                    <span className="mr-2">Sold Out:</span>
                    <input
                        id="sold_out"
                        checked={this.state.deliveryDayItem.sold_out} 
                        onChange={this.updateData}
                        disabled={this.state.saving || !this.state.active}
                        type="checkbox"/> 
                </div>
                <div className="col-12 text-center mt-3">
                    <button 
                        className="btn btn-sm btn-outline-success"
                        disabled={this.state.saving || !this.state.active} 
                        onClick={this.save}
                        >Save</button>

                    <button
                        className="btn btn-sm btn-danger ml-3"
                        disabled={this.state.saving}
                        onClick={this.remove}>
                        Remove</button>
                </div>
            </div>
        )
    }
}