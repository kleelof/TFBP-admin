import Service from './Service';

class MailingListService extends Service {
    appName = 'dashboard';
    view='mailing_list'
}

export default new MailingListService();