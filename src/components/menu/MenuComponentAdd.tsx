/*
    Handles adding and editing MenuItemComponent
 */
import React, {ChangeEvent, useState, Fragment} from 'react';
import Recipe from "../../models/RecipeModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import MenuItemComponent from "../../models/MenuItemComponentModel";
import menuItemService from '../../services/MenuItemService';
import MenuItem from "../../models/MenuItemModel";
import SearchRecipesAndIngredientsDTO from "../../dto/SearchRecipesAndIngredientsDTO";
import RecipeAndIngredientSearcher from "./RecipeAndIngredientSearcher";
import AttachComponentDTO from "../../dto/AttachComponentDTO";
import {INGREDIENT_UNIT} from "../../models/RecipeIngredientModel";

interface Props {
    menuItem: MenuItem
    addComponent: (component: MenuItemComponent) => void
}

export const MenuComponentAdd = (props: Props): React.ReactElement => {
    const [selectedItem, setSelectedItem] = useState<SearchRecipesAndIngredientsDTO | string | null>(null);
    const [isAddOn, setIsAddOn] = useState(false);
    const [addOnPrice, setAddOnPrice] = useState(0);
    const [addOnName, setAddOnName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState(0);
    const [saving, setSaving] = useState(false);
    const [nameOnly, setNameOnly] = useState(false);

    const save = (): void => {
        setSaving(true);

        menuItemService.attachComponent(
            props.menuItem,
            new AttachComponentDTO(
                (selectedItem as SearchRecipesAndIngredientsDTO).type,
                (selectedItem as SearchRecipesAndIngredientsDTO).item.id,
                quantity, unit, isAddOn, addOnName, addOnPrice
                ))
            .then((menuItemComponent: MenuItemComponent) => props.addComponent(menuItemComponent))
            .catch(() => window.alert('unable to add component'))
            .then(() => setSaving(false))
    }

    let canSave: boolean =
        ((selectedItem !== null && typeof selectedItem !== 'string') &&
        (!isAddOn || (isAddOn && addOnName !== ''))) ||
        isAddOn && nameOnly

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
                    <RecipeAndIngredientSearcher
                        itemSelected={(item: SearchRecipesAndIngredientsDTO) => setSelectedItem(item)}
                        disabled={isAddOn && nameOnly}
                    />
                </div>
                <div className='col-12'>
                    <fieldset disabled={saving || nameOnly}>
                            <div className='row'>
                                <div className='col-6 col-md-2 mt-2'>
                                    <h6>quantity</h6>
                                    <input
                                        type='number'
                                        className='form-control'
                                        value={quantity}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(parseFloat(e.target.value))}
                                        />
                                </div>
                                <div className='col-6 col-md-2 mt-2'>
                                    <h6>unit</h6>
                                    <select
                                        className='form-control'
                                        value={unit}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setUnit(parseInt(e.target.value))}
                                    >
                                        {
                                            INGREDIENT_UNIT.map((unit: string, index: number) =>
                                                <option value={index} key={`opt_${unit}`}>{unit}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                    </fieldset>
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
                        <div className='col-12 mt-2'>
                            <div className='checkbox_selector'>
                                <input
                                    type='checkbox'
                                    checked={nameOnly}
                                    onChange={() => setNameOnly(!nameOnly)}
                                    />
                                <span>name only</span>
                            </div>
                        </div>
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
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setAddOnPrice(parseFloat(e.target.value))}
                                />
                        </div>
                    </Fragment>
                }
            </div>
        </fieldset>
    )
}