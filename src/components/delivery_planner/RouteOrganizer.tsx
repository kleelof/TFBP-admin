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
    stops: RouteStop[],
    loadingButtonInUse: string
}

export default class RouteOrganizer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            mode: 'plan',
            route: props.route,
            routeUpdated: false,
            loading: true,
            stops: this.extractStopsFromRoute(props.route),
            loadingButtonInUse: ''
        }
    }

    private commitRoute = (): void => {
        if (!window.confirm('Once you commit a route, it cannot be changed.')) return;

        this.setState({loadingButtonInUse: 'committing'});

        routeService.commitRoute(this.state.route)
            .then((route: Route) => this.setState({route, stops: this.extractStopsFromRoute(route)}))
            .catch(() => window.alert('cannot commit route'))
            .then(() => this.setState({loadingButtonInUse: ''}))
    }

    private completeRoute = (): void => {
        if (!window.confirm('Are you sure you are done?')) return;

        this.setState({loadingButtonInUse: 'completing_route'})
        routeService.completeRoute(this.state.route)
            .then((route: Route) => this.setState({route, stops: this.extractStopsFromRoute(route)}))
            .catch(() => window.alert('unable to complete route'))
            .then(() => this.setState({loadingButtonInUse: ''}))
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
            stops[x].current_index = x

        this.setState({stops, routeUpdated: true});
    }

    private optimize = (): void => {
        this.setState({
            loadingButtonInUse: 'optimizing',
            stops: this.state.stops.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))
        }, () => this.saveChanges())
    }

    private saveChanges = (): void => {
        routeService.updateStopOrder(this.state.route, this.state.stops.map((stop: RouteStop) => stop.id))
            .then((route: Route) => this.props.updateRoute(route))
            .catch(() => window.alert('unable to save changes'))
            .then(() => this.setState({loadingButtonInUse: ''}))
    }

    private extractStopsFromRoute = (route: Route): RouteStop[] => {
        return route.stops.sort((a,b) => (a.current_index > b.current_index) ? 1 : ((b.current_index > a.current_index) ? -1 : 0))
    }

    private startRoute = (): void => {
        if (!window.confirm('Are you sure you want to start the route?')) return;

        this.setState({loadingButtonInUse: 'starting_route'})
        routeService.startRoute(this.state.route)
            .then((route: Route) => this.setState({route}))
            .catch(() => window.alert('unable to start route'))
            .then(() => this.setState({loadingButtonInUse: ''}))
    }

    public render() {
        const routeStatus: string[] = ['uncommitted', 'committed', 'in progress', 'completed', 'waiting for cutoff'];
        let canOptimize: boolean = false;
        this.state.stops.forEach((stop: RouteStop, index: number) => {
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
                {this.state.route.route_status === 3 && //completed
                    <Fragment>
                        <div className='col-12'>started: {MomentHelper.asShortDateTime(this.state.route.started_at)}</div>
                        <div className='col-12'>completed: {MomentHelper.asShortDateTime(this.state.route.finished_at)}</div>
                    </Fragment>
                }
                <div className='col-12'>
                    {this.state.route.route_status === 0 && //uncommitted
                        <Fragment>
                            {this.state.routeUpdated &&
                                <LoadingIconButton
                                    outerClass='mr-2'
                                    busy={this.state.loadingButtonInUse ==='saving_changes'}
                                    btnClass={'btn btn-outline-success route_organizer__optimize_btn'}
                                    label={'save changes'}
                                    onClick={() => {
                                        this.setState({loadingButtonInUse: 'saving_changes'});
                                        this.saveChanges();
                                    }} />
                            }
                            {(!this.state.routeUpdated) &&
                                <LoadingIconButton
                                    outerClass='mr-2'
                                    busy={this.state.loadingButtonInUse ==='committing'}
                                    btnClass='btn btn-outline-success'
                                    label={'commit route'}
                                    onClick={this.commitRoute} />
                            }
                            {canOptimize &&
                                <LoadingIconButton
                                    outerClass='mr-2'
                                    busy={this.state.loadingButtonInUse ==='at_stop'}
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
                                    busy={this.state.loadingButtonInUse ==='starting_route'}
                                    btnClass='btn btn-outline-info'
                                    label={'start route'}
                                    onClick={this.startRoute} />
                        </Fragment>
                    }
                    {this.state.route.route_status === 2 &&  //in progress
                        <Fragment>
                            <LoadingIconButton
                                    outerClass='mr-2'
                                    busy={this.state.loadingButtonInUse ==='completing_route'}
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