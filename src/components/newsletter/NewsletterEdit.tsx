import React from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";

import newsletterService from '../../services/NewsletterService';

import Newsletter from "../../models/Newsletter";
import { Link } from 'react-router-dom';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";

interface State {
    loading: boolean,
    saving: boolean,
    releasing: boolean,
    title: string,
    content: string,
    newsletter: Newsletter,
    email: string,
    sendingEmail: boolean
}

export default class NewsletterEdit extends React.Component<any, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            saving: false,
            releasing: false,
            title: '',
            content: '',
            newsletter: new Newsletter(),
            email: '',
            sendingEmail: false
        }
    }

    public componentDidMount() {
        const { match: { params } } = this.props;

        newsletterService.get<Newsletter>(params.id)
            .then((newsLetter: Newsletter) =>
                this.setState({
                    newsletter: newsLetter,
                    title: newsLetter.title,
                    content: newsLetter.content,
                    loading: false
                })
            )
            .catch( err => window.alert('unable to load newsletter'))
    }

    private release = (): void => { //TODO: add testing
        this.setState({releasing: true});
        newsletterService.release(this.state.newsletter.id)
            .then((resp: any) => {
                if(resp.count === 0) {
                    window.alert('no emails found');
                    return;
                } else {
                    if(!window.confirm(`You are about to send ${resp.count} emails.\n\nContinue?`)) {
                        this.setState({releasing: false});
                        return;
                    }
                    newsletterService.release(this.state.newsletter.id, true)
                        .then((resp: any) => {
                            window.alert(`${resp.count} emails sent`);
                            const newsletter: Newsletter = this.state.newsletter;
                            newsletter.release_date = 'a';
                            this.setState({newsletter});
                        })
                        .catch( err => window.alert('unable to release newsletter'))
                        .then(() => this.setState({releasing: false}))
                }
            })
            .catch( err => window.alert('unable to release newsletter'))
    }

    private saveNewsletter = (): void => {
        this.setState({saving: true});

        const newsletter: Newsletter = this.state.newsletter;
        newsletter.title = this.state.title;
        newsletter.content = this.state.content;
        newsletterService.update<Newsletter>(newsletter.id, newsletter)
            .then((nl: Newsletter) => {
                this.setState({
                    newsletter: nl,
                    title: nl.title,
                    content: nl.content,
                    saving: false
                })
            })
            .catch( err => window.alert('unable to update newsletter'))
    }

    private sendTestEmail = (): void => {
        if (this.state.email === '') {
            window.alert('Enter an email address');
            return;
        }
        this.setState({sendingEmail: true});
        newsletterService.sendEmailSample(this.state.newsletter.id, this.state.email)
            .then((resp: any) => window.alert('sample mail sent'))
            .catch( err => window.alert('unable to send sample'))
            .finally(() => this.setState({sendingEmail: false}))
    }

    public render() {
        if (this.state.loading)
            return <LoadingOverlay />

        const saveDisabled: boolean = (this.state.title === this.state.newsletter.title &&
                                            this.state.content === this.state.newsletter.content) ||
                                                this.state.saving || this.state.releasing

        const titlePresent: boolean = this.state.content.indexOf('newsletter__email_title') !== -1
        const contentPresent: boolean = this.state.content.indexOf('newsletter__email_content') !== -1

        return (
            <div className={'row newsletter_edit justify-content-center'}>
                <div className={'col-12 col-md-5'}>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <h3>edit newsletter</h3>
                            <hr/>
                        </div>
                        <div className={'col-12 basic_form__label'}>
                            title: <br/>
                            <input
                                value={this.state.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({title: e.target.value})}
                                className={'form-control newsletter_edit__title_input'}
                                disabled={this.state.saving}
                                />
                        </div>
                        <div className={'col-12 newsletter_edit__content basic_form__label mt-2'}>
                            content:
                            <textarea
                                className={'form-control newsletter_edit__content_input'}
                                value={this.state.content}
                                rows={10}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    this.setState({content: e.target.value})}
                                disabled={this.state.saving}
                                />
                            ({this.state.content.length} characters)
                            <LoadingIconButton
                                label='save'
                                onClick={this.saveNewsletter}
                                busy={this.state.saving}
                                btnClass='btn btn-sm btn-outline-success'
                                outerClass='newsletter_edit__control_btn newsletter_edit__save_btn mt-2'
                                disabled={saveDisabled}
                                />
                            {(this.state.newsletter.release_date === null && !(!saveDisabled || !titlePresent || !contentPresent)) &&
                                <LoadingIconButton
                                    label='release'
                                    onClick={this.release}
                                    busy={this.state.releasing}
                                    btnClass='btn btn-sm btn-outline-warning'
                                    outerClass='newsletter_edit__control_btn mt-2 mr-2'
                                    />
                            }
                        </div>
                        <div className={'col-12'}>
                            { !titlePresent &&
                                <div className={'newsletter_edit__error'}>
                                    missing 'newsletter__email_title' class
                                </div>
                            }
                            { !contentPresent &&
                                <div className={'newsletter_edit__error'}>
                                    missing 'newsletter__email_content' class
                                </div>
                            }
                            { !saveDisabled &&
                                <div className={'newsletter_edit__error'}>
                                    save updates
                                </div>
                            }
                        </div>
                        <div className={'col-12 newsletter_edit_controls mt-3'}>
                            <div className={'row'}>
                                <div className={'col-12'}>
                                    <h5>test email</h5>
                                    <input
                                        className={'form-control newsletter_edit_controls__email_input'}
                                        placeholder={'enter email address'}
                                        type={'email'}
                                        value={this.state.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({email: e.target.value})}
                                        disabled={!saveDisabled || this.state.sendingEmail}
                                           />
                                    <LoadingIconButton
                                        label='send email test'
                                        onClick={this.sendTestEmail}
                                        busy={this.state.sendingEmail}
                                        disabled={!saveDisabled || this.state.sendingEmail}
                                        btnClass='btn btn-sm btn-outline-success'
                                        outerClass='mt-2 newsletter_edit_controls__email_btn'
                                        />

                                    <Link
                                        className={'btn btn-sm btn-outline-info newsletter_edit__control_btn mt-2 mr-2'}
                                        to={'/dashboard/newsletter'}
                                        >return to newsletters</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}