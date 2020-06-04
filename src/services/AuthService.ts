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
            .then( (resp: any) => {
                window.localStorage.setItem('access_token', resp.access);
                window.localStorage.setItem('refresh_token', resp.refresh);
                window.localStorage.setItem('user_id', resp.id.toString());
                window.localStorage.setItem('username', resp.email);
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

    public validateToken = (refreshToken: string): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            this._get<User>(`${this.viewPath}/user`)
            .then((user: User) => {
                resolve(true);
            })
            .catch((err: any) => {
                reject(false);
            })
        })
    }
}

export default new AuthService();