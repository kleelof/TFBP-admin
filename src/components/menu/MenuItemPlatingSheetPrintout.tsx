import React from "react";
import MenuItem from "../../models/MenuItemModel";
import './menu.scss';
import MomentHelper from "../../helpers/MomentHelper";
import MenuItemAddOn from "../../models/MenuItemAddOnModel";
import { Fragment } from "react";
import MenuItemComponent from "../../models/MenuItemComponentModel";
import {INGREDIENT_UNIT} from "../../models/RecipeIngredientModel";

interface Props {
    menuItem: MenuItem
}

export const MenuItemPlatingSheetPrintout = (props: Props): React.ReactElement => {

    return (
        <div className='plating_sheet'>
            <div className='plating_sheet__title'>
                {props.menuItem.name}
            </div>
            <div className='plating_sheet__date'>
                {MomentHelper.asShortDateTime(new Date())}
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>component</th>
                        <th>quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {props.menuItem.add_ons.length > 0 &&
                        <Fragment>
                            <tr>
                                <td colSpan={2}><h5>add-ons</h5></td>
                            </tr>
                            {
                                props.menuItem.add_ons.map((component: MenuItemComponent | MenuItemAddOn) =>
                                    <tr>
                                        <td>{(component as MenuItemAddOn).name}</td>
                                        <td>
                                            {`${component.quantity} ${INGREDIENT_UNIT[component.unit]}`}
                                        </td>
                                    </tr>
                                )
                            }
                        </Fragment>
                    }
                    {props.menuItem.components.length > 0 &&
                        <Fragment>
                            <tr>
                                <td colSpan={2}><h5>components</h5></td>
                            </tr>
                            {
                                props.menuItem.components.map((component: MenuItemComponent | MenuItemAddOn) =>
                                    <tr key={`mic_${component.id}`}>
                                        <td>
                                            {
                                                component.ingredient != null ?
                                                    component.ingredient.name
                                                    :
                                                    component.recipe!.name
                                            }
                                        </td>
                                        <td>
                                            {`${component.quantity} ${INGREDIENT_UNIT[component.unit]}`}
                                        </td>
                                    </tr>
                                )
                            }
                        </Fragment>
                    }
                </tbody>
            </table>


        </div>
    )
}