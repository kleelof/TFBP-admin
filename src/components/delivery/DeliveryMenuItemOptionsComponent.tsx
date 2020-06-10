import React from 'react';
import deliveryDayItemService from '../../services/DeliveryDayItemService';
import DeliveryDayItem, { DeliveryDayItemDTO } from '../../models/DeliveryDayItemModel';

interface IProps {
    deliveryDayItem: DeliveryDayItem
}

interface IState {
    deliveryDayItem: DeliveryDayItem,
    saving: boolean,
    active: boolean
}

export default class DeliveryMenuItemOptions extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            deliveryDayItem: props.deliveryDayItem,
            saving: false,
            active: props.deliveryDayItem.id ? true : false 
        }
    }

    private activate = (): void => {
        this.setState({saving: true});
        let deliveryDayItem: DeliveryDayItem = this.state.deliveryDayItem;
        deliveryDayItem.price = deliveryDayItem.menu_item.price;
        deliveryDayItemService.add<any>(this.state.deliveryDayItem.getDTO())
            .then((dto: DeliveryDayItem) => {this.setState({
                deliveryDayItem: dto as any,
                saving: false,
                active: true
            })})
            .catch( resp => window.alert("Unable to activate"));
    }

    private deactivate = (): void => {
        if (!window.confirm("Are you sure you want to deactivate this menu item?")) return;

        this.setState({saving: true});
        deliveryDayItemService.delete(this.state.deliveryDayItem.id)
            .then( resp => this.setState({
                deliveryDayItem: new DeliveryDayItem(this.state.deliveryDayItem.delivery_day, this.state.deliveryDayItem.menu_item, false, 0),
                active: false,
                saving: false
            }))
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
            <div className="week-options row">
                <div className="col-12"><hr/></div>
                <div className="col-6">
                    {
                        this.state.active ?
                            <button
                                className="btn btn-danger"
                                disabled={this.state.saving}
                                onClick={this.deactivate}>
                                Deactivate</button>
                            :
                            <button
                                className="btn btn-success"
                                disabled={this.state.saving}
                                onClick={this.activate}>
                                Activate</button>
                    } 
                </div>
                <div className="col-6 week-options-panel">
                    <input
                        type="number"
                        id="price"
                        value={this.state.deliveryDayItem.price}
                        onChange={this.updateData}
                        disabled={this.state.saving || !this.state.active}
                        className="form-control"/>
                </div>
                <div className=" col-6 week-options-panel mt-3">
                    <span className="week-options-panel-text">Sold Out:&nbsp;&nbsp;</span>
                    <input
                        id="sold_out"
                        checked={this.state.deliveryDayItem.sold_out} 
                        onChange={this.updateData}
                        disabled={this.state.saving || !this.state.active}
                        type="checkbox"/> 
                </div>
                <div className="col-12 text-center mt-3">
                    <button 
                        className="btn btn-success"
                        disabled={this.state.saving || !this.state.active} 
                        onClick={this.save}
                        >Save</button>
                </div>
            </div>
        )
    }
}