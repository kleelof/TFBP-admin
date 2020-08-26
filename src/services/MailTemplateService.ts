import Service from './Service';
import Order from "../models/OrderModel";
import MailTemplate from "../models/MailTemplate";

class MailTemplateService extends Service {
    appName = 'dashboard';
    view = 'mail_template';

    public get_template_by_slug = (slug: string): Promise<MailTemplate> => {
        return this._get<MailTemplate>(`${this.appName}/${this.view}/get_template_by_slug/?slug=${slug}`)
    }
}

export default new MailTemplateService();