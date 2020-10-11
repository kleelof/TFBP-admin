import React, {ChangeEvent} from 'react';
import MailingListModel from '../../models/MailingListModel';
import mailingListService from '../../services/MailingListService';
import {MailingListEntry} from "./MailingListEntry";
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import LoadingOverlay from "../overlays/LoadingOverlay";
import InputWidget from "../widgets/inputWidget/InputWidget";
import {PageSelector} from "../widgets/page_selector/PageSelector";

interface State {
    mailingList: MailingListModel[],
    loading: boolean,
    newCode: string,
    newEmail: string,
    currentPage: number,
    paginationCount: number
}
 
export default class MailingList extends React.Component<any, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            mailingList: [],
            loading: true,
            newCode: '',
            newEmail: '',
            currentPage: 0,
            paginationCount: 0
        }
    }

    private addNewEntry = (): void => {
        mailingListService.add<MailingListModel>(new MailingListModel(-1, this.state.newEmail, this.state.newCode, true))
            .then((entry: MailingListModel) => this.setState({
                ...this.state,
                mailingList: [...this.state.mailingList, entry],
                newCode: '',
                newEmail: ''
            }))
            .catch( err => window.alert('unable to add email \n\n this email address may already exist'))
    }

    public componentDidMount = (): void => { 
        this.changePage(1);
    }

    private changePage = (pageNumber: number, searchPattern?: string): void => {
        this.setState({loading: true, currentPage: pageNumber});

        mailingListService.pagedSearchResults(pageNumber, searchPattern)
            .then((dto: PagedResultsDTO) => {
                this.setState({
                    mailingList: dto.results as MailingListModel[],
                    loading: false,
                    paginationCount: dto.count
                })
            })
    }

    public render() {
        return(
            <div className="row mailing_list">
                <div className={'col-12'}>
                    <h3>mailing list</h3>
                    <hr/>
                </div>
                <div className='col-12'>
                    <InputWidget
                        id='search_widget'
                        type='text'
                        onUpdate={(id: string, searchPattern: string) => this.changePage(this.state.currentPage, searchPattern)}
                    />
                    <PageSelector
                        numItems={this.state.paginationCount}
                        currentPage={this.state.currentPage}
                        gotoPage={this.changePage}
                        />
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
                    {this.state.loading &&
                        <LoadingOverlay />
                    }
                    {!this.state.loading &&
                        <table className={'table'}>
                            <thead>
                                <tr>
                                    <th className={'mailing_list__zip_header d-none d-md-table-cell'}>zip</th>
                                    <th>email</th>
                                    <th>active</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {
                                this.state.mailingList.length === 0 ?
                                    <div>no results found</div>
                                    :
                                    <tbody>
                                        {
                                            this.state.mailingList.sort(
                                                (a,b) =>
                                                    (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0)).map((dto: MailingListModel) =>
                                                    <MailingListEntry dto={dto} key={dto.email}/>
                                            )
                                        }
                                    </tbody>
                            }
                        </table>
                    }
                </div>
            </div>
        )
    }
}