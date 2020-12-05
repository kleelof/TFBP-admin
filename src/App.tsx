import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AuthState } from './store/auth/authReducer';
import { AppState, AppActions } from './store/store';
import { dispatchLogin } from './store/auth/authActions';
import authService from './services/AuthService';
import User from './models/User';

import './App.scss';

import menuIcon from './assets/menu_icon.png';

import {Navigation} from './components/nav/Navigation';
import Deliveries from './components/delivery/Deliveries';
import DeliveryDay from './components/delivery/DeliveryDayComponent';
import {Menu} from './components/menu/Menu';
import Login from './components/authentication/Login';
import Orders from './components/order/Orders';
import Export from './components/order/Export';
import OrderEdit from './components/order/OrderEdit';
import Coupons from './components/coupon/Coupons';
import DeliveryDuplicate from './components/delivery/DeliveryDuplicate';
import CouponAdd from "./components/coupon/CouponAdd";
import OrderEmail from "./components/order/OrderEmail";
import {Mail} from "./components/mail/Mail";
import {Newsletters} from "./components/newsletter/Newsletters";
import NewsletterEdit from "./components/newsletter/NewsletterEdit";
import BrowserTool from "./components/browser_tool/BrowserTool";
import BrowserFullDay from "./components/browser_tool/BrowserFullDay";
import {DeliveryWindows} from "./components/delivery_windows/DeliveryWindows";
import {DeliveryWindowEdit} from "./components/delivery_windows/DeliveryWindowEdit";
import {Zones} from "./components/zone/Zones";
import {DeliveryPlanner} from "./components/delivery_planner/DeliveryPlanner";
import {Profile} from "./components/profile/Profile";
import {Recipes} from "./components/recipe/Recipes";
import {Ingredients} from "./components/ingredient/Ingredients";
import {IngredientEdit} from "./components/ingredient/IngredientEdit";
import {RecipeEdit} from "./components/recipe/RecipeEdit";
import {RecipeNotes} from "./components/recipe/RecipeNotes";
import logo from './assets/daisy_logo.png';
import operatorService from './services/OperatorService';
import OperatorSettingsDTO from "./dto/OperatorSettingsDTO";
import {dispatchUpdateOperatorSettings, OperatorSettings, OperatorState} from "./store/operatorReducer";
import {RestaurantMenuManager} from "./components/restaurant_menu_manager/RestaurantMenuManager";
import {RestaurantDelivery} from "./components/restaurant_delivery/RestaurantDelivery";
import {OPERATOR_TYPES} from "./models/OperatorModel";
import {RestaurantDashboard} from "./components/restaurant_dashboard/RestaurantDashboard";
import {dispatchAddOverlay, HelpersState} from "./store/helpersReducer";
import {CreateOrder} from "./components/create_order/CreateOrder";
import {RestaurantMenuEdit} from "./components/restaurant_menu_manager/RestaurantMenuEdit";
import {RestaurantMenuItems} from "./components/restaurant_menu_manager/RestaurantMenuItems";

interface LinkStateProps {
    auth: AuthState,
    operator: OperatorState,
    helpers: HelpersState
}

interface LinkDispatchProps {
    login: (user: User, operator_token: string) => void,
    updateOperatorSettings: (settings: OperatorSettings) => void,
    setOverlay: (component: any) => void
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

  openNav = () => {
      // @ts-ignore
      document.getElementById("mySidenav").style.width = "250px";
    }

/* Set the width of the side navigation to 0 */
 closeNav = () => {
  // @ts-ignore
     document.getElementById("mySidenav").style.width = "0";
    }

  public componentDidMount = () => {
    const refresh_token: string | null = window.localStorage.getItem('refresh_token');
    if(refresh_token !== null) {
        authService.validateToken(refresh_token)
              .then((user: User) => {
                this.props.login(user, "");
                this.getSettings();
              })
              .catch((err: any) => {
                this.setState({connecting: false, loggedIn: false});
              })
    } else {
        this.setState({connecting: false, loggedIn: false});
    }
  }

