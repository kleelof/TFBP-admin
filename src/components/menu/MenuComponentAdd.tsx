/*
    Handles adding and editing MenuItemComponent
 */
import React, {ChangeEvent, useState, Fragment} from 'react';
import SearchWidget from "../widgets/searchWidget/SearchWidget";
import recipeService from '../../services/RecipeService';
import Recipe from "../../models/RecipeModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import menuItemComponentService from '../../services/MenuItemComponentService';
import MenuItemComponent from "../../models/MenuItemComponentModel";
import MenuItem from "../../models/MenuItemModel";

interface Props {
    menuItem: MenuItem
    addComponent: (component: MenuItemComponent) => void
}

export const MenuComponentAdd = (props: Props): React.ReactElement => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isAddOn, setIsAddOn] = useState(false);
    const [addOnPrice, setAddOnPrice] = useState(0);
    const [addOnName, setAddOnName] = useState('');
    const [saving, setSaving] = useState(false);

    const save = (): void => {
        setSaving(true);

        menuItemComponentService.add<MenuItemComponent>(new MenuItemComponent(-1, selectedRecipe?.id, props.menuItem.id, isAddOn, addOnPrice, addOnName))
            .then((menuItemComponent: MenuItemComponent) => props.addComponent(menuItemComponent))
            .catch(() => window.alert('unable to add component'))
            .then(() => setSaving(false))
    }

    let canSave: boolean =
        (selectedRecipe !== null && typeof selectedRecipe !== 'string') &&
        (!isAddOn || (isAddOn && addOnName !== ''))

    return(
        <fieldset disabled={saving}>
        <div className='row menu_component_add'>
            <div className='col-12'>
                <h5 className='float-left'>add component</h5>
                <LoadingIconButton
                    outerClass='float-right'
                    btnClass={`btn btn-sm btn-outline-${canSave ? 'success' : 'secondary'}`}
                    label='save'
                    disabled={!canSave}
                    onClick={save}
                    busy={saving}
                    />
            </div>
            <div className='col-12 mt-2'>
                <SearchWidget
                    service={recipeService}
                    itemSelected={(recipe: Recipe) => setSelectedRecipe(recipe)}
                    placeholder='component recipe'
                    />
            </div>
            <div className='col-12 mt-2'>
                <div className='checkbox_selector'>
                    <input
                        type='checkbox'
                        checked={isAddOn}
                        onChange={() => setIsAddOn(!isAddOn)}
                        />
                    <span>is add-on</span>
                </div>
            </div>
            {isAddOn &&
                <Fragment>
                    <div className='col-6 mt-2'>
                        <h6>display name</h6>
                        <input
                            className='form-control'
                            value={addOnName}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setAddOnName(e.target.value)}
                            />
                    </div>
                    <div className='col-6 mt-2'>
                        <h6>price</h6>
                        <input
                            type='number'
                            className='form-control'
                            value={addOnPrice}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddOnPrice(parseInt(e.target.value))}
                            />
                    </div>
                </Fragment>
            }
        </div>
        </fieldset>
    )
}