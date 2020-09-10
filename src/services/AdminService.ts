import Service from './Service';
import FunctionsResponsesDTO from '../dto/FunctionsResponsesDTO';
import Order from "../models/OrderModel";

class AdminService extends Service {

    public sendWeeklyEmails = (): Promise<FunctionsResponsesDTO> => {
        return this._get(`api/dashboard/send_weekly_email/`);
    }

    public sendSupportEmail = (to: string, subject: string, body: string, order: Order | null = null): Promise<any> => {
        let payload: any = {to, subject, body}

        if (order !== null) payload['order_id'] = order.id

        return this._post<any>('api/dashboard/send_support_email/', payload)
    }

    public sendMassMail = (body: string, options: any, send_email: boolean = false): Promise<any> => {
        return this._post<any>('api/dashboard/send_mass_mail/',
            {body: body, options: options, send_email: send_email});
    }
}

export default new AdminService();