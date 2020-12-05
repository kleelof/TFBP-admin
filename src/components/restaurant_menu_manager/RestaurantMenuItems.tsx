import React, {useState} from 'react';
import menuItemService from '../../services/MenuItemService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import {config} from "../../config";
import { Link } from 'react-router-dom';

import './rest_menu_manager.scss';
import MenuItem from "../../models/MenuItemModel";
import PagedResultsDTO from "../../dto/PagedResultsDTO";

export const RestaurantMenuItems = (): React.ReactElement => {

    const [isLoading, setIsLoading] = useState(false);
    const [dto, setDTO] = useState(new PagedResultsDTO());
    const [currentPage, setCurrentPage] = useState(1);

    React.useEffect(() => {
        loadPage(1);
    }, [])

    const loadPage = (page: number, searchPattern?: string): void => {
        setCurrentPage(page);

        menuItemService.get<PagedResultsDTO>()
            .then((dto: PagedResultsDTO) => {
                setDTO(dto);
            })
            .catch( err => {window.alert('Unable To Load Menu Items')})
    }

    if (isLoading)
        return <LoadingOverlay />

    const sortedItems: MenuItem[] = (dto.results as any).sort((a: MenuItem, b: MenuItem) => a.name.toLowerCase() > b.name.toLowerCase() ?
                                        1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0);

    return (
        <div className='row restaurant_menu_items'>
            <div className='col-12'>
                <h3>menu items</h3>
                <hr/>
            </div>
            {
                sortedItems.map((menuItem: MenuItem) =>
                    <div className="col-6 col-md-3 menu_items__item" key={`mi_${menuItem.id}`}>
                        <Link className="row" to={`/dashboard/menu/edit/${menuItem.id}/`}>
                                <div className="col-12 menu_items__menuitem_name no_wrap_text">{menuItem.name}</div>
                                <div className="col-12">
                                    <div className='menu_items__image'>
                                        <img
                                            src={`${config.API_URL + config.UPLOADS_PATH}/${menuItem.image}`}
                                            alt={menuItem.name}/>
                                    </div>
                                </div>
                        </Link>
                    </div>
                )
            }
        </div>
    )
}