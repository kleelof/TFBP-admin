import React from 'react';
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
import MailingList from './components/mail/MailingList';
import Login from './components/authentication/Login';
import Orders from './components/order/Orders';
import Export from './components/order/Export';
import EditOrder from './components/order/EditOrder';
import MailUtilities from './components/mail/MailUtilities';

interface LinkStateProps {
  auth: AuthState
}

interface LinkDispatchProps {
  login: (user: User) => void
}

type Props = LinkStateProps & LinkDispatchProps;

interface IState {
  connecting: boolean,
  loggedIn: boolean // temporary flag while auth login is completed
}

class App extends React.Component<Props, IState> {

  state = {
    connecting: true,
    loggedIn: false
  }

  public componentDidMount = () => { 
    const refresh_token: string | null = window.localStorage.getItem('refresh_token');
    if(refresh_token !== null) {
        authService.validateToken(refresh_token)
              .then((user: User) => {
                this.setState({connecting: false, loggedIn: true});
                this.props.login(user);
              })
              .catch((err: any) => {
                this.setState({connecting: false, loggedIn: false});
              })
    } else { console.log("unable to login")
        this.setState({connecting: false, loggedIn: false});
    }
  }

  public render() {
    if (this.state.connecting)
      return <div>Connecting...</div>

    if (!this.state.loggedIn)
      return <Login />

    const PrivateRoute = ({component, ...rest}: any) => {
      const routeComponent = (props: any) => (
          this.props.auth.loggedIn || this.state.loggedIn
              ? React.createElement(component, props)
              : <Redirect to={{pathname: '/dashboard/login'}}/>
      );
      return <Route {...rest} render={routeComponent}/>;
    };
    
    return (
      <div className="container-fluid">
          <div className="col-12">
            {this.props.auth.loggedIn &&
              <Navigation/>
            }
            <br/>
            <Switch>
              <PrivateRoute path="/dashboard/menu" component={Menu} />
              <PrivateRoute path="/dashboard/deliveries" component={Deliveries} />
              <PrivateRoute path="/dashboard/delivery/edit/:id" component={DeliveryDay} />
              <PrivateRoute path="/dashboard/mailingList" component={MailingList} />
              <PrivateRoute path="/dashboard/mailUtilities" component={MailUtilities} />
              <PrivateRoute path="/dashboard/orders/export" component={Export} />
              <PrivateRoute path="/dashboard/orders/edit/:id" component={EditOrder} />
              <PrivateRoute path="/dashboard/orders" component={Orders} />
              <Route path="/dashboard/login" component={Login} />
            </Switch>
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
