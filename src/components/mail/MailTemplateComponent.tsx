import React from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";
import mailTemplateService from '../../services/MailTemplateService';
import MailTemplate from "../../models/MailTemplate";

import './mail.scss';

interface Props {
    templateSlug: string
}

interface State {
    loading: boolean,
    updating: boolean,
    template: MailTemplate,
    text: string
}

export default class MailTemplateComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            updating: false,
            template: new MailTemplate(),
            text: ''
        }
    }

    public componentDidMount() {
        mailTemplateService.get_template_by_slug(this.props.templateSlug)
            .then((template: MailTemplate) => {
                this.setState({text: template.text, template, loading: false})
            })
            .catch(() => window.alert('unable to load templates'))
            .then(() => this.setState({loading: false}))
    }

    public saveUpdates = (): void => {
        this.setState({updating: true});

        const template: MailTemplate = this.state.template;
        template.text = this.state.text;
        mailTemplateService.update<MailTemplate>(template.id, template)
            .catch( err => window.alert('unable to update'))
            .then(() => this.setState({updating: false}))
    }

    public render() {
        if(this.state.loading)
            return <LoadingOverlay />

        return(
            <div className={'row mail_template'}>
                <div className={'col-12'}>
                    <hr/>
                </div>
                <div className={'col-12'}>
                    {this.props.templateSlug.replace(/-/g, ' ')}
                </div>
                <div
                    className={'col-12 '}>
                    <textarea
                        className={'mail_template__body'}
                        value={this.state.text}
                        onChange={(e: any) => this.setState({text:e.target.value})}
                        disabled={this.state.updating}
                    ></textarea>
                </div>
                <div className={'col-12'}>
                    <button className={'btn btn-success'}
                            onClick={() => this.saveUpdates()}
                            disabled={this.state.updating}
                            >Update</button>
                </div>
            </div>
        )
    }
}