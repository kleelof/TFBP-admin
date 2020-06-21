import OrderItem from "../models/OrderItemModel";
import DeliveryDayItem from "../models/DeliveryDayItemModel";
import CartItem from "../models/CartItemModel";

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

    /*
        Returns a string ex; Pad-Tai with Chicken, mild spicy
    */
   public extractCartItemDescription = (cartItem: CartItem): string => {
        let description: string = cartItem.menu_item.name;
        description += cartItem.protein === null || cartItem.protein === "" ?
                    "" : 
                    cartItem.protein === 'vekan' ?
                    ' vegan' : ` with ${this.proteins[cartItem.protein]}`

        description += cartItem.menu_item.spicy === true ?
        `, ${this.spicy[cartItem.spicy]}` : ""

        return description;
    }

    public formatDate = (rawDate: string): string => {
        if (rawDate.indexOf('T') === -1) rawDate += 'T16:57:53.762237-07:00';// the leading 0 in some formats cause miscalculation. Adding this prevents that
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