import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import authService from '../../services/AuthService';

interface IProps {
    userIsLoggedIn: boolean
}

interface IState {
    loggedOut: boolean
}

export default class Navigation extends React.Component<IProps, IState> {

    constructor(props: IProps){
        super(props);

        this.state = {
            loggedOut: false
        }
    }

    private logout = (): void => {
        authService.logout();
        this.setState({loggedOut: true});
    }

    public render() {
        if (this.state.loggedOut)
            return <Redirect to="/login" />

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/admin/menu">
                                Menu</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/weeks">
                                Weeks</Link>
                        </li>
                    </ul>
                </div>
                <span className="navbar-text">
                    <div 
                        className="btn btn-success"
                        onClick={this.logout}
                        >Logout</div>
                </span> 
            </nav>
        )
    }
}