import React from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import mailTemplateService from '../../services/MailTemplateService';
import MailTemplate from "../../models/MailTemplate";


interface Props {
    templateSlug: string
}

interface State {
    loading: boolean,
    updating: boolean
}

export default class MailTemplateComponent extends React.Component<Props, State> {

    state = {
        loading: true,
        updating: false
    }

    public componentDidMount() {
        mailTemplateService.get<MailTemplate[]>()
            .then(() => {

            })
            .catch(() => window.alert('unable to load templates'))
            .then(() => this.setState({loading: false}))
    }

    public render() {
        if(this.state.loading)
            return <LoadingOverlay />

        return(
            <div className={'row mail_template'}>
                <div className={'col-12'}>
                    {this.props.templateSlug}
                </div>
            </div>
        )
    }
}