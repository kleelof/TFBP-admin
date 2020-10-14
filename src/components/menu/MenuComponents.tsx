import React, {useEffect, useState, Fragment} from 'react';
import MenuItem from "../../models/MenuItemModel";
import MenuItemComponent from "../../models/MenuItemComponentModel";
import {MenuComponentAdd} from "./MenuComponentAdd";
import {MenuComponentComponent} from "./MenuComponentComponent";
import menuItemComponentService from '../../services/MenuItemComponentService';
import menuItemService from '../../services/MenuItemService';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import MenuItemAddOnModel from "../../models/MenuItemAddOnModel";
import MenuItemAddOn from "../../models/MenuItemAddOnModel";
import {PrintButton} from "../widgets/print_button/PrintButton";
import {RecipePrintout} from "../recipe/RecipePrintout";
import {MenuItemPlatingSheetPrintout} from "./MenuItemPlatingSheetPrintout";

interface Props {
    menuItem: MenuItem
}

export const MenuComponents = (props: Props): React.ReactElement => {
    const [components, setComponents] = useState(props.menuItem.components);
    const [addOns, setAddOns] = useState(props.menuItem.add_ons)
    const [adding, setAdding] = useState(false);
    const [documentToPrint, setDocumentToPrint] = useState<any>('');

    let menuItem: MenuItem = props.menuItem;

    const addComponent = (component: MenuItemComponent | MenuItemAddOn): void => {
        setAdding(false);
        if ('price' in component) {
            menuItem.add_ons = [component, ...addOns]
            setAddOns(menuItem.add_ons);
        } else {
            menuItem.components = [component, ...components]
            setComponents(menuItem.components);
        }

    }

    const deleteComponent = (item: MenuItemComponent | MenuItemAddOn): void => {
        const isAddon: boolean = 'price' in item;
        console.log(item)
        if (!window.confirm(`are you sure you want to remove this ${isAddon ? 'add-on' : 'component'}?`)) return;

        menuItemService.deleteComponent(props.menuItem, item.id, isAddon)
            .then(() => {
                if (isAddon) {
                    menuItem.add_ons = addOns.filter((c: MenuItemAddOn) => c.id !== item.id);
                    setAddOns(menuItem.add_ons);
                } else {
                    menuItem.components = components.filter((c: MenuItemComponent) => c.id !== item.id);
                    setComponents(menuItem.components);
                }
            })
            .catch(() => window.alert('unable to delete component'))
    }

    function printPlatingSheet(): void {
        setDocumentToPrint(
            <MenuItemPlatingSheetPrintout
                menuItem={props.menuItem}
            />);
        setTimeout(function () {
            window.print();
        }, 500);
    }

    return (
        <Fragment>
            <div className='menu_components row'>
                <div className='col-12'>
                    <h3 className='float-left'>components</h3>
                    <div className='d-none d-md-block float-right'
                         onClick={printPlatingSheet}
                    >
                        <PrintButton prompt='sheet'/>
                    </div>
                    <button
                        className={`btn btn-sm btn-outline-${adding ? 'warning' : 'primary'} float-right`}
                        onClick={() => setAdding(!adding)}
                        >{adding ? 'cancel ' : ''}add</button>
                </div>
                <div className='col-12'>
                    <hr/>
                </div>
                {adding &&
                    <div className='col-12'>
                        <MenuComponentAdd menuItem={props.menuItem} addComponent={addComponent}/>
                        <hr/>
                    </div>
                }
                {addOns.length > 0 &&
                    <Fragment>
                        <div className='col-12 menu_components__components_type'>
                            add-ons
                        </div>
                        {
                            addOns.map((addOn: MenuItemAddOn) =>
                                <div className='col-12 col-md-6' key={`addon_${Math.random()}`}>
                                    <MenuComponentComponent item={addOn} deleteComponent={deleteComponent}/>
                                </div>
                            )
                        }
                    </Fragment>
                }
                {components.length > 0 &&
                    <Fragment>
                        <div className='col-12 menu_components__components_type mt-2'>
                            components
                        </div>
                        {
                            components.map((component: MenuItemComponent) =>
                                <div className='col-12 col-md-6' key={`comp_${Math.random()}`}>
                                    <MenuComponentComponent item={component} deleteComponent={deleteComponent}/>
                                </div>
                            )
                        }
                    </Fragment>
                }
            </div>
            <div className="print-sheet">
                {documentToPrint}
            </div>
        </Fragment>
    )
}