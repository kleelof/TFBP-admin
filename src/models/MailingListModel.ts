import ModelBase from "./ModelBase";

export default class MailingListModel extends ModelBase {

    public email!: string;
    public code!: string;
    public active!: boolean;

    constructor(email: string, code: string, active: boolean) {
        super();
        this.email = email;
        this.code = code;
        this.active = active;
    }
}