import DeliveryDayItem from '../src/models/DeliveryDayItemModel';
import MenuItem from '../src/models/MenuItem';
import DeliveryDay from '../src/models/DeliveryDay';
import DeliveryWindow, { DeliveryWindowDTO } from '../src/models/DeliveryWindow';
import { DeliveryDayDTO, DeliveryDaysDTO } from '../src/models/DeliveryDay';


interface IBuildDeliveryDay {
    count: number,
    deliveryItemsCount?: number
}

export const BuildDeliveryDay = (params: IBuildDeliveryDay): any => {
    let deliveryDays: DeliveryDay[] = [];

    params.deliveryItemsCount = params.deliveryItemsCount ? params.deliveryItemsCount : 1
    let deliveryDayItems: any = BuildDeliveryDayItem({
            count: params.deliveryItemsCount ? params.deliveryItemsCount : 1
        }) as any
    if (params.deliveryItemsCount && params.deliveryItemsCount === 1) deliveryDayItems = [deliveryDayItems]

    for(let x: number =0; x < params.count; x ++) {
        deliveryDays.push(
            new DeliveryDay(
                `2020-07-${x + 1}`,
                x + 1,
                `2020-07-${x + 8}`,
                deliveryDayItems
            )
        )
    }

    return deliveryDays.length > 1 ? deliveryDays : deliveryDays[0];
}

interface IBuildDeliveryDayDTO {
    count: number,
    deliveryItemsCount?: number,
    windows?: DeliveryWindowDTO[],
    date?: string,
    end_date?: string
}

export const BuildDeliveryDayDTO = (params: IBuildDeliveryDayDTO): any => {
    let tDeliveryDays: DeliveryDayDTO[] = [];
    params.deliveryItemsCount = params.deliveryItemsCount ? params.deliveryItemsCount : 1
    let deliveryDayItems: any = BuildDeliveryDayItem({
            count: params.deliveryItemsCount ? params.deliveryItemsCount : 1
        }) as any
    if (params.deliveryItemsCount && params.deliveryItemsCount === 1) deliveryDayItems = [deliveryDayItems]

    for(let x: number = 0; x < params.count; x ++ ) {
        tDeliveryDays.push({
            delivery_day: new DeliveryDay(
                params.date || `2020-07-${x + 1}`,
                x + 1,
                params.end_date || `2020-07-${x + 8}`,
                deliveryDayItems
            ),
            windows: params.windows ? params.windows : []
        })
    }

    return tDeliveryDays.length === 1 ? tDeliveryDays[0] : tDeliveryDays;
}

interface IBuildDeliveryDaysDTO {
    deliveryDaysCount: number,
    deliveryItemsCount?: number,
    windows?: DeliveryWindowDTO[],
    zipValid?: boolean
}

export const BuildDeliveryDaysDTO = (params: IBuildDeliveryDaysDTO): any => {
    let deliveryDay: DeliveryDaysDTO = {
        zip_valid: params.zipValid ? params.zipValid : true,
        delivery_days: BuildDeliveryDayDTO({
            count: params.deliveryDaysCount,
            windows: params.windows,
            deliveryItemsCount: params.deliveryItemsCount
        })
    };

    return deliveryDay;
}

interface IBuildDeliveryDayItem {
    count: number,
    menuItem?: MenuItem
}

export const BuildDeliveryDayItem = (params: IBuildDeliveryDayItem): any => {
    let items: DeliveryDayItem[] = [];

    for(let x: number = 0; x < params.count; x ++) {
        items.push(
            new DeliveryDayItem(
                undefined,
                params.menuItem ?
                    params.menuItem
                    :
                    new MenuItem(
                        x + 1,
                        `menu_item_${x + 1}`,
                        'description',
                        'en',
                        10,
                        'chicken',
                        '',
                        true
                    ),
                false,
                10
            )
        )
    }

    return items.length === 1 ? items[0] : items;
}

interface IBuildDeliveryWindow {
    count: number,
    start_time?: string,
    end_time?: string
}

export const BuildDeliveryWindow = (params: IBuildDeliveryWindow): any => {
    let windows: DeliveryWindow[] = [];

    for (let x: number = 0; x < params.count; x ++) {
        windows.push(
            new DeliveryWindow(
                x + 1,
                `delivery_window_${x}`,
                params.start_time || "01:01:01",
                params.end_time || "02:02:02"
                )
        )
    }
    return windows.length > 1 ? windows : windows[0];
}

interface IBuildDeliveryWindowDTO {
    count: number,
    date?: string,
    window?: DeliveryWindow
}

export const BuildDeliveryWindowDTO = (params: IBuildDeliveryWindowDTO): any => {
    let windows: DeliveryWindowDTO[] = [];

    for(let x: number = 1; x <= params.count; x ++) {
        windows.push(
            {
                date: params.date ? params.date : "2020-07-04",
                window: params.window ? params.window :
                    BuildDeliveryWindow({count: 1})
            }
        )
    }

    return windows.length > 1 ? windows : windows[0];
}

interface IBuildMenuItem {
    count: number,
    name?: string,
    spicy?: boolean,
    proteins?: string
}

export const BuildMenuItem = (params: IBuildMenuItem): any => {
    let items: MenuItem[] = [];

    for(let x: number = 1; x <= params.count; x ++ ) {
        items.push(
            new MenuItem(
                x ,
                params.name || `menu_item_${x}`,
                `description ${x}`,
                'en',
                10,
                params.proteins || '',
                '',
                params.spicy || false
            )
        )
    }
    return items.length > 1 ? items : items[0];
}
