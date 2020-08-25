import Service from './Service';
import Order from "../models/OrderModel";

class MailTemplateService extends Service {
    appName = 'dashboard';
    view = 'mail_template';
}

export default new MailTemplateService();