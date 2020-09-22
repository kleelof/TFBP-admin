import React, {ChangeEvent} from 'react';
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import {RouteOrganizerEntry} from "./RouteOrganizerEntry";
import RouteStop from "../../models/RouteStopModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";

interface Props {
    route: Route,
    optimize: (callback: () => {}) => void,
    reorderAndRecalculate: (ndxs: number[], callback: any) => void
}

interface State {
    mode: string,
    route: Route,
    routeUpdated: boolean
}

export default class RouteOrganizer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            mode: 'plan',
            route: {...props.route, stops: props.route.stops.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))},
            routeUpdated: false
        }
    }

    private changeMode = (mode: string): void => {
        this.setState({mode});
    }

    private moveEntry = (stop: RouteStop, direction: string) => {
        let currentNdx: number = -1;
        this.state.route.stops.forEach((e: RouteStop, index: number) => {
            if (e.id === stop.id) currentNdx = index;
        })

        let stops: RouteStop[] = this.state.route.stops;
        stops.splice(currentNdx, 1); // remove

        // add
        switch(direction) {
            case 'up': currentNdx --; break;
            case 'down': currentNdx ++; break;
            case 'top': currentNdx = 0; break;
            case 'bottom': currentNdx = stops.length; break;
        }
        stops.splice(currentNdx, 0, stop)

        this.setState({route: {...this.state.route, stops}, routeUpdated: true});
    }

    private reorderAndRecalculate = (callback: any): void => {
        this.props.reorderAndRecalculate(this.state.route.stops.map((stop: RouteStop) => stop.id), callback);
    }

    public render() {
        return (
            <div className='row route_organizer'>
                <div className='col-12'>
                    {(this.state.mode === 'plan' && !this.state.route.optimized) &&
                        <LoadingIconButton
                            btnClass={'btn btn-outline-info btn-sm route_organizer__optimize_btn'}
                            label={'optimize'}
                            onClick={this.props.optimize} />
                    }
                    {(this.state.routeUpdated && this.state.mode === 'plan') &&
                        <div className=''>
                            <LoadingIconButton
                                btnClass='btn btn-sm btn-outline-danger'
                                label={'recalculate'}
                                onClick={this.reorderAndRecalculate} />
                        </div>
                    }
                    <select className='route_organizer__mode_select' value={this.state.mode}
                            onChange={(e:ChangeEvent<HTMLSelectElement>) => this.changeMode(e.target.value)}>
                        <option value={'plan'}>planning mode</option>
                        <option value={'delivery'}>delivery mode</option>
                    </select>
                </div>
                <div className='col-12 route_organizer__stops mt-2'>
                    <div className='row'>
                        {
                            this.state.route.stops.map((stop: RouteStop, index: number) =>
                                <div className='col-12'key={`route_${Math.random()}`}>
                                    <RouteOrganizerEntry
                                        stop={stop}
                                        mode={this.state.mode}
                                        moveStop={this.moveEntry}
                                        canMoveDown={index + 1  < this.state.route.stops.length}
                                        canMoveUp={index > 0}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}