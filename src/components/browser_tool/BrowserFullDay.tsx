import React from 'react';
import deliveryWindowService from '../../services/DeliveryWindowService';
import {DeliveryWindowWithCountsDTO} from "../../models/DeliveryWindowModel";
import {RouteComponentProps} from 'react-router-dom';
import helpers from "../../helpers/helpers";
import LoadingOverlay from "../overlays/LoadingOverlay";
import BrowserWindowTools, {PrepDisplay} from "./BrowserWindowTools";

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

        deliveryWindowService.listWithCounts(new Date(params.targetDate))
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
            <div className={'row'}>
                <div className={'col-12'}>{helpers.formatDate(helpers.dateToShortISO(this.state.targetDate))}</div>
                {
                    this.state.counts.map((dto:DeliveryWindowWithCountsDTO) =>
                        <div className={'col-12 col-md-4 mt-2'}>
                            <BrowserWindowTools dto={dto} date={this.state.targetDate} printDocument={this.printDocument} />
                        </div>
                    )
                }
                <div className="col-12 print-sheet">
                    {this.state.documentToPrint}
                </div>
            </div>
        )
    }
}