import React, { useEffect, useState } from 'react';
import MenuItem from '../../models/MenuItemModel';
import { useParams, Link } from 'react-router-dom';
import menuItemService from '../../services/MenuItemService';
import {config} from '../../config';

export const MenuItemCategories: any = {
    en: 'Entrees',
    ap: 'Appetizers',
    si: 'Sides',
    de: 'Desserts'
}

export enum ItemsModes {
    menu,
    deliveryDay
}

export const MenuItems = (): React.ReactElement => {
    const params: any = useParams();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])

    useEffect(() => {
        menuItemService.loadByCategory(params.category)
            .then((items: MenuItem[]) => {
                setMenuItems(items);
            })
            .catch( err => {window.alert('Unable To Load Menu Items')})
        return () => {
        }
    }, [params.category])

    const sortedItems: MenuItem[] = menuItems.sort((a: MenuItem, b: MenuItem) => a.name > b.name ? 1 : -1);
    
    return(
        <div className="row menu_items mt-3">
            {
                sortedItems.sort((a: MenuItem, b: MenuItem) =>
                                    a.name.toLowerCase() > b.name.toLowerCase() ?
                                        1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0 )
                            .map((item: MenuItem) => {
                    return(
                        <div className="col-12 col-md-3 menu_items__item" key={`mi_${item.id}`}>
                            <Link className="row" to={`/dashboard/menu/edit/${item.id}/`}>
                                    <div className="col-12 item__item_name">{item.name}</div>
                                    <div className="col-12 item__item_image">
                                        <img src={config.API_URL + item.image} alt={item.name}/>
                                    </div>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    )
}