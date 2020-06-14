import React from 'react';

import './menu.css';
import MenuItemDTO from '../../dto/MenuItemDTO';
import menuItemService from '../../services/AdminMenuItemService';
import ImageUploader from '../widgets/imageUploader/ImageUploader';

import {config} from '../../config';
import DeliveryDayItem from '../../models/DeliveryDayItemModel';
import DeliveryMenuItemOptions from '../delivery/DeliveryMenuItemOptionsComponent';

interface IProps {
    mode: ItemModes,
    menuItem: MenuItemDTO,
    itemAdded?(menuItemDTO: MenuItemDTO): void,
    itemSelected?(menuItemDTO: MenuItemDTO): void,
    deliveryDayItem: DeliveryDayItem
}

interface IState {
    menuItem: MenuItemDTO,
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

export default class MenuItem extends React.Component<IProps, IState> {

    private temporaryImage: File | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
            menuItem: props.menuItem,
            saving: false,
            viewingServings: false,
            hasBeenUpdated: false
        }
    }

    private addNewMenuItem = (): void => {
        this.setState({saving: true});
        let menuItem: MenuItemDTO = this.props.menuItem;

        if (this.temporaryImage){
            menuItem.image = this.temporaryImage;
        } else {
            menuItem.image = null
        }

        menuItemService.add<MenuItemDTO>(menuItem, menuItem.image !== null)
                .then((menuItemDTO: MenuItemDTO) => {
                    this.setState({
                        menuItem: new MenuItemDTO(),
                        saving: false
                    });

                    if (this.props.itemAdded) this.props.itemAdded(menuItemDTO);
                })
    }

    private checkboxesToString = (items: string, code: string): string => {
        if (items === null) items= "";

        let parts: string[] = items.split(':')
        if (parts.indexOf(code) !== -1) {
            parts.splice(parts.indexOf(code), 1);
        } else {
            parts.push(code);
        }
        console.log(parts.join(':'));
        return parts.join(':');
    }

    public componentWillUpdate = (props: IProps): void => {
        if(props.mode !== this.props.mode) {
            switch (props.mode) {
                case ItemModes.view:
                    this.setState({
                        saving: false,
                        viewingServings: false
                    })
                break;
            }
        }
    }

    private onClickMe = (): void => {
        if (this.props.mode === ItemModes.edit || this.props.mode === ItemModes.deliveryDay) return;
        
        if (this.props.itemSelected) this.props.itemSelected(this.state.menuItem);
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
        menuItem.proteins = this.checkboxesToString(menuItem.proteins, e.target.id)
        this.setState({menuItem});
    } 

    private allergenSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let menuItem: MenuItemDTO = this.state.menuItem;
        menuItem.allergens = this.checkboxesToString(menuItem.allergens, e.target.id)
        this.setState({menuItem});
    }

    private save = (): void => {
        this.setState({saving: true});
        let menuItem: MenuItemDTO = this.state.menuItem;

        if (this.temporaryImage){
            menuItem.image = this.temporaryImage;
        } else if (typeof menuItem.image === 'string') {
            delete menuItem.image;
        }
         menuItemService.update<MenuItemDTO>(menuItem.id, menuItem, menuItem.image !== null && typeof menuItem.image !== 'string')
                .then((menuItemDTO: MenuItemDTO) => {
                    this.setState({
                        menuItem: menuItem,
                        saving: false,
                        hasBeenUpdated: false
                    });
                    if (this.props.itemAdded) this.props.itemAdded(menuItemDTO);
                })
    }

    private updateMenuItem = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        let menuItem: any = this.state.menuItem;
        menuItem[e.target.name] = e.target.value;
        this.setState({menuItem});
    }

    private updateOptions = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let menuItem: MenuItemDTO = this.state.menuItem;
        switch(e.target.id) {
            case 'spicy':
                menuItem.spicy = !menuItem.spicy
                this.setState({menuItem})
                break;
            case 'price':
                menuItem.price = parseFloat(e.target.value);
                this.setState({menuItem});
                break;
        }
    }

    public render() {//TODO: fix saveBtnDisabled

        const saveBtnDisabled: boolean = this.state.saving || this.props.mode === ItemModes.view
        const disabled: boolean = this.props.mode === ItemModes.view || this.props.mode === ItemModes.deliveryDay

        let header: any = null

        switch(this.props.mode) {
            case ItemModes.add:
                header = <div className="header-add">Add New Menu Item</div>
                break;
            case ItemModes.edit:
                header = <div className="header-edit">Editing</div>
                break;
            case ItemModes.view:
                header = <div className={this.state.menuItem.active ? "header-view" : "header-view-deactivated"}>
                            <div>Click To Edit</div>
                        </div>
                break;
        }

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
            { name: 'Veggie', code: 'veg'}
        ]
        
        return (
            <div 
                className="menu-item mt-2"
                onClick={this.onClickMe}
                >
                <div className="header">
                    {header}
                </div>
                <div className="inner">
                    <div className="name-area area">
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Meal Name"
                            name="name"
                            value={this.state.menuItem.name}
                            onChange={this.updateMenuItem}
                            disabled={disabled}
                            />
                    </div>
                    <div className="image-area area">
                        <ImageUploader
                            id={`image-uploader-menuItem-${this.state.menuItem.id}`}
                            imageURL={this.state.menuItem.image === undefined ||this.state.menuItem.image === null || this.state.menuItem.image === "" ? 
                                    "" : this.state.menuItem.image.toString().indexOf("http") > -1 ? 
                                            this.state.menuItem.image.toString() : config.API_URL + this.state.menuItem.image}
                            newImageLoaded={this.onNewImageLoaded}
                            maximumSizeInMb={100}
                            allowedFileTypes=".jpg,.png,.jpeg"
                            disabled={disabled}
                            />
                    </div>
                    <div className="description-area area">
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
                    <div className="area">
                        Price:
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            value={this.state.menuItem.price}
                            onChange={this.updateOptions}/>
                        <hr/>
                    </div>
                    <div className="ingredients-area area">
                        <h3>Proteins:</h3>
                            {
                                proteins.map((protein: any) => {
                                    if (this.props.mode === ItemModes.deliveryDay){
                                        if (this.state.menuItem.proteins.length === 0)
                                            return <div className="checker-week" key={`proteins_${protein.code}`}>&nbsp;</div>

                                        if(this.state.menuItem.proteins.indexOf(protein.code) !== -1){
                                            return (
                                                <div className="checker-week" key={`proteins_${protein.code}`}>
                                                    {protein.name}
                                                </div>
                                            )
                                        } else {
                                            return null
                                        }
                                    }

                                    return(
                                        <div className="checker" key={protein.code}>
                                            <input
                                                type="checkbox"
                                                id={protein.code}
                                                checked={this.state.menuItem.proteins.indexOf(protein.code) !== -1}
                                                disabled={this.props.mode === ItemModes.view}
                                                onChange={this.proteinSelected}/>
                                            <span>{protein.name}</span>
                                        </div>
                                    )} 
                                )
                            }
                            <hr/>
                    </div>
                    <div className="ingredients-area area">
                        <h3>Allergens:</h3>
                            {
                                allergens.map((allergen: any) => 
                                    {
                                        if (this.props.mode === ItemModes.deliveryDay){
                                            if (this.state.menuItem.allergens.length === 0)
                                                return <div className="checker-week" key={`allergens_${allergen.code}`}>&nbsp;</div>

                                            if(this.state.menuItem.allergens.indexOf(allergen.code) !== -1){
                                                return (
                                                    <div className="checker-week" key={`allergens_${allergen.code}`}>
                                                        {allergen.name}
                                                    </div>
                                                )
                                            } else {
                                                return null
                                            }
                                        }

                                        return( 
                                            <div className="checker" key={allergen.code}>
                                                <input
                                                    type="checkbox"
                                                    id={allergen.code}
                                                    checked={this.state.menuItem.allergens.indexOf(allergen.code) !== -1}
                                                    disabled={this.props.mode === ItemModes.view}
                                                    onChange={this.allergenSelected}/>
                                                <span>{allergen.name}</span>
                                            </div>
                                        ) }
                                )
                            }
                    </div>
                    <div className="options-area area">
                        <hr/>
                        {
                            this.props.mode === ItemModes.deliveryDay ?
                                this.state.menuItem.spicy ?
                                    <div className="checker-week">Spicy</div>
                                    :
                                    <div className="checker-week">Not Spicy</div>
                                :
                                    <div className="checker">
                                        <input
                                            type="checkbox"
                                            id="spicy"
                                            checked={this.state.menuItem.spicy}
                                            disabled={this.props.mode === ItemModes.view}
                                            onChange={this.updateOptions}
                                            />
                                            <span>Spicy</span>
                                    </div>

                        }
                    </div>
                    {
                        this.props.mode === ItemModes.deliveryDay ?
                            <div className="week-options">
                                <DeliveryMenuItemOptions deliveryDayItem={this.props.deliveryDayItem} />
                            </div>
                            :
                            <div className="controls-area area text-center mt-2">
                                {
                                    this.props.mode === ItemModes.add ?
                                        <button 
                                            className="btn btn-info ml-2"
                                            disabled={saveBtnDisabled}
                                            onClick={this.addNewMenuItem}
                                            >Add</button>
                                        :
                                        this.props.mode === ItemModes.edit ?
                                            <button 
                                                className="btn btn-success"
                                                disabled={saveBtnDisabled} 
                                                onClick={this.save}
                                                >Save</button>
                                            :
                                            <div></div>
                                }
                            </div> 
                    }
                </div>
            </div>
        )
    }
}