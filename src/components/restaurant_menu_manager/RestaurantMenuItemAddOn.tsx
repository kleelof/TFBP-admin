import React from 'react';
import MenuItemAddOn from "../../models/MenuItemAddOnModel";

interface Props {
    addOn: MenuItemAddOn,
    removeAddon: (addOn: MenuItemAddOn) => void
}

export const RestaurantMenuItemAddOn = (props: Props): React.ReactElement => {

    const removeMe = (): void => {
        if (!window.confirm(`Are you sure you want to remove "${props.addOn.name}">`)) return;
        props.removeAddon(props.addOn);
    }

    return (
        <div className='row menu_item_addon'>
            <div className='col-6'>
                {props.addOn.name}
            </div>
            <div className='col-4'>
                ${props.addOn.price.toFixed(2)}
            </div>
            <div className='col-2'>
                <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={removeMe}
                    >X</button>
            </div>
        </div>
    )
}