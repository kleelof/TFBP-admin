import React, { Fragment } from 'react';
import Navigation from './nav/Navigation';
import { Switch, Route, Redirect } from 'react-router-dom';
import Menu from './menu/Menu';
import Deliveries from './delivery/Deliveries';
import DeliveryDay from '../models/DeliveryDayModel';
import MailingList from './mail/MailingList';
import Login from './authentication/Login';

export default class MainApp extends React.Component<any, any> {

    public render() {console.log("XXXX")
        const PrivateRoute = ({component, ...rest}: any) => {
            const routeComponent = (props: any) => (
                this.props.auth.loggedIn
                    ? React.createElement(component, props)
                    : <Redirect to={{pathname: '/login'}}/>
            );
            return <Route {...rest} render={routeComponent}/>;
        };
          
        return(
            <div className="container-fluid">
                <div className="col-12">
                    <Navigation/>
                    <Switch>
                    <PrivateRoute path="/menu" component={Menu} />
                    <PrivateRoute path="/deliveries" component={Deliveries} />
                    <PrivateRoute path="/delivery/edit/:id" component={DeliveryDay} />
                    <PrivateRoute path="/mailingList" component={MailingList} />
                    <Route path="/login" component={Login} />
                    </Switch>
                </div>
            </div>
        )
    }
}