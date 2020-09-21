import React, {ChangeEvent} from 'react';
import Route from "../../models/RouteModel";

import './delivery_planner.scss';
import {RouteOrganizerEntry} from "./RouteOrganizerEntry";

interface Props {
    routeEntries: Route[],
    optimize: () => void,
    reorderAndRecalculate: (ndxs: number[]) => void
}

interface State {
    mode: string,
    routeEntries: Route[],
    routeUpdated: boolean
}

export default class RouteOrganizer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);


        this.state = {
            mode: 'plan',
            routeEntries: props.routeEntries,
            routeUpdated: false
        }
    }

    private changeMode = (mode: string): void => {
        this.setState({mode});
    }

    private moveEntry = (entry: Route, direction: string) => {
        let currentNdx: number = -1;
        this.state.routeEntries.forEach((e: Route, index: number) => {
            if (e.id === entry.id) currentNdx = index;
        })

        let entries: Route[] = this.state.routeEntries;
        entries.splice(currentNdx, 1); // remove

        // add
        switch(direction) {
            case 'up': currentNdx --; break;
            case 'down': currentNdx ++; break;
            case 'top': currentNdx = 0; break;
            case 'bottom': currentNdx = entries.length; break;
        }
        entries.splice(currentNdx, 0, entry)

        this.setState({routeEntries: entries, routeUpdated: true});
    }

    private reorderAndRecalculate = (): void => {
        this.props.reorderAndRecalculate(this.state.routeEntries.map((entry: Route) => entry.id))
    }

    public render() {
        return (
            <div className='row route_organizer'>
                <div className='col-12'>
                    {this.state.mode === 'plan' &&
                        <button
                            className='btn btn-outline-info btn-sm route_organizer__optimize_btn mr-2'
                            onClick={this.props.optimize}
                        >optimize</button>
                    }
                    {(this.state.routeUpdated && this.state.mode === 'plan') &&
                        <button
                            className='btn btn-sm btn-outline-danger'
                            onClick={this.reorderAndRecalculate}
                        >recalculate</button>
                    }
                    <select className='route_organizer__mode_select' value={this.state.mode}
                            onChange={(e:ChangeEvent<HTMLSelectElement>) => this.changeMode(e.target.value)}>
                        <option value={'plan'}>planning mode</option>
                        <option value={'delivery'}>delivery mode</option>
                    </select>
                </div>
                {
                    this.state.routeEntries.map((entry: Route, index: number) =>
                        <div className='col-12'key={`route_${Math.random()}`}>
                            <RouteOrganizerEntry
                                routeEntry={entry}
                                mode={this.state.mode}
                                moveEntry={this.moveEntry}
                                canMoveDown={index + 1  < this.state.routeEntries.length}
                                canMoveUp={index > 0}
                            />
                        </div>
                    )
                }
            </div>
        )
    }
}