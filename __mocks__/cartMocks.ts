import CartItem from "../src/models/CartItemModel"
import User from "../src/models/User";
import DeliveryWindow from "../src/models/DeliveryWindowModel";
import MenuItem from "../src/models/MenuItemModel";

export interface IBuildCartItemsSettings {
    count: number,
    price?: number,
    quantity?: number,
    spicy?: number,
    protein?: string,
    deliveryDate?: string,
    deliveryWindow?: DeliveryWindow,
    menuItem?: MenuItem
    cartId?: string
}

export const BuildCartItem = (params:IBuildCartItemsSettings): any => {
    
    let cartItems: CartItem[] = [];

    for(let x:number = 0; x < params.count; x ++) {
        cartItems.push(
            new CartItem(
                new User(),
                params.deliveryDate || '2020-07-04',
                params.deliveryWindow || new DeliveryWindow(),
                params.menuItem || new MenuItem(),
                params.quantity || 1,
                params.price || 10,
                params.spicy || 0,
                params.protein || "chicken",
                params.cartId || "",
                x + 1
            )
        )
    }

    return cartItems.length === 1 ? cartItems[0] : cartItems;
}

export const basicCart: any[] = [
    {
        id: 1,
        delivery_date: "2020-07-07",
        quantity: 1,
        price: 10,
        spicy: 1,
        protein: 'vekan',
        menu_item: {
            id: 1,
            name: 'menu_item_1',
            description: 'menu_item_1 description',
            proteins: '',
            allergens: '',
            price: 10,
            image: 'image',
            spicy: 1,
            category: 'en'
        }
    },
    {
        id: 2,
        delivery_date: "2020-07-10",
        quantity: 1,
        price: 15,
        spicy: 0,
        protein: 'vekan',
        menu_item: {
            id: 2,
            name: 'menu_item_2',
            description: 'menu_item_2 description',
            proteins: '',
            allergens: '',
            price: 0,
            image: 'image',
            spicy: 1,
            category: 'de'
        }
    }
]

