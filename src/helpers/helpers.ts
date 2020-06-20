import OrderItem from "../models/OrderItemModel";
import DeliveryDayItem from "../models/DeliveryDayItemModel";

export type OrderedItems = {[key: string]: any[]};

class Helpers { 

    private days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private spicy: string[] = ["not spicy", "mild spicy", "spicy"];

    public formatDate = (rawDate: string): string => {console.log(rawDate)
        const date: Date = new Date(rawDate);
        return `${this.days[date.getDay()]} ${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
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
        items.forEach((item: DeliveryDayItem) => sortedItems[item.menu_item.category].push(item))
        return [...sortedItems['en'], ...sortedItems['ap'], ...sortedItems['si'], ...sortedItems['de']] 
    }
}

export default new Helpers();