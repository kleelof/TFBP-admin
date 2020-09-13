import OrderItem from "../models/OrderItemModel";
import DeliveryDayItem from "../models/DeliveryDayItemModel";
import CartItem from "../models/CartItemModel";
import MenuItem from "../models/MenuItemModel";
import {DeliveryWindowDTO} from "../models/DeliveryWindowModel";

export type OrderedItems = {[key: string]: any[]};

class Helpers { 

    private days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private spicy: string[] = ["not spicy", "mild spicy", "spicy"];
    private proteins: {[key: string]: string} = {
        'pork': 'Pork',
        'chicken': 'Chicken',
        'beef' : ' Beef',
        'tofu' : ' Tofu',
        'veg' : 'Vegetable',
        'vekan' : 'Vegan',
        'shrimp' : 'Shrimp'
    };

    public convertToTwelveHour = (twentyFourHourTime: string): string => {
        let parts: string[] = twentyFourHourTime.split(':');
        let hour: number = parseInt(parts[0]);
        let amPm: string = ' am';
        if (hour > 11) {
            amPm = ' pm';
            hour -= hour > 12 ? 12 : 0;
        }

        if (hour === 0) hour = 12;

        return `${hour.toString()}:${parts[1]}${amPm}`;
    }

    public dateToShortISO = (date: Date): string => {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
        /*
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() + (offset*60*1000));
        const date_str = date.toISOString().split('T')[0];
        return  date_str;

         */
    }

    /*
        Returns a string ex; Pad-Tai with Chicken, mild spicy
    */
    public extractCartItemDescription = (cartItem: CartItem): string => {
        let description: string = cartItem.menu_item.name;
        description += cartItem.protein === null || cartItem.protein === "" || cartItem.menu_item.proteins.split(':').length < 2 ?
                    "" : 
                    cartItem.protein === 'vekan' ?
                    ' vegan' : ` with ${this.proteins[cartItem.protein]}`

        description += cartItem.menu_item.spicy === true ?
        `, ${this.spicy[cartItem.spicy]}` : ""

        return description;
    }

    public formatDate = (rawDate: string): string => {
        const T: number = rawDate.indexOf('T');
        if (T > -1) rawDate = rawDate.substr(0, T);
        const dateParts: string[] = rawDate.split('-');
        const date: Date = new Date(`${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`);
        date.setDate(date.getDate() + 1);
        return `${this.days[date.getDay()]} ${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }

    public formatDeliveryWindow = (window: DeliveryWindowDTO, excludeDate: boolean = false, splitLines: boolean = false): string => {
        let windowText: string = excludeDate ? "" :
            `${this.formatDate(window.date)} ${window.window.start_time !== window.window.end_time ? 'between ' : 'at '}`;

        windowText += this.convertToTwelveHour(window.window.start_time);

        return windowText += window.window.start_time !== window.window.end_time ?
                ` and ${this.convertToTwelveHour(window.window.end_time)}` : ''
    }


    /*
        Returns AA of orderItems sorted by their delivery dates
        The correct date order in the AA is not guaranteed. Use .keys(AA).sort() when iterrating.
    */

    public sortOrderItemsByDate = (orderItems: OrderItem[]): OrderedItems => {
        let sortedItems: OrderedItems = {};
        orderItems.forEach((item: OrderItem) => {
            if (!(item.cart_item.delivery_date in sortedItems))
                sortedItems[item.cart_item.delivery_date] = [];

            sortedItems[item.cart_item.delivery_date].push(item);
        })

        return  sortedItems;
    }

    public sortDeliveryDayItemsByCategory = (items: DeliveryDayItem[]): DeliveryDayItem[] => {
        let sortedItems: OrderedItems = {
            en: [],
            ap: [],
            si: [],
            de: [],
        };
        if (items) items.forEach((item: DeliveryDayItem) => sortedItems[item.menu_item.category].push(item))
        return [...sortedItems['en'], ...sortedItems['ap'], ...sortedItems['si'], ...sortedItems['de']];
    }

    public groupMenuItemsByCategory = (items: MenuItem[], sort: boolean = true): OrderedItems => {
        let groupedItems: OrderedItems = {
            en: [],
            ap: [],
            si: [],
            de: [],
        };
        items.forEach((item: MenuItem) => groupedItems[item.category].push(item));

        if (sort) {//TODO: Add sorting
            groupedItems['en'].sort(this.compareMenuItemsByName)
        }
        return groupedItems;
    }

    private compareMenuItemsByName(ia: MenuItem, ib: MenuItem) {
        if (ia.name < ib.name) return -1;
        if (ib.name < ia.name) return 1;
        return 0
    }
}

export default new Helpers();