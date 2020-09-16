import React from 'react';
import newsletterService from '../../services/NewsletterService';
import {withRouter} from 'react-router';

import './newsletter.scss';
import Newsletter from "../../models/Newsletter";

interface State {
    title: string,
    creating: boolean
}

class NewsletterAdd extends React.Component<any, State> {

    state = {
        title: '',
        creating: false
    }

    public render() {

        const createNewsletter = (): void => {
            this.setState({creating: true});
            newsletterService.add<Newsletter>(new Newsletter(-1, this.state.title, ''))
                .then((newsLetter: Newsletter) =>
                    this.props.history.push({pathname: `/dashboard/newsletter/edit/${newsLetter.id}`}))
                .catch( err => {console.log(err);
                    window.alert('unable to create newsletter')
                })
        }

        return(
            <div className={'row newsletter_add'}>
                <div className={'col-12'}>
                    <h5>create newsletter</h5>
                    <input
                        placeholder={'title'}
                        value={this.state.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            this.setState(({title: e.target.value}))}
                        />
                    <button
                        className={'btn btn-success ml-2'}
                        disabled={this.state.title === '' || this.state.creating}
                        onClick={createNewsletter}
                        >create</button>
                </div>
            </div>
        )
    }
}

export default withRouter(NewsletterAdd);