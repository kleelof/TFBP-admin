import Service from './Service'
import Operator from "../models/OperatorModel";
import OperatorSettingsDTO from "../dto/OperatorSettingsDTO";

class OperatorService extends Service {
    appName = 'dashboard';
    view = 'operator';

    public getMe = (): Promise<Operator> => {
        return this._get<any>(`${this.appName}/${this.view}/get_me`);
    }

    public get_settings = (): Promise<OperatorSettingsDTO> => {
        return this._get<OperatorSettingsDTO>(`${this.appName}/${this.view}/get_settings/`);
    }
}

export default new OperatorService();