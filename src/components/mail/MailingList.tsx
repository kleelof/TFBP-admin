import React from 'react';
import MailingListDTO from '../../dto/MailingListDTO';
import mailingListService from '../../services/MailingListService';

interface State {
    mailingList: MailingListDTO[],
    loaded: boolean
}
 
export default class MailingList extends React.Component<any, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            mailingList: [],
            loaded: false
        }
    }

    public componentDidMount = (): void => { 
        mailingListService.get<MailingListDTO[]>()
            .then((mailingList: MailingListDTO[]) => this.setState({mailingList, loaded: true}))
    }

    private toggleActive = (dto: MailingListDTO): void => {
        dto.active = !dto.active;
        mailingListService.update<MailingListDTO>(dto.id, dto)
            .then(() => this.forceUpdate())
            .catch( err => window.alert('unable to update email address'))
    }

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div>

        return(
            <div className="row">
                <div className="col-12">
                    <table className={'table'}>
                        <thead>
                            <tr>
                                <th>zip</th>
                                <th></th>
                                <th>email address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.mailingList.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0)).map((dto: MailingListDTO) =>
                                    <tr>
                                        <td>{dto.code}</td>
                                        <td>
                                            {
                                                dto.active ?
                                                    <button
                                                        className={'btn btn-outline-danger'}
                                                        onClick={() => this.toggleActive(dto)}
                                                        >deactivate</button>
                                                    :
                                                    <button
                                                        className={'btn btn-outline-success'}
                                                        onClick={() => this.toggleActive(dto)}
                                                        >activate</button>
                                            }
                                        </td>
                                        <td>{dto.email}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}