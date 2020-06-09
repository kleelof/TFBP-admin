import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AuthState } from './store/auth/authReducer';
import { AppState, AppActions } from './store/store';
import { dispatchLogin } from './store/auth/authActions';
import authService from './services/AuthService';
import User from './models/UserModel';

import './App.css';

import Navigation from './components/nav/Navigation';
import Deliveries from './components/delivery/Deliveries';
import DeliveryDay from './components/delivery/DeliveryDayComponent';
import Menu from './components/menu/Menu';
import MailingList from './components/mailing_list/MailingList';
import Login from './components/authentication/Login';

interface LinkStateProps {
  auth: AuthState
}

interface LinkDispatchProps {
  login: (user: User) => void
}

type Props = LinkStateProps & LinkDispatchProps;

interface IState {
  connecting: boolean
}

class App extends React.Component<Props, IState> {

  state = {
    connecting: true
  }

  public componentDidMount = () => { 
    const refresh_token: string | null = window.localStorage.getItem('refresh_token');
    if(refresh_token !== null) {
        authService.validateToken(refresh_token)
              .then((user: User) => {
                this.setState({connecting: false});
                this.props.login(user);
              })
              .catch((err: any) => {
                this.setState({connecting: false});
              })
    } else {
        this.setState({connecting: false});
    }
  }

  

  public render() {
    const PrivateRoute = ({component, ...rest}: any) => {
      const routeComponent = (props: any) => (
          this.props.auth.loggedIn
              ? React.createElement(component, props)
              : <Redirect to={{pathname: '/login'}}/>
      );
      return <Route {...rest} render={routeComponent}/>;
  };

    return (
      <div className="container-fluid">
        <div className="col-12">
          <Fragment>
            {this.props.auth.loggedIn &&
              <Navigation/>
            }
            {
              this.state.connecting ?
                <div>Connecting...</div>
                :
                <Switch>
                  <PrivateRoute path="/menu" component={Menu} />
                  <PrivateRoute path="/deliveries" component={Deliveries} />
                  <PrivateRoute path="/delivery/edit/:id" component={DeliveryDay} />
                  <PrivateRoute path="/mailingList" component={MailingList} />
                  <Route path="/login" component={Login} />
                </Switch>
            }
          </Fragment>
        </div>
      </div> 
    );
  }
}

const mapStateToProps = (state: AppState): LinkStateProps => ({auth: state.authReducer});
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
  login: bindActionCreators(dispatchLogin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
