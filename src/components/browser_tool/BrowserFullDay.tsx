import React from 'react';
import momentHelper from '../../helpers/MomentHelper';
import deliveryWindowService from '../../services/DeliveryWindowService';
import {DeliveryWindowWithCountsDTO} from "../../models/DeliveryWindowModel";
import {RouteComponentProps} from 'react-router-dom';
import LoadingOverlay from "../overlays/LoadingOverlay";
import BrowserWindowTools, {PrepDisplay} from "./BrowserWindowTools";

import './browser.scss';

interface Props extends RouteComponentProps {
    match: any;
}

interface State {
    loading: boolean,
    targetDate: Date,
    counts: DeliveryWindowWithCountsDTO[],
    documentToPrint: any
}

export default class BrowserFullDay extends React.Component<Props, State> {

    state = {
        loading: true,
        targetDate: new Date(),
        counts: [],
        documentToPrint: null
    }

    public componentDidMount() {
        const { match: { params } } = this.props;

        deliveryWindowService.listWithCounts(params.targetDate)
            .then((counts: DeliveryWindowWithCountsDTO[]) => this.setState({counts, targetDate: new Date(new Date(params.targetDate).toUTCString())}))
            .catch( err => console)
            .then(() => this.setState({loading: false}))
    }

    private printDocument = (documentToPrint: any): void => {
        this.setState({documentToPrint}, () => window.print())
    }

    public render() {
        if (this.state.loading)
            return(<LoadingOverlay />)

        return(
            <div className={'row browser_full_day justify-content-center'}>
                <div className='col-12 text-center'>
                    <h5>
                        {momentHelper.asFullDate(this.state.targetDate)}
                    </h5>
                </div>
                <div className={'col-12 col-md-7'}>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <div className={'col-12 text-center'}>
                                <button
                                    className={'btn btn-outline-info mt-2'}
                                    onClick={() => this.props.history.goBack()}
                                    >return to calendar</button>

                                <button
                                    className={'btn btn-outline-primary ml-2 mt-2'}
                                    onClick={() => this.props.history.push({pathname: '/dashboard/delivery_window'})}
                                    >create delivery window</button>
                            </div>
                            <div className={'row mt-2 justify-content-center'}>
                                {this.state.counts.length > 0 &&
                                    this.state.counts.map((dto:DeliveryWindowWithCountsDTO) =>
                                        <div className={'col-12 col-md-6'} key={`dto_${dto.window.id}`}>
                                            <BrowserWindowTools
                                                dto={dto}
                                                date={this.state.targetDate}
                                                key={`dto_${dto.window.id}`}
                                                printDocument={this.printDocument} />
                                        </div>
                                    )
                                }
                                {this.state.counts.length === 0 &&
                                    <div className='col-12 text-center'>
                                        delivery windows define the days and times of day you will be delivering
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 print_sheet">
                    {this.state.documentToPrint}
                </div>
            </div>
        )
    }
}