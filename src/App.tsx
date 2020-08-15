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
import Coupons from './components/coupon/Coupons';
import DeliveryDuplicate from './components/delivery/DeliveryDuplicate';
import CouponAdd from "./components/coupon/CouponAdd";

interface LinkStateProps {
  auth: AuthState
}

interface LinkDispatchProps {
  login: (user: User, operator_token: string) => void
}

type Props = LinkStateProps & LinkDispatchProps;

interface State { 
  connecting: boolean,
  loggedIn: boolean // temporary flag while auth login is completed
}

class App extends React.Component<Props, State> {

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
                this.props.login(user, "");
              })
              .catch((err: any) => {
                this.setState({connecting: false, loggedIn: false});
              })
    } else {
        this.setState({connecting: false, loggedIn: false});
    }
  }

  public render() {
    if (this.state.connecting)
      return <div>Connecting...</div>

    if (!this.props.auth.loggedIn)
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
			
			{this.props.auth.loggedIn &&
				<div className="row">
					<div className="col-12">
						<Navigation/>
					</div>
				</div>
			}
			<div className="row app-page">
				<div className="col-12">
					<br/>
					<Switch>
					<PrivateRoute path="/dashboard/menu" component={Menu} />
					<PrivateRoute path="/dashboard/deliveries" component={Deliveries} />
					<PrivateRoute path="/dashboard/delivery/edit/:id" component={DeliveryDay} />
          <PrivateRoute path="/dashboard/delivery/duplicate/:id" component={DeliveryDuplicate} />
					<PrivateRoute path="/dashboard/mailingList" component={MailingList} />
					<PrivateRoute path="/dashboard/mailUtilities" component={MailUtilities} />
					<PrivateRoute path="/dashboard/orders/export" component={Export} />
					<PrivateRoute path="/dashboard/orders/edit/:id" component={EditOrder} />
					<PrivateRoute path="/dashboard/orders" component={Orders} />
					<PrivateRoute path="/dashboard/coupon/add" component={CouponAdd}/>
					<PrivateRoute path="/dashboard/coupons" component={Coupons} />
					<Route path="/dashboard/login" component={Login} />
					</Switch>
				</div>
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
