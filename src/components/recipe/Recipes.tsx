import React, {useEffect, useState} from 'react';
import recipeService from '../../services/RecipeService';
import Recipe from '../../models/RecipeModel';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import InputWidget from "../widgets/inputWidget/InputWidget";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {PageSelector} from "../widgets/page_selector/PageSelector";
import LoadingOverlay from "../overlays/LoadingOverlay";
import { useHistory } from 'react-router-dom';
import './recipe.scss';

export const Recipes = (): React.ReactElement => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dto, setDTO] = useState<PagedResultsDTO>(new PagedResultsDTO());
    const [newRecipe, setNewRecipe] = useState('');
    const [addingRecipe, setAddingRecipe] = useState(false);

    useEffect(() => {
        loadPage(1);
    }, [])

    const addRecipe = (): void => {
        setAddingRecipe(true);
        recipeService.add<Recipe>(new Recipe(newRecipe))
            .then((recipe: Recipe) => history.push({pathname: `/dashboard/recipe/edit/${recipe.id}`}))
            .catch(() => window.alert('unable to create recipe'))
            .then(() => setAddingRecipe(false))
    }

    const loadPage = (pageNumber: number, searchPattern?: string): void => {
        setLoading(true);
        setCurrentPage(pageNumber);

        recipeService.pagedSearchResults(pageNumber, searchPattern)
            .then((dto: PagedResultsDTO) => setDTO(dto))
            .catch(() => window.alert('unable to load recipes'))
            .then(() => setLoading(false))
    }

    return (
        <div className='row recipes'>
            <div className='col-12'>
                <h3>recipes</h3>
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
                                setNewRecipe(searchPattern);
                                loadPage(1, searchPattern)
                            }}
                            />
                    </div>
                    <div className='col-2'>
                        <LoadingIconButton
                            label={'add'}
                            onClick={addRecipe}
                            busy={addingRecipe}
                            disabled={addingRecipe || newRecipe.length === 0}
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
                        add recipes for your menu items
                    </div>
                }
                {(!loading && dto.results.length > 0) &&
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>vegan</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            (dto.results as Recipe[]).map((recipe: Recipe) =>
                                <tr
                                    key={`recipe_list_${recipe.id}`}
                                    className='recipes__recipe'
                                    onClick={() => history.push({pathname: `/dashboard/recipe/edit/${recipe.id}`})}
                                >
                                    <td>{recipe.name}</td>
                                    <td>
                                        {
                                            recipe.is_vegan ? 'yes' : 'no'
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

