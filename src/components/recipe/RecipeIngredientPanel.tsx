import React, {ChangeEvent, Fragment, useState} from 'react';
import RecipeIngredient, {INGREDIENT_UNIT} from "../../models/RecipeIngredientModel";
import Ingredient from "../../models/IngredientModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import recipeIngredientService from '../../services/RecipeIngredientService';
import RecipeHelper from "../../helpers/RecipeHelper";

interface Props {
    recipeIngredient: RecipeIngredient,
    removeIngredient: (id: number) => void,
    servings: number,
    scale_to: number
}

export const RecipeIngredientPanel = (props: Props): React.ReactElement => {
    const [recipeIngredient, setRecipeIngredient] = useState(props.recipeIngredient);
    const [saving, setSaving] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [deleteing, setDeleting] = useState(false);

    const deleteMe = (): void => {
        if (!window.confirm('are you sure you want to delete this ingredient?')) return;

        setDeleting(true);

        recipeIngredientService.delete(recipeIngredient.id)
            .then(() => props.removeIngredient(recipeIngredient.id))
            .catch(() => window.alert('unable to delete ingredient'))
    }

    const save = (): void => {
        setSaving(true);
        recipeIngredientService.update<RecipeIngredient>({...recipeIngredient, ingredient: (recipeIngredient.ingredient as Ingredient).id})
            .then((rec: RecipeIngredient) => {
                setRecipeIngredient(rec);
                setSaving(false);
                setUpdated(false);
            })
    }


    return (
        <div className='row recipe_ingredient_panel'>
            <div className='col-12 recipe_ingredient_panel__name'>
                {(props.recipeIngredient.ingredient as Ingredient).name}
                <hr/>
            </div>
            <div className='col-12'>
                {props.scale_to === 0 &&
                    <div className='row'>
                        <div className='col-4'>
                            <input
                                type='number'
                                placeholder='qty'
                                className='form-control'
                                value={recipeIngredient.quantity || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setRecipeIngredient({...recipeIngredient, quantity: parseFloat(e.target.value)});
                                    setUpdated(true);
                                }}
                                />
                        </div>
                        <div className='col-4'>
                            <select
                                className='form-control'
                                value={recipeIngredient.unit}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setRecipeIngredient({...recipeIngredient, unit: parseInt(e.target.value)});
                                    setUpdated(true);
                                }}
                            >
                                {
                                    INGREDIENT_UNIT.map((unit: string, index: number) =>
                                        <option value={index} key={`opt_${unit}`}>{unit}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div className='col-2'>
                            <LoadingIconButton
                                btnClass={`btn btn-outline-${updated ? 'success' : 'secondary'}`}
                                label='save'
                                onClick={save}
                                busy={saving}
                                disabled={!updated}
                                />
                        </div>
                        <div className='col-2'>
                            <LoadingIconButton
                                btnClass={`btn btn-outline-danger`}
                                label='X'
                                onClick={deleteMe}
                                busy={false}
                                disabled={saving}
                                />
                        </div>
                    </div>
                }
                {props.scale_to > 0 &&
                    <div className='row'>
                        <div className='col-12'>
                            {
                                RecipeHelper.scaleRecipeIngredient(recipeIngredient, props.servings, props.scale_to)
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}