import React from 'react';
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import {RouteOrganizerEntry} from "./RouteOrganizerEntry";

interface Props {
    route: Route[],
    optimize: () => void
}

export default class RouteOrganizer extends React.Component<Props, any> {

    public render() {
        return (
            <div className='row route_organizer'>
                {
                    this.props.route.map((entry: Route, index: number) =>
                        <div className='col-12 col-md-6'>
                            <RouteOrganizerEntry routeEntry={entry} />
                        </div>
                    )
                }
                <div className='col-12'>
                    <button className='btn btn-outline-info' onClick={this.props.optimize}>optimize</button>
                </div>
            </div>
        )
    }
}