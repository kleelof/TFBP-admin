import React from 'react';

import cover from '../../assets/cover.png';
import mailingListService from '../../services/MailingListService';

import './frontPage.css';
import MailingListDTO from '../../dto/MailingListDTO';

interface IState {
    emailAddress: string,
    savingEmail: boolean,
    emailSaved: boolean
}

export default class FrontPage extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            emailAddress: "",
            savingEmail: false,
            emailSaved: false
        }
    }

    private saveEmailAddress = (): void => {
        this.setState({savingEmail: true});

        mailingListService.add(new MailingListDTO(this.state.emailAddress))
            .then( resp => this.setState({savingEmail: false, emailSaved: true}))
            .catch( resp => {
                window.alert("That email address is already registered");
                this.setState({savingEmail: false})
            })
    }

    public render() {
        return(
            <div className="row">
                <div className="col-12" id='cover'>
                    <img src={cover} alt="cover" />
                </div>
                <div className="col-12">
                    <h1>Welcome to Thai Food By Pla!</h1>
                    <p>
                        Our website is not completed yet. It should be ready within a few days.
                    </p>
                </div>
                {
                    !this.state.emailSaved ?
                        <div className="col-8">
                            <p>
                                Please sign up for our mailing list below and we will let you know as soon as the site is ready!
                            </p>
                            <input 
                                type="email"
                                value={this.state.emailAddress}
                                placeholder="Enter your email address"
                                disabled={this.state.savingEmail}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({emailAddress: e.target.value})}
                                className="form-control"/>
                            <button
                                className="btn btn-success mt-2"
                                onClick={this.saveEmailAddress}
                                disabled={this.state.savingEmail}>

                                    Join Pla's Mailing List
                                    </button>
                        </div>
                        :
                        <div className="col-6">
                            Thank you for joining our mailing list. We will contact you as soon as the website is ready!
                        </div>
                }
                
            </div>
        )
    }
}