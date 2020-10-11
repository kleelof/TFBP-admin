import React, {useEffect, useState, Fragment} from 'react';
import MenuItem from "../../models/MenuItemModel";
import MenuItemComponent from "../../models/MenuItemComponentModel";
import {MenuComponentAdd} from "./MenuComponentAdd";
import {MenuComponentComponent} from "./MenuComponentComponent";
import menuItemComponentService from '../../services/MenuItemComponentService';
import menuItemService from '../../services/MenuItemService';
import PagedResultsDTO from "../../dto/PagedResultsDTO";

interface Props {
    menuItem: MenuItem
}

export const MenuComponents = (props: Props): React.ReactElement => {
    const [components, setComponents] = useState<MenuItemComponent[]>([]);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        menuItemService.getComponents(props.menuItem)
            .then((cmpts: MenuItemComponent[]) => setComponents(cmpts))
            .catch(() => window.alert('unable to load components'))
    }, [])

    const addComponent = (menuItemComponent: MenuItemComponent): void => {
        setAdding(false);
        setComponents([menuItemComponent, ...components]);
    }

    const deleteComponent = (menuItemComponent: MenuItemComponent): void => {
        if (!window.confirm('are you sure you want to remove this component?')) return;

        menuItemComponentService.delete(menuItemComponent.id)
            .then(() => setComponents(components.filter((c: MenuItemComponent) => c.id !== menuItemComponent.id)))
            .catch(() => window.alert('unable to delete component'))
    }

    const addOns: MenuItemComponent[] = [];
    const regularComponents: MenuItemComponent[] = [];
    components.forEach((component: MenuItemComponent) => component.is_add_on ? addOns.push(component) : regularComponents.push(component))

    return (
        <div className='menu_components row'>
            <div className='col-12'>
                <h3 className='float-left'>components</h3>
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
                        addOns.map((component: MenuItemComponent) =>
                            <div className='col-12 col-md-6'>
                                <MenuComponentComponent menuItemComponent={component} deleteComponent={deleteComponent}/>
                            </div>
                        )
                    }
                </Fragment>
            }
            {regularComponents.length > 0 &&
                <Fragment>
                    <div className='col-12 menu_components__components_type mt-2'>
                        components
                    </div>
                    {
                        regularComponents.map((component: MenuItemComponent) =>
                            <div className='col-12 col-md-6'>
                                <MenuComponentComponent menuItemComponent={component} deleteComponent={deleteComponent}/>
                            </div>
                        )
                    }
                </Fragment>
            }
        </div>
    )
}