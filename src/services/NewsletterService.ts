import Service from './Service';
import Newsletter from "../models/Newsletter";

class NewsletterService extends Service {
    appName = 'dashboard';
    view = 'newsletter';

    public release = (newsletterId: number, send_email: boolean = false): Promise<any> => {
        return this._get<any>(`${this.appName}/${this.view}/${newsletterId}/release/?send_email=${send_email}`);
    }

    sendEmailSample = (newsletterId: number, email: string, send_email?: boolean): Promise<any> => {
        return this._get(`${this.appName}/${this.view}/${newsletterId}/send_email_sample/?email=${email}`);
    }
}

export default new NewsletterService();