import React, { Fragment } from 'react';
import MenuItemComponent from "../../models/MenuItemComponentModel";
import { useHistory } from 'react-router-dom';
import {INGREDIENT_UNIT} from "../../models/RecipeIngredientModel";
import MenuItemAddOn from "../../models/MenuItemAddOnModel";
import Allergen from "../../models/AllergenModel";
import recipeHelper from '../../helpers/RecipeHelper';

interface Props {
    item: MenuItemComponent | MenuItemAddOn,
    deleteComponent: (component: MenuItemComponent | MenuItemAddOn) => void
}

export const MenuComponentComponent = (props: Props): React.ReactElement => {
    const history = useHistory();

    const allergens: string[] = recipeHelper.extractAllergensFromMenuItemComponent(props.item);

    return(
        <div className='row menu_component mt-2'>
            <div className='col-12 menu_component__title'>
                {
                    'price' in props.item ?
                        props.item.name
                        :
                        props.item.ingredient ?
                            props.item.ingredient.name
                            :
                            props.item.recipe!.name
                }
            </div>
            <div className='col-12 menu_component__portion'>
                {`${props.item.quantity} ${INGREDIENT_UNIT[props.item.unit]}`}
            </div>
            <div className='col-12'>
                {
                    props.item.ingredient ?
                        <Fragment><strong>ingredient:</strong> {props.item.ingredient.name}</Fragment>
                        :
                        props.item.recipe ?
                            <Fragment><strong>recipe:</strong> {props.item.recipe.name}</Fragment>
                            : ""

                }
                {
                    'price' in props.item ?
                        <Fragment>&nbsp;&nbsp;&nbsp;<strong>price:</strong> {props.item.price}</Fragment>
                        :''
                }
            </div>
            {allergens.length > 0 ?
                <div className='col-12 menu_component__allergens'>
                    <strong>allergens: </strong>
                    {
                        allergens.map((allergen: string, index: number) =>
                            allergen + ((index < allergens.length - 1) ? ',' : '')
                        )
                    }
                </div>
                :
                <div>&nbsp;</div>
            }
            <div className='col-12 mt-2'>
                <button
                    className='btn btn-sm btn-outline-danger float-right'
                    onClick={() => props.deleteComponent(props.item)}
                    >X</button>

                {(props.item.ingredient != null || props.item.recipe != null) &&
                    <button
                        className='btn btn-sm btn-outline-primary float-right mr-2'
                        onClick={() => history.push(
                            {pathname: `/dashboard/${props.item.ingredient ? 'ingredient' : 'recipe'}/edit/${props.item.ingredient ? props.item.ingredient.id : props.item.recipe!.id}`}
                            )}
                        >
                        {
                            props.item.ingredient ?
                                <Fragment>goto ingredient</Fragment>
                                :
                                props.item.recipe ?
                                    <Fragment>goto recipe</Fragment>
                                    : ""
                        }
                    </button>
                }
            </div>
        </div>
    )
}