import React, {ChangeEvent} from 'react';
import MailingListModel from '../../models/MailingListModel';
import mailingListService from '../../services/MailingListService';
import {MailingListEntry} from "./MailingListEntry";

interface State {
    mailingList: MailingListModel[],
    loaded: boolean,
    newCode: string,
    newEmail: string,
}
 
export default class MailingList extends React.Component<any, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            mailingList: [],
            loaded: false,
            newCode: '',
            newEmail: ''
        }
    }

    private addNewEntry = (): void => {
        mailingListService.add<MailingListModel>(new MailingListModel(this.state.newEmail, this.state.newCode, true))
            .then((entry: MailingListModel) => this.setState({
                ...this.state,
                mailingList: [...this.state.mailingList, entry],
                newCode: '',
                newEmail: ''
            }))
            .catch( err => window.alert('unable to add email \n\n this email address may already exist'))
    }

    public componentDidMount = (): void => { 
        mailingListService.get<MailingListModel[]>()
            .then((mailingList: MailingListModel[]) => this.setState({mailingList, loaded: true}))
    }

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div>

        return(
            <div className="row mailing_list">
                <div className={'col-12'}>
                    <h3>mailing list</h3>
                    <hr/>
                </div>
                <div className={'col-12 mb-2'}>
                    <h5>add email address</h5>
                    <div className={'row'}>
                        <div className={'col-12 col-md-3'}>
                            <input type={'text'} placeholder={'zip'} value={this.state.newCode}
                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                       this.setState({...this.state, newCode: e.target.value.toString()})}
                            />
                        </div>
                        <div className={'col-12 col-md-3'}>
                            <input type={'email'} placeholder={'email'} value={this.state.newEmail}
                                   onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                       this.setState({...this.state, newEmail: e.target.value.toString()})}
                            />
                        </div>
                        <div className={'col-12 col-md-3'}>
                            <button className={'btn btn-outline-success'} onClick={this.addNewEntry}>add</button>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <table className={'table'}>
                        <thead>
                            <tr>
                                <th className={'mailing_list__zip_header'}>zip</th>
                                <th>email</th>
                                <th>active</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.mailingList.sort(
                                    (a,b) =>
                                        (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0)).map((dto: MailingListModel) =>
                                        <MailingListEntry dto={dto} key={dto.email}/>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}