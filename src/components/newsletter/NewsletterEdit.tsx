import React from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";

import newsletterService from '../../services/NewsletterService';

import Newsletter from "../../models/Newsletter";

interface State {
    loading: boolean,
    saving: boolean,
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
        let options: any = {
            mailing_list: true
        }

        newsletterService.release(this.state.newsletter.id)
            .then((resp: any) => {
                if(resp.count === 0) {
                    window.alert('no emails found');
                    return;
                } else {
                    if(!window.confirm(`You are about to send ${resp.count} emails.\n\nContinue?`)) return
                    newsletterService.release(this.state.newsletter.id, true)
                        .then((resp: any) => {
                            window.alert(`${resp.count} emails sent`);
                            const newsletter: Newsletter = this.state.newsletter;
                            newsletter.release_date = 'a';
                            this.setState({newsletter});
                        })
                        .catch( err => window.alert('unable to release newsletter'))
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
                                                this.state.saving
        return (
            <div className={'row newsletter_edit'}>
                <div className={'col-12 newsletter_edit__title'}>
                    title: <br/>
                    <input
                        value={this.state.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setState({title: e.target.value})}
                        className={'form-control newsletter_edit__title_input'}
                        disabled={this.state.saving}
                        />
                </div>
                <div className={'col-12 newsletter_edit__content'}>
                    content:
                    <textarea
                        className={'form-control newsletter_edit__content_input'}
                        value={this.state.content}
                        rows={10}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        this.setState({content: e.target.value})}
                        disabled={this.state.saving}
                        ></textarea>
                    ({this.state.content.length} characters)
                </div>
                <div className={'col-12 newsletter_edit_controls mt-3'}>
                    <div className={'row'}>
                        <div className={'col-12 col-md-6'}>
                            <button
                                className={'btn btn-success newsletter_edit_controls__save_btn'}
                                disabled={saveDisabled}
                                onClick={this.saveNewsletter}
                                >save</button>

                            {this.state.newsletter.release_date === null &&
                                <button
                                    className={'btn btn-outline-warning newsletter_edit_controls__release_btn ml-3'}
                                    disabled={!saveDisabled}
                                    onClick={this.release}
                                    >release</button>
                            }
                        </div>
                        <div className={'col-12 col-md-6'}>
                            {this.state.content.indexOf('newsletter__email_title') === -1 &&
                                <div className={'newsletter_edit__error'}>
                                    Missing 'newsletter__email_title' class
                                </div>
                            }
                            {this.state.content.indexOf('newsletter__email_content') === -1 &&
                                <div className={'newsletter_edit__error'}>
                                    Missing 'newsletter__email_content' class
                                </div>
                            }
                        </div>
                        <div className={'col-12'}>
                            <button
                                className={'btn btn-outline-success newsletter_edit_controls__email_btn'}
                                disabled={!saveDisabled || this.state.sendingEmail}
                                onClick={this.sendTestEmail}
                                >Send Email Test</button>
                            <input
                                className={'form-control mt-3 newsletter_edit_controls__email_input'}
                                placeholder={'enter email address'}
                                type={'email'}
                                value={this.state.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setState({email: e.target.value})}
                                disabled={!saveDisabled || this.state.sendingEmail}
                                   />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}