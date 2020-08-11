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
    return(
        <div className="row menuitems mt-3">
            {
                menuItems.map((item: MenuItem) => {
                    return(
                        
                        <div className="col-12 col-md-3 menuitems__menuitem" key={`mi_${item.id}`}>
                            <Link to={`/dashboard/menu/edit/${item.id}/`}>
                                <div className="row">
                                    <div className="col-12 menuitem__name">{item.name}</div>
                                    <div className="col-12 menuitem__image">
                                        <img src={config.API_URL + item.image} alt={item.name}/>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    )
}