import Service from './Service'
import Operator from "../models/OperatorModel";

class OperatorService extends Service {
    appName = 'dashboard';
    view = 'operator';

    public getMe = (): Promise<Operator> => {
        return this._get<any>(`${this.appName}/${this.view}/get_me`);
    }
}

export default new OperatorService();