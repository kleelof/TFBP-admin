import React, { Fragment } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/authentication/Login';
import FrontPage from './components/main/FrontPage';
import AdminApp from './components/admin/AdminApp';


export default class App extends React.Component<any, any> {

  public render() {

    return (
      <div className="container-fluid">
        <div className="col-12">
          <Fragment>
            <Switch>
              <Route path="/admin" component={AdminApp} />
              <Route path="/login" component={Login} />
              <Route path="/" component={FrontPage} />
            </Switch>
          </Fragment>
        </div>
      </div> 
    );
  }
}
