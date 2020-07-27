import Service from './Service';

class MailingListService extends Service {
    appName = 'operator_app';
    view='mailing_list'
}

export default new MailingListService();