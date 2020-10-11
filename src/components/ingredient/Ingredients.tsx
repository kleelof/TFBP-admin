import React, {useEffect, useState} from 'react';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import ingredientService from '../../services/IngredientService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import Ingredient from "../../models/IngredientModel";
import Allergen from "../../models/AllergenModel";
import {PageSelector} from "../widgets/page_selector/PageSelector";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import { useHistory } from 'react-router-dom';
import InputWidget from "../widgets/inputWidget/InputWidget";
import './ingredient.scss';

export const Ingredients = (): React.ReactElement => {
    const [loading, setLoading] = useState(true);
    const [dto, setDTO] = useState<PagedResultsDTO>(new PagedResultsDTO());
    const [currentPage, setCurrentPage] = useState(1);
    const [addingIngredient, setAddingIngredient] = useState(false);
    const [newIngredient, setNewIngredient] = useState('');

    const history = useHistory();

    useEffect(() => {
        loadPage(1);
    }, [])

    const addIngredient = (): void => {
        setAddingIngredient(true);

        ingredientService.add(new Ingredient(newIngredient))
            .then((ingredient: Ingredient) => history.push({pathname: `/dashboard/ingredient/edit/${ingredient.id}`}))
            .catch(() => window.alert('unable to create ingredient'))
            .then(() => setAddingIngredient(false))
    }

    const loadPage = (page: number, searchPattern?: string): void => {
        setLoading(true);
        setCurrentPage(page);

        ingredientService.pagedSearchResults(page, searchPattern)
            .then((dto: PagedResultsDTO) => setDTO(dto))
            .catch(() => window.alert('unable to load ingredients'))
            .then(() => setLoading(false))
    }

    return (
        <div className='row ingredients'>
            <div className='col-12'>
                <h3>ingredients</h3>
                <hr/>
            </div>
            <div className='col-12'>
                <div className='row mb-2'>
                    <div className='col-10 col-md-5'>
                        <InputWidget
                            id='new_ingredient_input'
                            type='text'
                            placeholder='enter name to add or search'
                            onUpdate={(id: string, searchPattern: string) => {
                                setNewIngredient(searchPattern);
                                loadPage(1, searchPattern)
                            }}
                            />
                    </div>
                    <div className='col-2'>
                        <LoadingIconButton
                            label={'add'}
                            onClick={addIngredient}
                            busy={addingIngredient}
                            disabled={addingIngredient || newIngredient.length === 0}
                            btnClass='btn btn-sm btn-outline-success'
                            />
                    </div>
                </div>
            </div>
            <div className='col-12 text-right'>
                <PageSelector
                    numItems={dto.count}
                    currentPage={currentPage}
                    gotoPage={loadPage}
                    />
            </div>
            <div className='col-12'>
                {loading &&
                    <LoadingOverlay />
                }
                {(!loading && dto.results.length === 0) &&
                    <div>
                        <hr/>
                        add ingredients for your recipes
                    </div>
                }
                {(!loading && dto.results.length > 0) &&
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>allergens</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            (dto.results as Ingredient[]).map((ingredient: Ingredient) =>
                                <tr
                                    key={`ingredient_${ingredient.id}`}
                                    className='ingredients__ingredient'
                                    onClick={() => history.push({pathname: `/dashboard/ingredient/edit/${ingredient.id}`})}
                                >
                                    <td>{ingredient.name}</td>
                                    <td>
                                        {
                                            (ingredient.allergens as Allergen[]).map((allergen: Allergen, index: number) =>
                                                `${allergen.name}${index < ingredient.allergens.length -1 ? ', ' : ''}`
                                            )
                                        }
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}