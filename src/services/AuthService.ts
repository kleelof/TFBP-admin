import Service from "./Service";

import AuthenticateDTO from "../dto/AuthenticateDTO";
import UserDTO from "../dto/UserDTO";

class AuthService extends Service {

    public authenticate = (username: string, password: string): Promise<AuthenticateDTO> => {
        this.logout();
        
        return new Promise<AuthenticateDTO>((resolve, reject) => {
            this._post("admin_app/authenticate/", {username, password})
            .then( (resp: any) => {
                window.localStorage.setItem('access_token', resp.access);
                window.localStorage.setItem('refresh_token', resp.refresh);
                window.localStorage.setItem('user_id', resp.id);
                window.localStorage.setItem('username', resp.username);
                resolve(resp);
            })
            .catch((resp)=> {
                reject(resp)
            })
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
            this._get<UserDTO>("admin_app/user/")
            .then((userDTO: UserDTO) => {
                resolve(true);
            })
            .catch((err: any) => {
                reject(false);
            })
        })
    }
}

export default new AuthService();