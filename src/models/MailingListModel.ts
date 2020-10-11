import ModelBase from "./ModelBase";

export default class MailingListModel extends ModelBase {

    public email!: string;
    public code!: string;
    public active!: boolean;

    constructor(
        id: number = -1,
        email: string = '',
        code: string = '',
        active: boolean = true
) {
        super();
        this.id = id;
        this.email = email;
        this.code = code;
        this.active = active;
    }
}