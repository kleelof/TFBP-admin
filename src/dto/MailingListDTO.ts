import ModelBase from "../models/ModelBase";

export default class MailingListDTO extends ModelBase {

    public email!: string;
    public code!: string;
    public active!: boolean;

    constructor(email: string) {
        super();
        this.email = email;
    }
}