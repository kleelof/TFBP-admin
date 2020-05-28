import React from 'react';

import './authentication.css';
import authService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';

interface IState {
    username: string,
    password: string,
    loggingIn: boolean,
    loggedIn: boolean
}

export default class Login extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            username: "",
            password: "",
            loggingIn: false,
            loggedIn: false
        }
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<IState, keyof IState>);
    }

    private login = (): void => {
        if (this.state.username === "" || this.state.password === "") return;

        authService.authenticate(this.state.username, this.state.password)
            .then( err => {this.setState({loggedIn: true})})
            .catch((err: any) => {
                console.log(err);
                window.alert("Invalid Credentials");
            });
    }

    public render() {
        if (this.state.loggedIn)
            return <Redirect to="/admin/menu" />

        return(
            <div className="row justify-content-center" id="login-panel">
                <div className="class-12 class-md-6">
                    <div className="wrapper fadeInDown">
                        <div id="formContent">
                            <div className="fadeIn first">
                                <h5>Welcome to the Operator Dashboard!</h5>
                            </div>

                            <form>
                                <input
                                    type="text"
                                    className="fadeIn second"
                                    id="username"
                                    placeholder="username"
                                    value={this.state.username}
                                    onChange={this.updateData}
                                    />
                                <input
                                    type="password" 
                                    className="fadeIn third"
                                    id="password"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={this.updateData}
                                    />
                                <input 
                                    type="button"
                                    className="fadeIn fourth"
                                    value="Log In"
                                    onClick={this.login}
                                    />
                            </form>

                            <div id="formFooter">
                                <a className="underlineHover" href="/">Forgot Password?</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}