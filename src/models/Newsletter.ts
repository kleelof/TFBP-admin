import ModelBase from "./ModelBase";

export default class Newsletter extends ModelBase {
    public title!: string;
    public content!: string;
    public release_date!: any;

    constructor(id?: number, title?: string, content?: string, release_date?: any) {
        super();
        this.id = id || -1;
        this.title = title || '';
        this.content = content || '';
        this.release_date = release_date || null;
    }
}

