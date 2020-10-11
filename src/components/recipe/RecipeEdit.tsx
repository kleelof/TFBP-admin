import React, {ChangeEvent, useEffect, useState, Fragment} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import LoadingOverlay from "../overlays/LoadingOverlay";
import recipeService from '../../services/RecipeService';
import Recipe from "../../models/RecipeModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import ingredientService from '../../services/IngredientService';
import SearchWidget from "../widgets/searchWidget/SearchWidget";
import Ingredient from "../../models/IngredientModel";
import RecipeIngredient, {INGREDIENT_UNIT} from "../../models/RecipeIngredientModel";
import printIcon from '../../assets/print_icon.png';
import {RecipeIngredientPanel} from "./RecipeIngredientPanel";
import {RecipePrintout} from "./RecipePrintout";


export const RecipeEdit = (): React.ReactElement => {
    const params: any = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(new Recipe());
    const [updated, setUpdated] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newIngredient, setNewIngredient] = useState(new Ingredient());
    const [qty, setQty] = useState(0);
    const [unit, setUnit] = useState(0);
    const [addingIngredient, setAddingIngredient] = useState(false);
    const [isNewIngredient, setIsNewIngredient] = useState(false);
    const [creatingIngredient, setCreatingIngredient] = useState(false);
    const [showScaling, setShowScaling] = useState(false);
    const [scale, setScale] = useState(1);
    const [documentToPrint, setDocumentToPrint] = useState<any>('');

    //let documentToPrint: any = '';

    useEffect(() => {
        recipeService.get<Recipe>(params.id)
            .then((recipe: Recipe) => setRecipe(recipe))
            .catch(() => {
                window.alert('unable to load recipe');
                history.goBack();
            })
            .then(() => setLoading(false))
    }, [])

    const addIngredient = (): void => {
        setAddingIngredient(true);

        recipeService.attachIngredient(
            recipe,
            new RecipeIngredient(qty, unit, 1, newIngredient.id, recipe.id)
        )
            .then((recipeIngredient: RecipeIngredient) =>
                setRecipe({...recipe, ingredients: [recipeIngredient, ...recipe.ingredients]}))
            .catch(() => window.alert('unable to add ingredient to recipe'))
            .then(() => setAddingIngredient(false))
    }

    const addIngredientToDb = (): void => {
        setCreatingIngredient(true);

        ingredientService.add<Ingredient>(newIngredient)
            .then((ingredient: Ingredient) => history.push({pathname: `/dashboard/ingredient/edit/${ingredient.id}`}))
            .catch(() => window.alert('unable to add new ingredient to database'))
            .then(() => setCreatingIngredient(false))
    }

    function printRecipe(): void {
        setDocumentToPrint(
            <RecipePrintout
                recipe={recipe}
                count={
                    showScaling ? scale : recipe.servings
                } />);
        setTimeout(function () {
            window.print();
        }, 500);
    }

    const removeIngredient = (id: number): void => {
        setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.filter((ing: RecipeIngredient) => ing.id !== id)
        })
    }

    const save = (): void => {
        setSaving(true);

        recipeService.update<Recipe>(recipe)
            .then((r: Recipe) => {
                setRecipe(r);
                setUpdated(false);
            })
            .catch(() => window.alert('unable to update recipe'))
            .then(() => setSaving(false))
    }

    const handleSearchResult = (searchResult: Ingredient | string): void => {
        if (typeof searchResult === 'string') {
            setIsNewIngredient(true);
            setNewIngredient(new Ingredient(searchResult));
        } else {
            setIsNewIngredient(false);
            setNewIngredient(searchResult);
        }
    }

    if (loading)
        return (<LoadingOverlay />)

    const canAddIngredient: boolean = newIngredient.id !== -1 && qty > 0

    return (
        <Fragment>
            <div className='row recipe_edit'>
                <div className='col-12'>
                    <h3>edit recipe</h3>
                    <hr/>
                </div>
                <div className='col-12 align-self-center'>
                    <button
                        className='btn btn-sm btn-outline-info'
                        onClick={() => history.goBack()}
                        >back</button>
                    <img
                        className='recipe_scale__print float-right ml-2 d-none d-md-block'
                        src={printIcon}
                        alt='print scaled recipe'
                        onClick={printRecipe}
                    />
                    <button
                        className={`btn btn-sm btn-outline-${showScaling ? 'danger' : 'primary'} float-right ml-2`}
                        onClick={() => setShowScaling(!showScaling)}
                    >{showScaling ? 'edit' : 'scale'}</button>
                    <button
                        className='btn btn-sm btn-outline-primary float-right'
                        onClick={() => history.push({pathname: `/dashboard/recipe/notes/${recipe.id}`})}
                        >notes {recipe.notes.length > 0 ? `: ${recipe.notes.length}` : ''}</button>
                    <LoadingIconButton
                        btnClass={`btn btn-sm btn-outline-${updated ? 'success' : 'secondary'}`}
                        outerClass='float-right mr-2'
                        label='save'
                        disabled={!updated}
                        onClick={save}
                        busy={saving}
                        />
                </div>
                <div className='col-12'>
                    <hr/>
                </div>
                <div className='col-12 col-md-6'>
                    <h5>name</h5>
                    <input
                        className='form-control'
                        type='text'
                        value={recipe.name}
                        onChange={(e:ChangeEvent<HTMLInputElement>) => {
                            setUpdated(true);
                            setRecipe({...recipe, name: e.target.value})
                        }}
                        />
                </div>
                <div className='col-12 col-md-6 mt-2'>
                    <table>
                        <tbody>
                            <tr>
                                <td>is vegan: </td>
                                <td>
                                    &nbsp;&nbsp;
                                    <input
                                        type='checkbox'
                                        checked={recipe.is_vegan}
                                        onChange={() => {
                                            setRecipe({...recipe, is_vegan: !recipe.is_vegan});
                                            setUpdated(true);
                                        }}
                                        />
                                </td>
                            </tr>
                        <tr>
                            <td>servings: </td>
                            <td>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={recipe.servings}
                                    min={1}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setRecipe({...recipe, servings: parseInt(e.target.value)});
                                        setUpdated(true);
                                    }}
                                    />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-12 col-md-6 mt-2'>
                    <h5>description</h5>
                    <textarea
                        className='form-control'
                        value={recipe.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setRecipe({...recipe, description: e.target.value});
                            setUpdated(true);
                        }}
                        />
                </div>
                <div className='col-12 col-md-6 mt-2'>
                    <h5>instructions</h5>
                    <textarea
                        className='form-control'
                        value={recipe.instructions}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setRecipe({...recipe, instructions: e.target.value});
                            setUpdated(true);
                        }}
                        />
                </div>
                <div className='col-12 mt-2'>
                    <hr/>
                    {!showScaling &&
                        <div className='row'>
                        <div className='col-12'>
                            <h5>ingredients</h5>
                        </div>
                        <div className='col-12 col-md-6'>
                            <SearchWidget
                                placeholder='ingredient name to add or create'
                                service={ingredientService}
                                itemSelected={handleSearchResult}
                                />
                        </div>
                        <div className='col-12 col-md-6 mt-2 mt-md-0'>
                            {!showScaling &&
                            <div className='row justify-content-center'>
                                {
                                    isNewIngredient ?
                                        <div>
                                            <LoadingIconButton
                                                btnClass='btn btn-sm btn-outline-success'
                                                label='add ingredient to database'
                                                onClick={addIngredientToDb}
                                                busy={creatingIngredient}
                                                />
                                        </div>
                                        :
                                        newIngredient.id === -1 ?
                                            <Fragment></Fragment>
                                            :
                                            <Fragment>
                                                <div className='col-4'>
                                                    <input
                                                        type='number'
                                                        placeholder='qty'
                                                        className='form-control'
                                                        value={qty || ''}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQty(parseFloat(e.target.value))}
                                                        />
                                                </div>
                                                <div className='col-4'>
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
                                                <div className='col-4'>
                                                    <LoadingIconButton
                                                        label='add ingredient'
                                                        btnClass={`btn btn-sm btn-outline-${canAddIngredient ? 'success' : 'secondary'}`}
                                                        onClick={addIngredient}
                                                        busy={addingIngredient}
                                                        disabled={!canAddIngredient}
                                                        />
                                                </div>
                                            </Fragment>
                                }
                            </div>
                            }
                        </div>
                    </div>
                    }
                    {showScaling &&
                        <div className='row recipe_scale'>
                            <div className='col-6 col-md-2 float-left'>
                                <h5>scale recipe</h5>
                                scaled to servings:
                                <input
                                    className='form-control'
                                    type='number'
                                    min={1}
                                    value={scale}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setScale(parseFloat(e.target.value))}
                                    />
                            </div>
                        </div>
                    }
                    <hr/>
                </div>
                <div className='col-12'>
                    <div className='row'>
                        {
                            recipe.ingredients.map((ingredient: RecipeIngredient) =>
                                <div className='col-12 col-md-4' key={`rip_${ingredient.id}`}>
                                    <RecipeIngredientPanel
                                        recipeIngredient={ingredient}
                                        removeIngredient={removeIngredient}
                                        servings={recipe.servings}
                                        scale_to={showScaling ? scale : 0}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="col-12 print-sheet">
                {documentToPrint}
            </div>
        </Fragment>
    )
}