import React from 'react';
import MailingListDTO from '../../../dto/MailingListDTO';
import mailingListService from '../../../services/AdminMailingListService';

interface IState {
    mailingList: MailingListDTO[],
    loaded: boolean
}

export default class MailingList extends React.Component<any, IState> {

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

    public render() {
        if (!this.state.loaded)
            return <div>Loading...</div>

        return(
            <div className="row">
                <div className="col-12">
                    {
                        this.state.mailingList.map((dto: MailingListDTO) => 
                            <h3>{dto.email}</h3>)
                    }
                </div>
            </div>
        )
    }
}