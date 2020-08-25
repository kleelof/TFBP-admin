import ModelBase from './ModelBase';

export default class MailTemplate extends ModelBase {
    public slug!: string;
    public text!: string;
    public options!: {}

    constructor(slug: string, text: string, options: {}) {
        super();
        this.slug = slug || '';
        this.text = text || '';
        this.options = options || {}
    }
}