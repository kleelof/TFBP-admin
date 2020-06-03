import React from 'react';
import WeekMenuItemDTO from '../../../dto/WeekMenuItemDTO';
import weekMenuItemService from '../../../services/WeekMenuItemService';
import WeekDTO from '../../../dto/WeekDTO';
import WeekMenuItemOutDTO from '../../../dto/WeekMenuItemOutDTO';

interface IProps {
    weekMenuItem: WeekMenuItemDTO
}

interface IState {
    weekMenuItem: WeekMenuItemDTO,
    saving: boolean,
    active: boolean 
}

export default class WeekMenuItemOptions extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            weekMenuItem: props.weekMenuItem,
            saving: false,
            active: props.weekMenuItem.id ? true : false 
        }
    }

    private activate = (): void => {
        this.setState({saving: true});
        weekMenuItemService.add<WeekMenuItemOutDTO>(this.state.weekMenuItem.getSubmitDTO())
            .then((dto: WeekMenuItemOutDTO) => {this.setState({weekMenuItem: dto as any, saving: false, active: true})})
            .catch( resp => window.alert("Unable to activate"));
    }

    private deactivate = (): void => {
        if (!window.confirm("Are you sure you want to deactivate this menu item?")) return;

        this.setState({saving: true});
        weekMenuItemService.delete(this.state.weekMenuItem.id)
            .then( resp => this.setState({
                weekMenuItem: new WeekMenuItemDTO(this.state.weekMenuItem.to_week, this.state.weekMenuItem.menu_item, false, "0", false),
                active: false,
                saving: false
            }))
            .catch( resp => window.alert("Unable to deactivate"));
    }

    private save = (): void => {
        this.setState({saving: true});
        console.log(this.state.weekMenuItem);
        weekMenuItemService.update<WeekMenuItemOutDTO>(this.state.weekMenuItem.id, this.state.weekMenuItem as any)
            .then((dto: WeekMenuItemOutDTO) => this.setState({weekMenuItem: dto as any, saving: false}))
            .catch( resp => window.alert("Unable to update"))
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let weekMenuItem: WeekMenuItemDTO = this.state.weekMenuItem
        switch (e.target.id) {
            case 'active': this.setState({active: !this.state.active}); break;
            case 'spicy': weekMenuItem.spicy = !weekMenuItem.spicy; break;
            case 'sold_out': weekMenuItem.sold_out = !weekMenuItem.sold_out; break;
            case 'price': weekMenuItem.price = e.target.value
        }
        this.setState({weekMenuItem});
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
                        value={this.state.weekMenuItem.price}
                        onChange={this.updateData}
                        disabled={this.state.saving || !this.state.active}
                        className="form-control"/>
                </div>
                <div className=" col-6 week-options-panel mt-3">
                    <span className="week-options-panel-text">Sold Out:&nbsp;&nbsp;</span>
                    <input
                        id="sold_out"
                        checked={this.state.weekMenuItem.sold_out} 
                        onChange={this.updateData}
                        disabled={this.state.saving || !this.state.active}
                        type="checkbox"/> 
                </div>
                <div className="col-6 mt-3">
                    <span className="week-options-panel-text">Spicy:&nbsp;&nbsp;</span>
                    <input
                        id="spicy"
                        checked={this.state.weekMenuItem.spicy}
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