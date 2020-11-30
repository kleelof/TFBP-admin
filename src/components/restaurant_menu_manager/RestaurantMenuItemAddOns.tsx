import React, {ChangeEvent, useState} from 'react';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import menuItemService from '../../services/MenuItemService';
import MenuItem from "../../models/MenuItemModel";
import AttachComponentDTO from "../../dto/AttachComponentDTO";
import MenuItemComponent from "../../models/MenuItemComponentModel";
import MenuItemAddOn from "../../models/MenuItemAddOnModel";
import {RestaurantMenuItemAddOn} from "./RestaurantMenuItemAddOn";

interface Props {
    menuItem: MenuItem
}

export const RestaurantMenuItemAddOns = (props: Props): React.ReactElement => {

    const [addOnName, setAddOnName] = useState('');
    const [addOnPrice, setAddOnPrice] = useState(0);
    const [creatingAddon, setCreatingAddon] = useState(false);
    const [addOns, setAddons] = useState(props.menuItem.add_ons)

    const createAddon = (): void => {
        setCreatingAddon(true);
        menuItemService.attachComponent(
            props.menuItem,
            new AttachComponentDTO( 'name', 0, 0, 0, true, addOnName, addOnPrice)
        )
            .then((menuItemComponent: any) => {
                setAddons([...addOns, menuItemComponent])
            })
            .catch( err => window.alert('unable to add addon'))
            .then(() => {
                setCreatingAddon(false);
                setAddOnPrice(0);
                setAddOnName('');
            })
    }

    const removeAddon = (addOn: MenuItemAddOn): void => {
        menuItemService.deleteComponent(props.menuItem, addOn.id, true)
            .then(() => setAddons(addOns.filter((ao: MenuItemAddOn) => ao.id !== addOn.id)))
            .catch( err => window.alert('unable to  remove addon'))
    }

    return (
        <div className='row menu_item_addons'>
            <div className='col-12'>
                <h4 className='float-left'>add-ons</h4>
            </div>
            <div className='col-6'>
                <input
                    name='addon_name'
                    className='form-control'
                    placeholder='add-on name'
                    value={addOnName}
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setAddOnName(e.target.value)}
                    />
            </div>
            <div className='col-3'>
                <input
                    value={addOnPrice}
                    className='form-control'
                    type='number'
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setAddOnPrice(parseFloat(e.target.value))}
                    />
            </div>
            <div className='col-2'>
                <LoadingIconButton
                    label='+'
                    btnClass='btn btn-sm btn-outline-success'
                    disabled={addOnName.length === 0}
                    onClick={createAddon}
                    busy={creatingAddon}
                    />
            </div>
            {
                addOns.map((addOn: MenuItemAddOn) =>
                    <div className='col-12 col-md-3 mt-2'>
                        <RestaurantMenuItemAddOn
                            addOn={addOn}
                            removeAddon={removeAddon}
                        />
                    </div>
                )
            }
        </div>
    )
}