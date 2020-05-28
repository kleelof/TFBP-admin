import Service from "./Service";

import AuthenticateDTO from "../dto/AuthenticateDTO";
import UserDTO from "../dto/UserDTO";

class AuthService extends Service {

    public authenticate = (username: string, password: string): Promise<AuthenticateDTO> => {
        this.logout();
        
        return new Promise<AuthenticateDTO>((resolve, reject) => {
            this._post("admin_app/authenticate/", {username, password})
            .then( (resp: any) => {
                localStorage.setItem('access_token', resp.access);
                localStorage.setItem('refresh_token', resp.refresh);
                localStorage.setItem('user_id', resp.id);
                localStorage.setItem('username', resp.username);
                resolve(resp);
            })
            .catch((resp)=> {
                reject(resp)
            })
        })
    }

    public logout = (): void => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
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