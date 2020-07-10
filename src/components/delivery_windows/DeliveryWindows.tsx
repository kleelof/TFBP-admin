import React from 'react';
import DeliveryDay from '../../models/DeliveryDayModel';
import DeliveryWindow from '../../models/DeliveryWindowModel';
import deliveryDayService from '../../services/DeliveryDayService';

import './delivery_windows.scss';

interface IProps {
    deliveryDay: DeliveryDay,
    deliveryWindows: DeliveryWindow[]
}

interface IState {
    selectedDeliveryWindows: DeliveryWindow[],
    availableDeliveryWindows: DeliveryWindow[]
}

export default class DeliveryWindows extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        let selectedDeliveryWindows: DeliveryWindow[] = [];
        let availableDeliveryWindows: DeliveryWindow[] = [];

        // divide delivery windows into selected and available
        props.deliveryWindows.forEach((deliveryWindow: DeliveryWindow) => {
            if (props.deliveryDay.delivery_windows.indexOf(deliveryWindow.id) > -1) {
                selectedDeliveryWindows.push(deliveryWindow);
            } else
                availableDeliveryWindows.push(deliveryWindow);
        })

        this.state = {
            selectedDeliveryWindows,
            availableDeliveryWindows
        }

    }

    private deliveryWindowSelected = (deliveryWindow: DeliveryWindow): void => {
        let availableDeliveryWindows: DeliveryWindow[] = this.state.availableDeliveryWindows;
        let selectedDeliveryWindows: DeliveryWindow[] = this.state.selectedDeliveryWindows;

        if (this.state.availableDeliveryWindows.indexOf(deliveryWindow) > -1) {
            availableDeliveryWindows = availableDeliveryWindows.filter((window: DeliveryWindow) => 
                window.id !== deliveryWindow.id)
            selectedDeliveryWindows.push(deliveryWindow);
            deliveryDayService.attachDeliveryWindow(this.props.deliveryDay, deliveryWindow);
        } else {
            selectedDeliveryWindows = selectedDeliveryWindows.filter((window: DeliveryWindow) => 
                window.id !== deliveryWindow.id)
            availableDeliveryWindows.push(deliveryWindow);
            deliveryDayService.detachDeliveryWindow(this.props.deliveryDay, deliveryWindow);
        } 

        this.setState({availableDeliveryWindows, selectedDeliveryWindows});
    }

    public componentDidMount = (): void => {

    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    Selected Windows:
                    <DeliveryWindowSelector deliveryWindows={this.state.selectedDeliveryWindows} windowSelected={this.deliveryWindowSelected} />
                </div>
                <div className="col-12">
                    Available Windows:
                    <DeliveryWindowSelector deliveryWindows={this.state.availableDeliveryWindows} windowSelected={this.deliveryWindowSelected} />
                </div>
            </div>
        )
    }
}

const DeliveryWindowSelector = (props: {deliveryWindows: DeliveryWindow[],
                                    windowSelected: (deliveryWindow: DeliveryWindow) => void}) => {
    return(
        <div className="row delivery-window-selector">
            <div className="col-12">
                {
                    props.deliveryWindows.map((deliveryWindow: DeliveryWindow) =>
                        <DeliveryWindowContainer
                            deliveryWindow={deliveryWindow}
                            key={deliveryWindow.id}
                            windowSelected={props.windowSelected}/>
                    )
                }
            </div>
        </div>
    )
    
}

const DeliveryWindowContainer = (props: {deliveryWindow: DeliveryWindow, windowSelected: (deliveryWindow: DeliveryWindow) => void}): any => {
    return (
        <div className="delivery-window-container" onDoubleClick={()=>{props.windowSelected(props.deliveryWindow)}}>
            {props.deliveryWindow.name}
        </div>
    )
}