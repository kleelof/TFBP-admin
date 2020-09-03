import React from 'react';

import {months} from '../../constants';
import './browser_tools.scss';
import {BrowserDay} from "./BrowserDay";
import { RouteComponentProps } from 'react-router-dom';

interface State {
    month: number,
    year: number,
    viewDay: number
}

export default class BrowserTool extends React.Component<RouteComponentProps, State>{

    state = {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        viewDay: 0
    }

    private changeMonth = (add: number): void => {
        let month: number = this.state.month;
        let year: number = this.state.year;

        month += add;

        if (month > 11){
            month = 0;
            year ++;
        } else if (month < 0) {
            month = 11;
            year --;
        }

        this.setState({month, year});
    }

    public render(){
        const startDate: Date = new Date(this.state.year, this.state.month, 1);
        const daysInMonth: number = new Date(this.state.year, this.state.month + 1, 0).getDate();
        let dateNdx: number = -startDate.getDay() + 1;

        let weeks: any = []
        let week: any;
        while (dateNdx <= daysInMonth) {
            week = [];
            for (let x: number = 0; x < 7; x ++) {
                if (dateNdx >= 1 && dateNdx <= daysInMonth) {
                    week.push(<BrowserDay date={new Date(this.state.year, this.state.month, dateNdx)} />)
                } else {
                    week.push(<div></div>)
                }
                dateNdx ++;
            }
            weeks.push(week);
        }

        return(
            <div className={'row browser_tool'}>
                <div className={`col-12 browser_tool_calendar`}>
                    <div className='row justify-content-center'>
                        <div className={'col-12 col-md-8 browser_tool_calendar__month_nav'}>
                            <div
                                className={'month_nav__arrow month_nav__item'}
                                id={'month_nav__last_month'}
                                onClick={() => this.changeMonth(-1)}
                            >&lt;&lt;</div>
                            <div className={'month_nav__date month_nav__item'}>{months[this.state.month]}  {this.state.year}</div>
                            <div
                                className={'month_nav__arrow month_nav__item'}
                                id={'month_nav__next_month'}
                                onClick={() => this.changeMonth(1)}
                            >&gt;&gt;</div>
                        </div>
                        <div className={'col-12'}>
                            <table className={'table'}>
                                <thead>
                                    <tr>
                                        <th>Sun</th>
                                        <th>Mon</th>
                                        <th>Tue</th>
                                        <th>Wed</th>
                                        <th>Thu</th>
                                        <th>Fri</th>
                                        <th>Sat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    weeks.map((week: any) =>
                                        <tr>
                                            {
                                                week.map((day: any) =>
                                                    <td>{day}</td>
                                                )
                                            }
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}