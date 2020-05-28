import React, { Fragment } from 'react';
import './App.css';
import Menu from './components/admin/menu/Menu';
import { Switch, Route } from 'react-router-dom';
import authService from './services/AuthService';
import Login from './components/authentication/Login';
import Navigation from './components/nav/Navigation';
import Weeks from './components/admin/weeks/Weeks';
import Week from './components/admin/weeks/Week';

interface IState {
  connecting: boolean,
  loggedIn: boolean
}

export class App extends React.Component<any, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      connecting: true,
      loggedIn: false
    }
  }

  public componentDidMount = () => {
    const refresh_token: string | null = localStorage.getItem('refresh_token');
    if(refresh_token !== null) {
        authService.validateToken(refresh_token)
            .then((valid: boolean) => {console.log("OK")
                this.setState({connecting: false, loggedIn: true});
            })
            .catch((err: any) => {console.log("ERROR")
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('access_token');
                this.setState({connecting: false});
            })
    } else {
        this.setState({connecting: false});
    }
  }

  public render() {

    if (this.state.connecting)
      return <div>Connecting...</div>

    if (!this.state.loggedIn)
      return <Login/>

    return (
      <div className="container-fluid">
        <div className="col-12">
          <Fragment>
            <Navigation userIsLoggedIn={this.state.loggedIn}/>
            <Switch>
              <Route exact path="/admin/menu" component={Menu} />
              <Route exact path="/admin/weeks" component={Weeks} />
              <Route exact path="/admin/week/edit/:id" component={Week} />
            </Switch>
          </Fragment>
        </div>
      </div> 
    );
  }
}

export default App;
