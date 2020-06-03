import React from 'react';
import Navigation from '../nav/Navigation';
import { Route, Redirect } from 'react-router-dom';
import Menu from './menu/Menu';
import Weeks from './weeks/Weeks';
import Week from './weeks/Week';
import authService from '../../services/AuthService';
import MailingList from './mailing_list/MailingList';

interface IState {
    connecting: boolean,
    loggedIn: boolean
}

export default class AdminApp extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);
    
        this.state = {
          connecting: true,
          loggedIn: false
        }
    }

    public componentDidMount = () => {
        const refresh_token: string | null = window.localStorage.getItem('refresh_token');
        if(refresh_token !== null) {
            authService.validateToken(refresh_token)
                .then((valid: boolean) => {
                    this.setState({connecting: false, loggedIn: true});
                })
                .catch((err: any) => {console.log(err)
                    //window.localStorage.removeItem('refresh_token');
                    //window.localStorage.removeItem('access_token');
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
            return <Redirect to='/login' />
            
        return(
            <div className="row">
                <div className="col-12">
                    <Navigation userIsLoggedIn={true}/>
                    <Route path="/admin/menu" component={Menu} />
                    <Route path="/admin/weeks" component={Weeks} />
                    <Route path="/admin/week/edit/:id" component={Week} />
                    <Route path="/admin/mailingList" component={MailingList} />
                </div>
            </div>
        ) 
    }
}