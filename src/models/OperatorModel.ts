import ModelBase from "./ModelBase";
import User from "./User";

export default class Operator extends ModelBase {
    public token!: string;
    public is_active!: boolean;
    public name!: string;
    public phone!: string;

    public page_name!: string;
    public page_slug!: string;
    public street_address!: string;
    public unit!: string;
    public city!: string;
    public state!: string;
    public zip_code!: string;
    public self_hosted!: boolean;
    public domain!: string;
    public support_email!: string;
    public timezone!: string;
    public storefront_template!: string;

    public ordering_cutoff_time!: number;
    public upcoming_delivery_notification_time!: number;
    public upcoming_delivery_days_notification_time!: number;
    public auto_notify_upcoming_deliveries!: boolean;
    public max_future_delivery_windows_time!: number;
    public delivery_fee!: number;
    public free_delivery_minimum!: number;
    public tax_rate!: number;
    public tax_tips!: boolean;
    public tax_delivery_fee!: boolean;
    public allow_tipping!: boolean;
    public customer_must_be_present!: boolean;
    public delivery_minimum!: number;

    public user!: User;

    constructor(
        id: number = -1,
        token: string = '',
        is_active: boolean = true,
        name: string = '',
        phone: string = '',
        page_name: string = '',
        page_slug: string = '',
        street_address: string = '',
        unit: string = '',
        city: string = '',
        state: string = '',
        zip_code: string = '',
        self_hosted: boolean = false,
        domain: string = '',
        support_email: string = '',
        timezone: string = '',
        ordering_cutoff_time: number = 0,
        upcoming_delivery_notification_time: number = 0,
        upcoming_delivery_days_notification_time: number = 0,
        user: User = new User(),
        auto_notify_upcoming_deliveries: boolean = false,
        storefront_template: string = '',
        max_future_delivery_windows_time: number = 0
    ) {
        super();
        this.id = id;
        this.token = token;
        this.is_active = is_active;
        this.name = name;
        this.phone = phone;
        this.page_name = page_name;
        this.page_slug = page_slug;
        this.street_address = street_address;
        this.unit = unit;
        this.city = city;
        this.state = state;
        this.zip_code = zip_code;
        this.self_hosted = self_hosted;
        this.domain = domain;
        this.support_email = support_email;
        this.timezone = timezone;
        this.ordering_cutoff_time = ordering_cutoff_time;
        this.upcoming_delivery_notification_time = upcoming_delivery_notification_time;
        this.upcoming_delivery_days_notification_time = upcoming_delivery_days_notification_time;
        this.user = user;
        this.auto_notify_upcoming_deliveries = auto_notify_upcoming_deliveries;
        this.storefront_template = storefront_template;
        this.max_future_delivery_windows_time = max_future_delivery_windows_time;
    }
}