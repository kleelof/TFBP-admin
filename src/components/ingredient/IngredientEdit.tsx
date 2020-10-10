import React, {ChangeEvent, useEffect, useState} from 'react';
import Allergen from "../../models/AllergenModel";
import Ingredient from "../../models/IngredientModel";
import allergenService from '../../services/AllergenService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import ingredientService from '../../services/IngredientService';
import { useParams, useHistory } from 'react-router-dom';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";

export const IngredientEdit = (): React.ReactElement => {
    const params: any = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [ingredient, setIngredient] = useState(new Ingredient());
    const [updated, setUpdated] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            allergenService.get<Allergen[]>(),
            ingredientService.get<Ingredient>(params.id)
        ])
            .then((values: any) => {
                setAllergens(values[0]);
                setIngredient(values[1]);
                setLoading(false);
            })
            .catch(() => window.alert('unable to load data'))
    }, [])

    const save = (): void => {
        setSaving(true);
        ingredientService.update(ingredient.id, ingredient)
            .then((ingredient: Ingredient) => history.goBack())
    }

    if (loading)
        return <LoadingOverlay />

    return (
        <div className='row ingredient_edit'>
            <div className='col-12'>
                <h3>edit ingredient</h3>
                <hr/>
            </div>
            <div className='col-12'>
                <button
                    className='btn btn-sm btn-outline-info float-left'
                    onClick={() => history.goBack()}
                    >back</button>
                <LoadingIconButton
                    btnClass={`btn btn-sm btn-outline-${updated ? 'success' : 'secondary'} float-right`}
                    outerClass='float-right'
                    label='save'
                    onClick={save}
                    busy={saving}
                    disabled={!updated}
                    />
            </div>
            <div className='col-12'>
                <hr/>
            </div>
            <div className='col-12 col-md-6 mb-2'>
                <h5>name</h5>
                <input
                    className='form-control'
                    type='text'
                    value={ingredient.name}
                    onChange={(e:ChangeEvent<HTMLInputElement>) => {
                        setUpdated(true);
                        setIngredient({...ingredient, name: e.target.value})
                    }}
                    />
            </div>
            <div className='col-12 col-md-6 mp-2'>
                <h5>allergens</h5>
                {
                    allergens.map((allergen: Allergen) =>
                        <div className='allergens__allergen_select'>
                            <input
                                type='checkbox'
                                checked={ingredient.allergens_ids.indexOf(allergen.id) > -1}
                                onClick={() => {
                                    let allergens: number[] = ingredient.allergens_ids;
                                    if (allergens.indexOf(allergen.id) > -1 ) {
                                        allergens = allergens.filter((al: number) => al !== allergen.id)
                                    } else {
                                        allergens.push(allergen.id);
                                    }
                                    setIngredient({...ingredient, allergens_ids: allergens});
                                    setUpdated(true);
                                }}
                                />
                            <span>{allergen.name}</span>
                        </div>
                    )
                }
            </div>
            <div className='col-12'>
                <h5>description</h5>
                <textarea
                    className='form-control'
                    value={ingredient.description}
                    onChange={(e:ChangeEvent<HTMLTextAreaElement>) => {
                        setUpdated(true);
                        setIngredient({...ingredient, description: e.target.value})
                    }}
                    />
            </div>
        </div>
    )
}