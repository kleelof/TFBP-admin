import React from 'react';
import MenuItem from "../../models/MenuItemModel";

interface Props {
    menuItem: MenuItem
}

export const DeliveryDayItemSearchChoice = (props: Props): React.ReactElement => {
    return (
        <div>{props.menuItem.name}</div>
    )
}
