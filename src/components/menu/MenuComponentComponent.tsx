import React from 'react';
import MenuItemComponent from "../../models/MenuItemComponentModel";
import MenuItem from "../../models/MenuItemModel";
import { useHistory } from 'react-router-dom';
import Recipe from "../../models/RecipeModel";

interface Props {
    menuItemComponent: MenuItemComponent,
    deleteComponent: (component: MenuItemComponent) => void
}

export const MenuComponentComponent = (props: Props): React.ReactElement => {
    const history = useHistory();

    return(
        <div className='row menu_component mt-2'>
            <div className='col-12'>
                {
                    props.menuItemComponent.is_add_on ?
                        props.menuItemComponent.add_on_name
                        :
                        (props.menuItemComponent.recipe as Recipe).name
                }
                <button
                    className='btn btn-sm btn-outline-danger float-right'
                    onClick={() => props.deleteComponent(props.menuItemComponent)}
                    >X</button>
                <button
                    className='btn btn-sm btn-outline-primary float-right mr-2'
                    onClick={() => history.push({pathname: `/dashboard/recipe/edit/${(props.menuItemComponent.recipe as Recipe).id}`})}
                    >goto recipe</button>
            </div>
            {props.menuItemComponent.is_add_on &&
                <div className='col-12'>
                    recipe: {(props.menuItemComponent.recipe as Recipe).name}
                    &nbsp;&nbsp;&nbsp;price: {props.menuItemComponent.add_on_price}
                </div>
            }
        </div>
    )
}