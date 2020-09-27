import React, {Fragment} from 'react';
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import {RouteOrganizerEntry} from "./RouteOrganizerEntry";
import RouteStop from "../../models/RouteStopModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import routeService from '../../services/RouteService';
import MomentHelper from "../../helpers/MomentHelper";

interface Props {
    route: Route,
    updateRoute: (route: Route) => void
}

interface State {
    mode: string,
    route: Route,
    routeUpdated: boolean,
    loading: boolean,
    stops: RouteStop[]
}

export default class RouteOrganizer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            mode: 'plan',
            route: props.route,
            routeUpdated: false,
            loading: true,
            stops: props.route.stops.sort((a,b) => (a.current_index > b.current_index) ? 1 : ((b.current_index > a.current_index) ? -1 : 0))
        }
    }

    private commitRoute = (callback: any = undefined): void => {
        if (!window.confirm('Once you commit a route, it cannot be changed.')){
            if (callback) callback();
            return;
        }

        routeService.commitRoute(this.state.route)
            .then((route: Route) => this.setState({route, stops: route.stops}))
            .catch(() => window.alert('cannot commit route'))
            .then(() => {
                if (callback) callback();
            })
    }

    private completeRoute = (callback: any = undefined): void => {
        if (!window.confirm('Are you sure you are done?')) {
            if (callback) callback();
            return;
        }

        routeService.completeRoute(this.state.route)
            .then((route: Route) => this.setState({route}))
            .catch(() => window.alert('unable to complete route'))
            .then(() => {
                if (callback) callback();
            })
    }

    private moveEntry = (stop: RouteStop, direction: string) => {
        let currentNdx: number = -1;
        this.state.stops.forEach((e: RouteStop, index: number) => {
            if (e.id === stop.id) currentNdx = index;
        })

        let stops: RouteStop[] = this.state.stops;
        stops.splice(currentNdx, 1); // remove

        // add
        switch(direction) {
            case 'up': currentNdx --; break;
            case 'down': currentNdx ++; break;
            case 'top': currentNdx = 0; break;
            case 'bottom': currentNdx = stops.length; break;
        }
        stops.splice(currentNdx, 0, stop)

        for (let x: number = 0; x < stops.length; x ++)
            stop.current_index = x

        this.setState({stops, routeUpdated: true});
    }

    private optimize = (callback: any = undefined): void => {
        this.setState({
            stops: this.state.stops.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))
        }, () => this.saveChanges(callback))
    }

    private saveChanges = (callback: any = undefined): void => {
        routeService.updateStopOrder(this.state.route, this.state.stops.map((stop: RouteStop) => stop.id))
            .then((route: Route) => this.props.updateRoute(route))
            .catch(() => window.alert('unable to save changes'))
            .then(() => {
                if (callback) callback();
            })
    }

    private startRoute = (callback: any = undefined): void => {
        if (!window.confirm('Are you sure you want to start the route?')) {
            if (callback) callback();
            return;
        };

        routeService.startRoute(this.state.route)
            .then((route: Route) => this.setState({route}))
            .catch(() => window.alert('unable to start route'))
            .then(() => {
                if (callback) callback();
            })
    }

    public render() {
        const routeStatus: string[] = ['uncommitted', 'committed', 'in progress', 'completed', 'waiting for cutoff'];
        let needToSave: boolean = false;
        let canOptimize: boolean = false;
        this.state.stops.forEach((stop: RouteStop, index: number) => {
            if (index !== stop.current_index) needToSave = true;
            if (stop.index !== stop.current_index) canOptimize = true;
        })

        return (
            <div className='row route_organizer'>
                <div className='col-12 route_organizer__status mb-2'>
                    status:
                    <span className={`route_organizer__status--${this.state.route.route_status} ml-2`}>
                        {routeStatus[this.state.route.route_status]}
                    </span>
                </div>
                {this.state.route.route_status === 3 &&
                    <Fragment>
                        <div className='col-12'>started: {MomentHelper.asFullDateTime(this.state.route.started_at)}</div>
                        <div className='col-12'>completed: {MomentHelper.asFullDateTime(this.state.route.finished_at)}</div>
                    </Fragment>

                }
                <div className='col-12'>
                    {this.state.route.route_status === 0 && //uncommitted
                        <Fragment>
                            {needToSave &&
                                <LoadingIconButton
                                    outerClass='mr-2'
                                    btnClass={'btn btn-outline-success route_organizer__optimize_btn'}
                                    label={'save changes'}
                                    onClick={this.saveChanges} />
                            }
                            {(!needToSave) &&
                                <LoadingIconButton
                                    outerClass='mr-2'
                                    btnClass='btn btn-outline-success'
                                    label={'commit route'}
                                    onClick={this.commitRoute} />
                            }
                            {canOptimize &&
                                <LoadingIconButton
                                    outerClass='mr-2'
                                    btnClass='btn btn-outline-info'
                                    label={'optimize'}
                                    onClick={this.optimize} />
                            }
                        </Fragment>
                    }
                    {this.state.route.route_status === 1 &&  //committed
                        <Fragment>
                            <LoadingIconButton
                                    outerClass='mr-2'
                                    btnClass='btn btn-outline-info'
                                    label={'start route'}
                                    onClick={this.startRoute} />
                        </Fragment>
                    }
                    {this.state.route.route_status === 2 &&  //in progress
                        <Fragment>
                            <LoadingIconButton
                                    outerClass='mr-2'
                                    btnClass='btn btn-outline-success'
                                    label={'completed'}
                                    onClick={this.completeRoute} />
                        </Fragment>
                    }
                </div>
                <div className='col-12 route_organizer__stops mt-2'>
                    <div className='row'>
                        {
                            this.state.stops.map((stop: RouteStop, index: number) =>
                                <div className='col-12'key={`route_${Math.random()}`}>
                                    <RouteOrganizerEntry
                                        stop={stop}
                                        route={this.state.route}
                                        moveStop={this.moveEntry}
                                        canMoveDown={index + 1  < this.state.stops.length}
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