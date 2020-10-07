import Service from './Service';
import FunctionsResponsesDTO from '../dto/FunctionsResponsesDTO';
import Order from "../models/OrderModel";
import MassMailResponseDTO from "../dto/MassMailResponseDTO";

class APIActionService extends Service {

    public getTimeZones = (): Promise<string[]> => {
        return this._get<string[]>(`dashboard/get_time_zones/`);
    }

    public sendWeeklyEmails = (): Promise<FunctionsResponsesDTO> => {
        return this._get(`dashboard/send_weekly_email/`);
    }

    public sendSupportEmail = (to: string, subject: string, body: string, order: Order | null = null): Promise<any> => {
        let payload: any = {to, subject, body}

        if (order !== null) payload['order_id'] = order.id

        return this._post<any>('dashboard/send_support_email/', payload)
    }

    public sendMassMail = (dto: any): Promise<MassMailResponseDTO> => {
        return this._post<any>('dashboard/send_mass_email/', dto);
    }
}

export default new APIActionService();