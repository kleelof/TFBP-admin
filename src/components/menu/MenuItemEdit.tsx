import React from 'react';

import MenuItem, {MenuItemDTO} from '../../models/MenuItemModel';
import menuItemService from '../../services/MenuItemService';
import ImageUploader from '../widgets/imageUploader/ImageUploader';
import {RouteComponentProps} from 'react-router-dom';

import './menu.scss';
import LoadingOverlay from '../overlays/LoadingOverlay';
import {config} from "../../config";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import {MenuComponents} from "./MenuComponents";

interface Props extends RouteComponentProps {
    match: any;
}

interface State {
    menuItem: MenuItemDTO,
    loaded: boolean,
    saving: boolean,
    viewingServings: boolean,
    hasBeenUpdated: boolean
}

export enum ItemModes {
    add,
    edit,
    view,
    deliveryDay
}

export default class MenuItemEdit extends React.Component<Props, State> {

    private temporaryImage: File | null = null;

    state = {
        menuItem: new MenuItem(),
        loaded: false,
        saving: false,
        viewingServings: false,
        hasBeenUpdated: false
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
            { name: 'Milk', code: 'milk' },
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
        
        return (
            <div className="row menuedititem">
                <div className="col-12">
                    <h3>edit menu item</h3>
                    <hr/>
                </div>
                <div className='col-12'>
                    <button
                        className='btn btn-sm btn-outline-info'
                        onClick={() => this.props.history.goBack()}
                        >back</button>
                    <LoadingIconButton
                        outerClass='float-right'
                        btnClass={`btn btn-outline-${this.state.hasBeenUpdated ? 'success' : 'secondary'}`}
                        label='save'
                        onClick={this.save}
                        busy={this.state.saving}
                        disabled={!this.state.hasBeenUpdated}
                        />
                    <hr/>
                </div>
                <div className="col-12 menuedititem__inner p-3">
                    <div className="row">
                        <div className="col-12 col-md-6 mt-2 mt-md-0">
                            <div className="row">
                                <div className="col-12 menuedititem__imagearea menuedititem__area">
                                    <ImageUploader
                                        id={`image_uploader__menuItem-${this.state.menuItem.id}`}
                                        imageURL={this.state.menuItem.image !== null ? config.API_URL + config.UPLOADS_PATH + '/' + this.state.menuItem.image : ''}
                                        newImageLoaded={this.onNewImageLoaded}
                                        maximumSizeInMb={100}
                                        allowedFileTypes=".jpg,.png,.jpeg"
                                        disabled={disabled}
                                        />
                                </div>
                                <div className="col-12 mt-2">
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
                                <div className="col-6 mt-2">
                                    <h5>category</h5>
                                    <select
                                        name="category"
                                        className="form-control"
                                        defaultValue={this.state.menuItem.category}
                                        disabled={disabled}
                                        onChange={this.updateMenuItem}>
                                        <option value="en">Entree</option>
                                        <option value="ap">Apetizer</option>
                                        <option value="si">Side Item</option>
                                        <option value="de">Dessert</option>
                                    </select>
                                </div>
                                <div className="col-6 mt-2">
                                    <h5>price</h5>
                                    <input type="text" name="price" className="form-control" value={this.state.menuItem.price}
                                        disabled={disabled} onChange={this.updateMenuItem} />
                                </div>
                                <div className='col-12 mt-2'>
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
                                <div className="col-12 mt-2">
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
                            </div>
                        </div>
                        <div className={'col-12 d-block d-md-none'}>
                            <hr/>
                        </div>
                        <div className='col-12 col-md-6 mt-2 mt-md-0'>
                            <MenuComponents menuItem={this.state.menuItem} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}