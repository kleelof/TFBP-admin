import React, { useEffect, useState } from 'react';
import MenuItem from '../../models/MenuItemModel';
import { useParams, Link } from 'react-router-dom';
import menuItemService from '../../services/MenuItemService';
import {config} from '../../config';
import './menu.scss';
import {NewMenuItem} from "./NewMenuItem";

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
        menuItemService.search<MenuItem[]>(params.category, 'category')
            .then((items: MenuItem[]) => {
                setMenuItems(items);
            })
            .catch( err => {window.alert('Unable To Load Menu Items')})
        return () => {
        }
    }, [params.category])

    const sortedItems: MenuItem[] = menuItems.sort((a: MenuItem, b: MenuItem) => a.name > b.name ? 1 : -1);

    const menuType: string = params.category === 'en' ?
                            'entree'
                            :
                            params.category === 'ap' ?
                                'appetizer'
                                :
                                params.category === 'si' ?
                                    'side'
                                    :
                                    'dessert'
    return(
        <div className="row menu_items mt-3">
            <div className='col-12 menu__title'>
                <h3>
                    { menuType }s
                </h3>
                <hr/>
            </div>
            <div className="col-12 col-md-4">
                <NewMenuItem key={Math.random().toString()} />
            </div>
            <div className='d-none d-md-block col-md-8'></div>
            <div className='col-12'>
                <hr/>
            </div>
            {
                sortedItems.sort((a: MenuItem, b: MenuItem) =>
                                    a.name.toLowerCase() > b.name.toLowerCase() ?
                                        1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0 )
                            .map((item: MenuItem) => {
                    return(
                        <div className="col-6 col-md-2 menu_items__item" key={`mi_${item.id}`}>
                            <Link className="row" to={`/dashboard/menu/edit/${item.id}/`}>
                                    <div className="col-12 menu_items__menuitem_name no_wrap_text">{item.name}</div>
                                    <div className="col-12 item__item_image">
                                        <img src={`${config.API_URL}{item.image}`} alt={item.name}/>
                                    </div>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    )
}