  public getSettings = (): void => {
     operatorService.get_settings()
         .then((settings: OperatorSettingsDTO) => {
             this.props.updateOperatorSettings({
                 type: settings.type
             });
             this.setState({connecting: false, loggedIn: true});
         })
         .catch( err => this.setState({connecting: false, loggedIn: false}))
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
		<div className="container-fluid app">
			{this.props.auth.loggedIn &&
				<div id="mySidenav" className="sidenav">
                    <div className="closebtn" onClick={this.closeNav}>x</div>
                    <Navigation closeNav={this.closeNav} />
                </div>
			}
			<div className='row app_header'>
                <div className='col-12'>
                    <div className='app_header__title'>
                        <img src={logo} alt='daisy chef logo'/>
                    </div>
                    <div className='app_header__menu_toggle' onClick={this.openNav}>
                        <img src={menuIcon} alt='open the menu'/>
                    </div>
                </div>
            </div>
			<div className="row app__page">
				<div className="col-12 mt-2">
					<Switch>
                        <PrivateRoute path='/dashboard/browser/day/:targetDate' component={BrowserFullDay} />
                        <PrivateRoute path='/dashboard/browser/:month/:year' component={BrowserTool} />
                        <PrivateRoute path='/dashboard/browser' component={BrowserTool} />
                        <PrivateRoute path="/dashboard/coupon/add" component={CouponAdd}/>
                        <PrivateRoute path="/dashboard/coupons" component={Coupons} />
                        <PrivateRoute path='/dashboard/create_order/:type/:zip' component={CreateOrder}/>
                        <PrivateRoute path="/dashboard/deliveries" component={Deliveries} />
                        <PrivateRoute path="/dashboard/delivery/edit/:id" component={DeliveryDay} />
                        <PrivateRoute path="/dashboard/delivery/duplicate/:id" component={DeliveryDuplicate} />
                        <PrivateRoute path='/dashboard/delivery_window/edit/:id' component={DeliveryWindowEdit} />
                        <PrivateRoute path='/dashboard/delivery_window/add' component={DeliveryWindowEdit} />
                        <PrivateRoute path="/dashboard/delivery_window" component={DeliveryWindows} />
                        <PrivateRoute path='/dashboard/delivery_planner/:delivery_window/:target_date' component={DeliveryPlanner} />
                        <PrivateRoute path='/dashboard/ingredient/edit/:id' component={IngredientEdit} />
                        <PrivateRoute path='/dashboard/ingredient' component={Ingredients} />
                        <PrivateRoute path="/dashboard/mail" component={Mail} />
                        <PrivateRoute path="/dashboard/menu" component={Menu} />
                        <PrivateRoute path='/dashboard/newsletter/edit/:id' component={NewsletterEdit} />
                        <PrivateRoute path='/dashboard/newsletter' component={Newsletters} />
                        <PrivateRoute path="/dashboard/orders/export" component={Export} />
                        <PrivateRoute path="/dashboard/orders/edit/:id" component={OrderEdit} />
                        <PrivateRoute path='/dashboard/order/mail/:id' component={OrderEmail} />
                        <PrivateRoute path="/dashboard/orders" component={Orders} />
                        <PrivateRoute path='/dashboard/profile' component={Profile} />
                        <PrivateRoute path='/dashboard/rest/menu/edit/:id' component={RestaurantMenuEdit} />
                        <PrivateRoute path='/dashboard/rest/menu' component={RestaurantMenuManager} />
                        <PrivateRoute path='/dashboard/rest/menu_items' component={RestaurantMenuItems} />
                        <PrivateRoute path='/dashboard/rest/delivery' component={RestaurantDelivery} />
                        <PrivateRoute path='/dashboard/recipe/edit/:id' component={RecipeEdit} />
                        <PrivateRoute path='/dashboard/recipe/notes/:id' component={RecipeNotes} />
                        <PrivateRoute path='/dashboard/recipe' component={Recipes} />
                        <PrivateRoute path='/dashboard/zone' component={Zones} />
                        <PrivateRoute path='/dashboard/' component={this.props.operator.settings?.type === OPERATOR_TYPES.default ? BrowserTool : RestaurantDashboard} />
                        <PrivateRoute path='' component={BrowserTool} />
                        <Route path="/dashboard/login" component={Login} />
					</Switch>
				</div>
			</div>
            {this.props.helpers.overlayComponent != null &&
                  <div
                      className='app_overlay theme__overlay_background'
                      onClick={() => this.props.setOverlay(null)}
                  >
                      <div
                          className='app_overlay__inner theme__background theme__border_color'
                          onClick={(e: React.MouseEvent) => {e.stopPropagation()}}
                      >
                          <div className='container'>
                              <div className='row'>
                                  <div className='col-12'>
                                    {this.props.helpers.overlayComponent}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              }
		</div>
    );
  }
}


const mapStateToProps = (state: AppState): LinkStateProps => ({
    auth: state.authReducer,
    operator: state.operatorReducer,
    helpers: state.helpersReducer
});
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
    login: bindActionCreators(dispatchLogin, dispatch),
    updateOperatorSettings: bindActionCreators(dispatchUpdateOperatorSettings, dispatch),
    setOverlay: bindActionCreators(dispatchAddOverlay, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
