import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';

import './menu.scss';
import { useHistory } from 'react-router-dom';
import menuItemService from '../../services/MenuItemService';
import MenuItem from '../../models/MenuItemModel';

export const NewMenuItem = (): React.ReactElement => {
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('en');
    const [open, setOpen] = useState<boolean>(false);

    const history = useHistory();

    const createNewMenuItem = (): void => {
        menuItemService.add<MenuItem>({name, category} as any)
            .then((newMenuItem: MenuItem) => {
                history.push({pathname: `/dashboard/menu/edit/${newMenuItem.id}/`});
                setName('');
                setCategory('en');
            })
            .catch( err => window.alert('unable to add new menu item'))
    }

    return(
        <div className="row new_menu_item mt-3">
            {
                open === false ?
                    <div className="col-12 new_menu_item__add_link" onClick={()=> setOpen(true)}>
                        + Add New Item
                    </div>
                    :
                    <Fragment>
                        <div className="col-12">
                            <input type="text" className="form-control" id='new_menu_item__name'
                                value={name} placeholder='New Menu Item Name'
                                onChange={(e: any)=> setName(e.target.value)}/>
                        </div>
                        <div className="col-12 mt-1">
                            <select className="form-control" defaultValue={category}
                                onChange={(e) => setCategory(e.target.value)}>
                                <option value="en">Entree</option>
                                <option value="ap">Appetizer</option>
                                <option value="si">Side Item</option>
                                <option value="de">Dessert</option>
                            </select>
                        </div>
                        <div className="col-12 mt-1 text-center">
                            <button className="btn btn-success new_menu_item__submit"
                                disabled={name === ""} onClick={()=> createNewMenuItem()}>
                                Add New Item</button>
                        </div>
                    </Fragment>
            }
        </div>
    )
}