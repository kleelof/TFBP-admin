import Service from "./Service";

import AuthenticateDTO from "../dto/AuthenticateDTO";
import User from "../models/User";

class AuthService extends Service {
    appName = 'core';
    view = 'auth';

    public authenticate = (email: string, password: string): Promise<AuthenticateDTO> => {
        this.logout();
        
        return new Promise<AuthenticateDTO>((resolve, reject) => {
            this._post(`${this.viewPath}/authenticate/`, {email, password})
            .then( (resp: any) => {console.log(resp);
                if (resp.operator_token !== null) {
                    window.localStorage.setItem('access_token', resp.access);
                    window.localStorage.setItem('refresh_token', resp.refresh);
                    window.localStorage.setItem('operator_token', resp.operator_token)
                    resolve(resp);
                } else {
                    reject (resp);
                }
            })
            .catch( (resp: any) => reject(resp))
        })
    }

    public logout = (): void => {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('user_id');
        window.localStorage.removeItem('username');
    }

    public updatePassword = (user: User, current_password: string, new_password: string): Promise<any> => {
        return this._post(`${this.appName}/${this.view}/update_password/`, {
            current_password, new_password, user_id: user.id
        })
    }

    public validateToken = (refreshToken: string): Promise<User> => {
        return new Promise<User>((resolve, reject) => {
            this._get<User>(`${this.viewPath}/user`)
            .then((user: User) => {
                resolve(user);
            })
            .catch( err => reject(err))
        })
    }
}

export default new AuthService();