import React, {ChangeEvent, Fragment, useState} from 'react';
import RecipeIngredient, {INGREDIENT_UNIT} from "../../models/RecipeIngredientModel";
import Ingredient from "../../models/IngredientModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import recipeIngredientService from '../../services/RecipeIngredientService';
import RecipeHelper from "../../helpers/RecipeHelper";
import { useHistory } from 'react-router-dom';

interface Props {
    recipeIngredient: RecipeIngredient,
    removeIngredient: (id: number) => void,
    servings: number,
    scale_to: number,
    yield: number
}

export const RecipeIngredientPanel = (props: Props): React.ReactElement => {
    const history = useHistory();
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
        <div className='row recipe_edit__ingredient'>
            <div className='col-12 col-md-4 ingredient__title'>
                {(props.recipeIngredient.ingredient as Ingredient).name}
            </div>

            {props.scale_to === 0 &&
                <div className='col-12 col-md-8'>
                    <div className='row'>
                        <div className='col-12 col-md-3'>
                            <input
                                type='number'
                                placeholder='qty'
                                className='form-control col-4 float-left'
                                value={recipeIngredient.quantity || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setRecipeIngredient({...recipeIngredient, quantity: parseFloat(e.target.value)});
                                    setUpdated(true);
                                }}
                                />
                            <select
                                className='form-control col-4 float-left ml-2'
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
                        <div className='col-12 col-md-3 ingredient__allergens'>
                            <strong>allergens:&nbsp;</strong>
                            { RecipeHelper.createStringListOfAllergensFromIngredient(props.recipeIngredient.ingredient as Ingredient)}
                        </div>
                        <div className='col-12 col-md-6 mt-2 mt-md-0 text-center'>
                            <LoadingIconButton
                                btnClass={`btn btn-${updated ? 'success' : 'outline-secondary'}`}
                                label='save'
                                onClick={save}
                                busy={saving}
                                disabled={!updated}
                                />
                            <LoadingIconButton
                                outerClass='ml-2'
                                btnClass={`btn btn-outline-danger`}
                                label='X'
                                onClick={deleteMe}
                                busy={false}
                                disabled={saving}
                                />
                            <button
                                className='btn btn-sm btn-outline-primary ml-2'
                                onClick={() => history.push({pathname: `/dashboard/ingredient/edit/${(props.recipeIngredient.ingredient as Ingredient).id}`})}
                                >goto ingredient</button>
                        </div>
                    </div>
                </div>
            }
            {props.scale_to > 0 &&
                <div className='col-12 col-md-6'>
                    {
                        RecipeHelper.scaleRecipeIngredient(recipeIngredient, props.servings, props.scale_to, props.yield)
                    }
                    <span className='ml-5'>
                        <strong>allergens:&nbsp;</strong>
                        { RecipeHelper.createStringListOfAllergensFromIngredient(props.recipeIngredient.ingredient as Ingredient)}
                    </span>
                </div>
            }
        </div>
    )
}