import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import './authentication.css';
import authService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';
import User from '../../models/User';
import AuthenticateDTO from '../../dto/AuthenticateDTO';
import { AppActions, AppState } from '../../store/store';
import { dispatchLogin } from '../../store/auth/authActions';
import { AuthState } from '../../store/auth/authReducer';

interface LinkStateProps {
    auth: AuthState
}

interface LinkDispatchProps {
    login: (user: User, operator_token: string) => void
}

type Props = LinkStateProps & LinkDispatchProps

interface State {
    email: string,
    password: string,
    loggingIn: boolean
}

class Login extends React.Component<Props, State> {

    state = {
        email: "",
        password: "",
        loggingIn: false
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
         }  as Pick<State, keyof State>);
    }

    private login = (): void => {
        if (this.state.email === "" || this.state.password === "") return;

        authService.authenticate(this.state.email, this.state.password)
            .then( (dto: AuthenticateDTO) => {
                console.log(dto);
                this.props.login(dto.user, dto.operator_token);
            })
            .catch((err: any) => {
                window.alert("Invalid Credentials");
            });
    }

    public render() {
        if (this.props.auth.loggedIn) 
            return <Redirect to="/dashboard/menu" />
        
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
                                    id="email"
                                    placeholder="email"
                                    value={this.state.email}
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

const mapStateToProps = (state: AppState): LinkStateProps => ({auth: state.authReducer})
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
    login: bindActionCreators(dispatchLogin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)