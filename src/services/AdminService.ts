import Service from './Service';
import FunctionsResponsesDTO from '../dto/FunctionsResponsesDTO';

class AdminService extends Service {

    public sendWeeklyEmails = (): Promise<FunctionsResponsesDTO> => {
        return this._get(`admin_app/send_weekly_email/`);
    }
}

export default new AdminService();