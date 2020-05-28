import React from 'react';

import './menu.css';
import MenuItemDTO from '../../../dto/MenuItemDTO';
import menuItemService from '../../../services/AdminMenuItemService';
import ImageUploader from '../../widgets/imageUploader/ImageUploader';

import {config} from '../../../config';

interface IProps {
    mode: ItemModes,
    menuItem: MenuItemDTO,
    itemAdded?(menuItemDTO: MenuItemDTO): void
    itemSelected?(menuItemDTO: MenuItemDTO): void
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
    week
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

    private onActivateClicked = (): void => {
        let action: string = this.state.menuItem.active ? "deactivate" : "activate";
        if (window.confirm(`Are you sure you want to ${action} this menu item?`)) {
            let menuItem: MenuItemDTO = this.state.menuItem;
            menuItem.active = !menuItem.active;
            this.setState({menuItem}, () => this.save()); 
        }
    }

    private onClickMe = (): void => {
        if (this.props.mode !== ItemModes.view) return;
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
        } else {
            menuItem.image = null
        }
         menuItemService.update<MenuItemDTO>(menuItem.id, menuItem, menuItem.image !== null)
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

    public render() {//TODO: fix saveBtnDisabled
        const saveBtnDisabled: boolean = this.state.saving || this.props.mode === ItemModes.view
        const allergens: any[] = [
            { name: 'Milk', code: 'milk' },
            { name: 'Soy', code: 'soy'},
            { name: 'Shellfish', code: 'shell'},
            { name: 'Egg', code: 'egg'},
            { name: 'Fish', code: 'fish'},
            { name: 'Nuts', code: 'nut'},
            { name: 'Peanuts', code: 'peanut'},
            { name: 'Wheat', code: 'wheat'}
        ]
        const proteins: any[] = [
            { name: 'Pork', code: 'pork'},
            { name: 'Chicken', code: 'chicken'},
            { name: 'Beef', code: 'beef' },
            { name: 'Tofu', code: 'tofu'}
        ]
        return (
            <div 
                className="menu-item mt-2"
                onClick={this.onClickMe}
                >
                <div className="header">
                    {this.props.mode === ItemModes.add &&
                        <div className="header-add">Add New Menu Item</div>
                    }
                    {this.props.mode === ItemModes.edit &&
                        <div className="header-edit">
                            Editing
                        </div>
                    }
                    {this.props.mode === ItemModes.view &&
                        <div className={this.state.menuItem.active ? "header-view" : "header-view-deactivated"}>
                            <div>Click To Edit</div>
                        </div>
                    }
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
                            disabled={this.props.mode === ItemModes.view}
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
                            disabled={this.props.mode === ItemModes.view}
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
                            disabled={this.props.mode === ItemModes.view}
                            ></textarea>
                    </div>
                    <div className="ingredients-area area">
                        <h3>Proteins:</h3>
                            {
                                proteins.map((protein: any) => {
                                    if (this.props.mode === ItemModes.week){
                                        if (this.state.menuItem.proteins.length === 0)
                                            return <div className="checker-week">&nbsp;</div>

                                        if(this.state.menuItem.proteins.indexOf(protein.code) !== -1){
                                            return (
                                                <div className="checker-week">
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
                                        if (this.props.mode === ItemModes.week){
                                            if (this.state.menuItem.allergens.length === 0)
                                                return <div className="checker-week">&nbsp;</div>

                                            if(this.state.menuItem.allergens.indexOf(allergen.code) !== -1){
                                                return (
                                                    <div className="checker-week">
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
                    <div className="controls-area area text-center">
                        {
                        }
                        {
                            this.props.mode === ItemModes.week ?
                                <div>&nbsp;</div> :
                                this.props.mode === ItemModes.add ?
                                <button 
                                    className="btn btn-info ml-2"
                                    disabled={saveBtnDisabled}
                                    onClick={this.addNewMenuItem}
                                    >Add</button> :
                                <button 
                                    className="btn btn-success"
                                    disabled={saveBtnDisabled} 
                                    onClick={this.save}
                                    >Save</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}