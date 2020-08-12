import React from 'react';
import MenuItem from '../../models/MenuItemModel';

interface Props {
    menuItem: MenuItem
}

export const MenuItemDisplay = (props: Props): React.ReactElement => {
    return(
        <div className="row menuitem">
            <div className="col-12 menuitem__title">{props.menuItem.name}</div>
        </div>
    )
}