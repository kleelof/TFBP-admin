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
            .then((counts: DeliveryWindowWithCountsDTO[]) => this.setState({counts, targetDate: new Date(params.targetDate)}))
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
                <div className={'col-12 col-md-7'}>
                    <div className={'col-12'}>
                        <div className={'col-12 row browser_full_day__date'}>
                            {momentHelper.asFullDate(this.state.targetDate)}
                        </div>
                        <div className={'col-12'}>
                            <div className={'row'}>
                                {
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
                            </div>
                        </div>
                        <div className={'col-12 text-center'}>
                            <button
                                className={'btn btn-outline-info'}
                                onClick={() => this.props.history.goBack()}
                                >return to calendar</button>
                        </div>
                    </div>
                </div>

                <div className="col-12 print-sheet">
                    {this.state.documentToPrint}
                </div>
            </div>
        )
    }
}