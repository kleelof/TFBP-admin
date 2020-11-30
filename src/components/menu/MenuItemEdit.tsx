import React, { Fragment } from 'react';

import { connect } from 'react-redux';

import MenuItem, {MenuItemDTO} from '../../models/MenuItemModel';
import menuItemService from '../../services/MenuItemService';
import ImageUploader from '../widgets/imageUploader/ImageUploader';
import {RouteComponentProps} from 'react-router-dom';

import './menu.scss';
import LoadingOverlay from '../overlays/LoadingOverlay';
import {config} from "../../config";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {MenuComponents} from "./MenuComponents";
import {OperatorState} from "../../store/operatorReducer";
import {AppState} from "../../store/store";
import {OPERATOR_TYPES} from '../../models/OperatorModel';
import {MenuCategory} from "../../models/MenuCategoryModel";
import menuCategoryService from '../../services/MenuCategoryService';
import {SPICINESS_CHOICES} from "../../models/MenuItemModel";
import { RestaurantMenuItemAddOns } from '../restaurant_menu_manager/RestaurantMenuItemAddOns';

interface Props extends RouteComponentProps {
    match: any;
}

interface LinkStateProps {
    operator: OperatorState
}

interface State {
    menuItem: MenuItemDTO,
    loaded: boolean,
    saving: boolean,
    viewingServings: boolean,
    hasBeenUpdated: boolean,
    menuCategories: MenuCategory[]
}

export enum ItemModes {
    add,
    edit,
    view,
    deliveryDay
}

class MenuItemEdit extends React.Component<Props & LinkStateProps, State> {

    private temporaryImage: File | null = null;

    state = {
        menuItem: new MenuItem(),
        loaded: false,
        saving: false,
        viewingServings: false,
        hasBeenUpdated: false,
        menuCategories: []
    } 

