import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AuthState } from '../../store/auth/authReducer';
import { AppState, AppActions } from '../../store/store';
import { dispatchLogout } from '../../store/auth/authActions';

interface LinkStateProps {
    auth: AuthState
}

interface LinkDispatchProps {
    logout: () => void;
}

type Props = LinkStateProps & LinkDispatchProps

interface IState {
    doLogin: boolean
}

class Navigation extends React.Component<Props, IState> {

    state = {
        doLogin: false
    }

    private logout = (): void => {
        this.props.logout();
    }

    public render() {
        if (this.state.doLogin) return <Redirect to="/dashboard/login" />

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/dashboard/menu">
                                Menu</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard/deliveries">
                                Deliveries</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle" id="orderDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Orders
                            </button>
                            <div className="dropdown-menu" aria-labelledby="orderDropdown">
                                <Link className="dropdown-item" to='/dashboard/orders/export'>Printouts and Router</Link>
                                <Link className="dropdown-item" to='/dashboard/orders'>Manage Orders</Link>
                            </div> 
                        </li>
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle" id="emailDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Email
                            </button>
                            <div className="dropdown-menu" aria-labelledby="emailDropdown">
                                <Link className="dropdown-item" to='/dashboard/mailingList'>Mailing List</Link>
                                <Link className="dropdown-item" to='/dashboard/mailUtilities'>Mail Utilities</Link>
                            </div>
                        </li>
                    </ul>
                </div>
                <span className="navbar-text">
                    {
                        this.props.auth.loggedIn ?
                            <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                            :
                            <div 
                                className="btn btn-success"
                                onClick={() => this.setState({doLogin: true})}
                                >Login</div>
                    }
                </span> 
            </nav>
        )
    }
}

const mapStateToProps = (state: AppState): LinkStateProps => ({
    auth: state.authReducer
})
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
    logout: bindActionCreators(dispatchLogout, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation) 