import Service from "./Service";

import AuthenticateDTO from "../dto/AuthenticateDTO";
import User from "../models/UserModel";

class AuthService extends Service {
    appName = 'core';
    view = 'auth';

    public authenticate = (email: string, password: string): Promise<AuthenticateDTO> => {
        this.logout();
        
        return new Promise<AuthenticateDTO>((resolve, reject) => {
            this._post(`${this.viewPath}/authenticate/`, {email, password})
            .then( (resp: any) => {
                window.localStorage.setItem('access_token', resp.access);
                window.localStorage.setItem('refresh_token', resp.refresh);
                resolve(resp);
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