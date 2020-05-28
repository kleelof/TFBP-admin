import React from 'react';

import weekService from '../../../services/WeekService';
import WeekDTO from '../../../dto/WeekDTO';

import './week.css';
import { Redirect } from 'react-router-dom';

interface IState {
    loaded: boolean,
    weeks: WeekDTO[],
    newWeekDate: string,
    creatingWeek: boolean,
    editWeekId: number
}

export default class Weeks extends React.Component<any, IState> {

    constructor(props: any){
        super(props);

        this.state = {
            loaded: false,
            weeks: [],
            newWeekDate: "",
            creatingWeek: false,
            editWeekId: 0
        }
    }

    public componentDidMount = (): void => {
        weekService.get<WeekDTO[]>()
            .then((weeks: WeekDTO[]) => this.setState({weeks, loaded: true}))
            .catch( err => window.alert("Unable to load weeks"))
    }

    public createWeek = (): void => {
        this.setState({creatingWeek: true})
        weekService.add<WeekDTO>(new WeekDTO(this.state.newWeekDate))
            .then((week: WeekDTO) => {
                this.setState({weeks: [week, ...this.state.weeks], newWeekDate: "", creatingWeek: false})
            }) 
            .catch( err => window.alert("Unable to create week"))
    }

    private updateDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({newWeekDate: e.target.value});
    }

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div> 

        if (this.state.editWeekId !== 0)
            return <Redirect to={`week/edit/${this.state.editWeekId}`} />
        
        const weeks: WeekDTO[] = this.state.weeks;
        weeks.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));

        return(
            <div className="row weeks">
                <div className="col-12">
                    <h5>Add A Week:</h5>
                    <input
                        type="date"
                        value={this.state.newWeekDate}
                        disabled={this.state.creatingWeek}
                        onChange={this.updateDate} />
                    <button 
                        className="btn btn-success ml-2"
                        onClick={this.createWeek}
                        disabled={this.state.creatingWeek}
                        >Add</button> 
                    <hr/>
                </div>
                {
                    weeks.map((week: WeekDTO) => {
                        return(
                            <div 
                                className="col-12 week-listing"
                                key={`week_${week.id}`}
                                onClick={()=> this.setState({editWeekId: week.id})}>
                                    {week.date}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}