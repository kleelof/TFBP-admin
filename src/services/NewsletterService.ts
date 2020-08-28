import Service from './Service';
import Newsletter from "../models/Newsletter";

class NewsletterService extends Service {
    appName = 'dashboard';
    view = 'newsletter';
}

export default new NewsletterService();