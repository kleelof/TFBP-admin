import Service from './Service';

class MailingListService extends Service {
    appName = 'dashboard';
    view='mailing_list';

    public addUnserivcedZipcode = (code: string, email: string): Promise<any> => {
        return this._post<any>(`${this.appName}/${this.view}/add_unserviced_zipcode`, {code, email});
    }

    public confirmZipCode = (zipCode: string) : Promise<string> => {
        return this._get<any>(`${this.appName}/${this.view}/confirm_zip_code/?zip_code=${zipCode}`);
    }
}

export default new MailingListService();