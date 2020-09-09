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
    text: string,
    originalText: string
}

export default class MailTemplateComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            updating: false,
            template: new MailTemplate(),
            text: '',
            originalText: ''
        }
    }

    public componentDidMount() {
        mailTemplateService.get_template_by_slug(this.props.templateSlug)
            .then((template: MailTemplate) => {
                this.setState({text: template.text, originalText: template.text, template, loading: false})
            })
            .catch(() => {})
            .then(() => this.setState({loading: false}))
    }

    public saveUpdates = (): void => {
        this.setState({updating: true});

        const template: MailTemplate = this.state.template;
        template.text = this.state.text;

        if (template.id < 0) {
            template.slug = this.props.templateSlug;
            template.options = '';
            mailTemplateService.add<MailTemplate>(template)
                .then(() => this.setState({originalText: this.state.text}))
                .catch( err => window.alert('unable to save'))
                .then(() => this.setState({updating: false}))
        } else {
            mailTemplateService.update<MailTemplate>(template.id, template)
                .then(() => this.setState({originalText: this.state.text}))
                .catch( err => window.alert('unable to update'))
                .then(() => this.setState({updating: false}))
        }
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
                    ({this.state.text.length} characters)
                </div>
                <div className={'col-12'}>
                    <button className={`btn btn-${this.state.updating || this.state.text === this.state.originalText ? 
                        'default' : 'success'}`}
                            onClick={() => this.saveUpdates()}
                            disabled={this.state.updating || this.state.text === this.state.originalText}
                            >Update</button>
                </div>
            </div>
        )
    }
}