    private allergenSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let menuItem: MenuItemDTO = this.state.menuItem;
        menuItem.allergens = this.checkboxesToString(menuItem.allergens, e.target.id)
        this.setState({menuItem, hasBeenUpdated: true});
    }

    public componentDidMount = (): void => {
        const { match: { params } } = this.props;

        menuItemService.get<MenuItem>(params.id)
            .then((menuItem: MenuItem) => {
                this.setState({menuItem, loaded: true})
            })
            .catch( err => window.alert('Unable to load menu item'))

        if (this.props.operator.settings?.type === OPERATOR_TYPES.restaurant) {
            menuCategoryService.get<MenuCategory[]>()
                .then((menuCategories: MenuCategory[]) => {
                    this.setState({menuCategories})
                })
                .catch( err => window.alert('unable to load categories'))
        }
    }

    private checkboxesToString = (items: string, code: string): string => {
        if (items === null) items= "";

        let parts: string[] = items.split(':')
        console.log(parts, items);
        if (parts.indexOf(code) !== -1) {// delete if it exists
            parts.splice(parts.indexOf(code), 1);
        } else {
            parts.push(code);
        }

        const final: string = parts.join(':');
        return (final.substr(0, 1)) === ':' ? final.substr(1) : final;
    }

    private onNewImageLoaded = (file: File | null) => {
        this.temporaryImage = file;

        if (file === null){
            let menuItem: MenuItemDTO = this.state.menuItem;
            menuItem.image = null;
            this.setState({menuItem});
        }

        this.setState({hasBeenUpdated: true});
    }

    private proteinSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let menuItem: MenuItemDTO = this.state.menuItem;
        menuItem.proteins = this.checkboxesToString(menuItem.proteins, e.target.id);
        this.setState({menuItem, hasBeenUpdated: true});
    }

    private save = (): void => {
        this.setState({saving: true});
        let menuItem: MenuItemDTO = this.state.menuItem;

        if (this.temporaryImage){
            menuItem.image = this.temporaryImage;
        } else if (typeof menuItem.image === 'string') {
            delete menuItem.image;
        }
         menuItemService.update<MenuItemDTO>(menuItem, menuItem.image !== null && typeof menuItem.image !== 'string')
                .then((menuItemDTO: MenuItemDTO) => {
                    this.setState({
                        menuItem: menuItem,
                        saving: false,
                        hasBeenUpdated: false
                    });
                    // if (this.props.itemAdded) this.props.itemAdded(menuItemDTO);
                })
    }

    private updateMenuItem = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        let menuItem: any = this.state.menuItem;
        menuItem[e.target.name] = e.target.value;
        this.setState({menuItem, hasBeenUpdated: true});
    }

    private updateOptions = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let menuItem: MenuItemDTO = this.state.menuItem;
        switch(e.target.id) {
            case 'spicy':
                menuItem.spicy = !menuItem.spicy
                this.setState({menuItem, hasBeenUpdated: true})
                break;
            case 'price':
                menuItem.price = parseFloat(e.target.value);
                this.setState({menuItem, hasBeenUpdated: true});
                break;
        }
    }

    public render() {//TODO: fix saveBtnDisabled

        if (!this.state.loaded)
            return <LoadingOverlay />

        const disabled: boolean = false;// this.props.mode === ItemModes.view || this.props.mode === ItemModes.deliveryDay

        const allergens: any[] = [
            { name: 'Dairy', code: 'milk' },
            { name: 'Soy', code: 'soy'},
            { name: 'Shellfish', code: 'shell'},
            { name: 'Egg', code: 'egg'},
            { name: 'Fish', code: 'fish'},
            { name: 'Nuts', code: 'nuts'},
            { name: 'Peanuts', code: 'peanut'},
            { name: 'Wheat', code: 'wheat'}
        ]

        const proteins: any[] = [
            { name: 'Pork', code: 'pork'},
            { name: 'Chicken', code: 'chicken'},
            { name: 'Beef', code: 'beef' },
            { name: 'Tofu', code: 'tofu'},
            { name: 'Veggie', code: 'veg'},
            { name: 'Vegan', code: 'vekan'},
            { name: 'Shrimp', code: 'shrimp'}
        ]

        const isRestaurant: boolean = this.props.operator.settings?.type === OPERATOR_TYPES.restaurant;
        
        return (
            <div className="row menuedititem justify-content-center">
                <div className="col-12">
                    <h3>edit menu item</h3>
                    <hr/>
                </div>
                <div className='col-12'>
                    <button
                        className='btn btn-sm btn-outline-info'
                        onClick={() => this.props.history.goBack()}
                        >back</button>
                    <hr/>
                </div>
                    <div className={`col-12 menuedititem__inner col-md-${isRestaurant ? '6' : '12'}`}>
                        <div className="row">
                            <div className={`col-12 col-md-${isRestaurant ? '12' : '6'}`}>
                                <div className="row">
                                    <div className="col-12">
                                        <h5>name</h5>
                                        <input
                                            id='menuedititem__name'
                                            type="text"
                                            className="form-control"
                                            placeholder="Meal Name"
                                            name="name"
                                            value={this.state.menuItem.name}
                                            onChange={this.updateMenuItem}
                                            disabled={disabled}
                                            />
                                    </div>
                                    <div className="col-12 col-md-8 mt-2">
                                        <h5>description</h5>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            placeholder="Description"
                                            name="description"
                                            value={this.state.menuItem.description}
                                            onChange={this.updateMenuItem}
                                            disabled={disabled}
                                            ></textarea>
                                    </div>
                                    <div className="col-12 col-md-4 menuedititem__imagearea menuedititem__area mt-2">
                                        <ImageUploader
                                            id={`image_uploader__menuItem-${this.state.menuItem.id}`}
                                            imageURL={this.state.menuItem.image !== null ? config.API_URL + config.UPLOADS_PATH + '/' + this.state.menuItem.image : ''}
                                            newImageLoaded={this.onNewImageLoaded}
                                            maximumSizeInMb={100}
                                            allowedFileTypes=".jpg,.png,.jpeg"
                                            disabled={disabled}
                                            />
                                    </div>
                                    {!isRestaurant &&
                                        <Fragment>
                                            <div className="col-6 mt-2">
                                                <h5>category</h5>
                                                <select
                                                    name={`${isRestaurant ? 'menu_category' : 'category'}`}
                                                    className="form-control"
                                                    defaultValue={this.state.menuItem.category}
                                                    disabled={disabled}
                                                    onChange={this.updateMenuItem}>
                                                    {
                                                        isRestaurant ?
                                                            <div></div>
                                                            :
                                                            <Fragment>
                                                                <option value="en">Entree</option>
                                                                <option value="ap">Appetizer</option>
                                                                <option value="si">Side Item</option>
                                                                <option value="de">Dessert</option>
                                                            </Fragment>
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-6 mt-2">
                                                <h5>price</h5>
                                                <input type="text" name="price" className="form-control" value={this.state.menuItem.price}
                                                disabled={disabled} onChange={this.updateMenuItem} />
                                            </div>
                                        </Fragment>
                                    }
                                    <div className='col-3 mt-2'>
                                        <div className="checkbox_selector">
                                            <input
                                                type="checkbox"
                                                id="spicy"
                                                checked={this.state.menuItem.spicy}
                                                onChange={this.updateOptions}
                                                />
                                                <span>Spicy</span>
                                        </div>
                                    </div>
                                    {this.state.menuItem.spicy &&
                                        <div className='col-9 mt-2'>
                                            <select
                                                name='spiciness'
                                                className="form-control"
                                                defaultValue={this.state.menuItem.spiciness}
                                                disabled={disabled}
                                                onChange={this.updateMenuItem}>
                                                <option value={SPICINESS_CHOICES.spicy}>spicy only</option>
                                                <option value={SPICINESS_CHOICES.mildToSpicy}>mild, med, spicy</option>
                                                <option value={SPICINESS_CHOICES.notSpicyToSpicy}>not spicy, mild, med, spicy</option>
                                            </select>
                                        </div>
                                    }
                                    <div className="col-12 mt-2">
                                        <h5>allergens</h5>
                                            {
                                                allergens.map((allergen: any) =>
                                                    <div className="checkbox_selector" key={allergen.code}>
                                                        <input
                                                            type="checkbox"
                                                            id={allergen.code}
                                                            checked={this.state.menuItem.allergens.indexOf(allergen.code) !== -1}
                                                            onChange={this.allergenSelected}/>
                                                        <span>{allergen.name}</span>
                                                    </div>
                                                )
                                            }
                                    </div>
                                    {/*
                                    <div className="col-12 mt-2">
                                        <hr/>
                                        <h5>proteins:</h5>
                                            {
                                                proteins.map((protein: any) =>


                                                    <div className="checkbox_selector" key={protein.code}>
                                                        <input
                                                            type="checkbox"
                                                            id={protein.code}
                                                            checked={this.state.menuItem.proteins.indexOf(protein.code) > -1}
                                                            onChange={this.proteinSelected}/>
                                                        <span>{protein.name}</span>
                                                    </div>

                                                )
                                            }
                                    </div>
                                    */}
                                    <div className='col-12 text-right'>
                                        <LoadingIconButton
                                            outerClass='float-right'
                                            btnClass={`btn btn-outline-${this.state.hasBeenUpdated ? 'success' : 'secondary'}`}
                                            label='save'
                                            onClick={this.save}
                                            busy={this.state.saving}
                                            disabled={!this.state.hasBeenUpdated}
                                            />
                                    </div>
                                </div>
                            </div>
                            <div className={'col-12 d-block d-md-none'}>
                                <hr/>
                            </div>
                            <div className={`col-12 col-md-${isRestaurant ? '12' : '6'} mt-2 mb-2 mt-md-0`}>
                                {
                                    isRestaurant ?
                                        <RestaurantMenuItemAddOns
                                            menuItem={this.state.menuItem}
                                        />
                                        :
                                        <MenuComponents menuItem={this.state.menuItem} />
                                }
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState): LinkStateProps => ({
    operator: state.operatorReducer
})

export default connect(mapStateToProps)(MenuItemEdit);