import React from 'react';
import LoadingOverlay from "../overlays/LoadingOverlay";

import newsletterService from '../../services/NewsletterService';
import Newsletter from "../../models/Newsletter";

interface State {
    loading: boolean,
    saving: boolean,
    title: string,
    content: string,
    newsLetter: Newsletter
}

export default class NewsletterEdit extends React.Component<any, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            saving: false,
            title: '',
            content: '',
            newsLetter: new Newsletter()
        }
    }

    public componentDidMount() {
        const { match: { params } } = this.props;

        newsletterService.get<Newsletter>(params.id)
            .then((newsLetter: Newsletter) =>
                this.setState({
                    newsLetter,
                    title: newsLetter.title,
                    content: newsLetter.content,
                    loading: false
                })
            )
            .catch( err => window.alert('unable to load newsletter'))
    }

    private saveNewsletter = (): void => {
        this.setState({saving: true});

        const newsletter: Newsletter = this.state.newsLetter;
        newsletter.title = this.state.title;
        newsletter.content = this.state.content;
        newsletterService.update<Newsletter>(newsletter.id, newsletter)
            .then((nl: Newsletter) => {
                this.setState({
                    newsLetter: nl,
                    title: nl.title,
                    content: nl.content,
                    saving: false
                })
            })
            .catch( err => window.alert('unable to update newsletter'))
    }

    public render() {
        if (this.state.loading)
            return <LoadingOverlay />

        const saveDisabled: boolean = (this.state.title === this.state.newsLetter.title &&
                                            this.state.content === this.state.newsLetter.content) ||
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
                        className={'form-control'}
                        value={this.state.content}
                        rows={10}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        this.setState({content: e.target.value})}
                        disabled={this.state.saving}
                        ></textarea>
                </div>
                <div className={'col-12 newsletter_edit_controls mt-3'}>
                    <div className={'row'}>
                        <div className={'col-6'}>
                            <button
                                className={'btn btn-success newsletter_edit_controls__save_btn'}
                                disabled={saveDisabled}
                                onClick={this.saveNewsletter}
                                >save</button>
                        </div>
                        <div className={'col-6'}>
                            <button
                                className={'btn btn-outline-success newsletter_edit_controls__email_btn'}
                                disabled={!saveDisabled}
                                >Send Email Test</button>
                            <input
                                className={'form-control mt-3 newsletter_edit_controls__email_input'}
                                placeholder={'enter email address'}
                                type={'email'}
                                disabled={!saveDisabled}
                                   />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}