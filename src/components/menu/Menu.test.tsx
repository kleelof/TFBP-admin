import React from 'react';
import {shallow, configure, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter, Route } from 'react-router-dom';
import menuItemService from '../../services/MenuItemService';
import { MenuItems } from './MenuItems';
import {BuildMenuItem, BuildRecipe} from '../../../__mocks__/mockFactories';
import { NewMenuItem } from './NewMenuItem';
import {Menu} from './Menu';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import {MenuComponentComponent} from "./MenuComponentComponent";
import MenuItemAddOn from "../../models/MenuItemAddOnModel";
import Ingredient from "../../models/IngredientModel";
import Recipe from "../../models/RecipeModel";
import RecipeIngredient from "../../models/RecipeIngredientModel";
import Allergen from "../../models/AllergenModel";

configure({adapter: new Adapter()});

let component: any;
let addSpy: any = jest.spyOn(menuItemService, 'add');
let loadSpy: any = jest.spyOn(menuItemService, 'search');

describe('MenuComponentComponent tests', () => {
    describe('allergens tests', () => {
        let addOn: MenuItemAddOn;
        const ingNoAllergens: Ingredient = new Ingredient('ingredient', 'a description');
        const ingWithAllergens: Ingredient = new Ingredient(
            "", "",
            [
                new Allergen(-1, 'allergen_1'),
                new Allergen(-1, 'allergen_2')
            ]
        )

        beforeEach(() => {
            addOn = new MenuItemAddOn(1, 0, 1, 'add_on')
        })

        it('should list no allergens when no ingredient or recipe', () => {
            component = shallow(
                <MenuComponentComponent item={addOn} deleteComponent={() => {}} />
            )

            expect(component.find('.menu_component__allergens').length).toBe(0);
        })

        it('should list no allergens when ingredient has no allergens', () => {
            addOn.ingredient = ingNoAllergens;
            component = shallow(
                <MenuComponentComponent item={addOn} deleteComponent={() => {}} />
            )

            expect(component.find('.menu_component__allergens').length).toBe(0);
        })

        it('should list no allergens when recipe has no allergens', () => {
            addOn.recipe = BuildRecipe({
                count: 1,
                ingredients: [
                    new RecipeIngredient(
                        1, 0, 1, ingNoAllergens
                    )
                ]
            })
            component = shallow(
                <MenuComponentComponent item={addOn} deleteComponent={() => {}} />
            )

            expect(component.find('.menu_component__allergens').length).toBe(0);
        })

        it('should list allergens from ingredient', () => {
            addOn.ingredient = ingWithAllergens
            component = shallow(
                <MenuComponentComponent item={addOn} deleteComponent={() => {}} />
            )

            expect(component.find('.menu_component__allergens').length).toBe(1);
            const text: string = component.find('.menu_component__allergens').text();
            expect(text).toContain('allergen_1');
            expect(text).toContain('allergen_2');
        })

        it('should list allergens from recipe', () => {
            addOn.recipe = BuildRecipe({
                count: 1,
                ingredients: [
                    new RecipeIngredient(
                        1, 0, 1,
                        ingWithAllergens
                    )
                ]
            })
            component = shallow(
                <MenuComponentComponent item={addOn} deleteComponent={() => {}} />
            )

            expect(component.find('.menu_component__allergens').length).toBe(1);
            const text: string = component.find('.menu_component__allergens').text();
            expect(text).toContain('allergen_1');
            expect(text).toContain('allergen_2');
        })
    })
})

describe('MenuItems tests', () => {

    it('should load based on category', async () => {
        loadSpy.mockImplementation(() => Promise.resolve(
            new PagedResultsDTO(
                100, BuildMenuItem({count: 2})
            )
        ));
    
        component = await mount(
            <MemoryRouter initialEntries={['/dashboard/menu/en']}>
                <Route path='/dashboard/menu/:category'>
                    <MenuItems  />
                </Route>
            </MemoryRouter>
        )
        await component.update();
        //expect(component.find('.menuitems__item').length).toEqual(1);
        expect(loadSpy).toBeCalledWith('en', 'category');
        expect(component.text()).toContain('menu_item_1');
    })
})

describe('NewMenuItem tests', () => {
    beforeAll(() => {
        
        component = mount(
            <NewMenuItem />
        )
        component.find('.new_menu_item__add_link').simulate('click');
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should disable add btn if no name',  () => {
        component.find('#new_menu_item__name').simulate('change', {target: {value: ''}})
        expect(component.find('.btn').prop('disabled')).toEqual(true);

    })

    it('should enable add btn if no name', () => {
        component.find('#new_menu_item__name').simulate('change', {target: {value: 'item_name'}})
        expect(component.find('.btn').prop('disabled')).toEqual(false);
    })

    it('should submit a valid MenuItem to API', () => {
        component.find('#new_menu_item__name').simulate('change', {target: {value: 'item_name'}})
        component.find('.btn').simulate('click')
        expect(addSpy).toHaveBeenCalledTimes(1);
        // expect(addSpy).toHaveBeenCalledWith({"allergens": "", "category": "en", "description": "", "id": 0, "image": "", "name": "item_name", "price": 10, "proteins": "", "spicy": false},);
    })

    it('should submit valid info after category change', () => {
        component.find('#new_menu_item__name').simulate('change', {target: {value: 'item_name'}});
        component.find('select').simulate('change', {target: {value: 'ap'}})
        component.find('.btn').simulate('click')
        expect(addSpy).toHaveBeenCalledTimes(1);
        // expect(addSpy).toHaveBeenCalledWith({"allergens": "", "category": "ap", "description": "", "id": 0, "image": "", "name": "item_name", "price": 10, "proteins": "", "spicy": false});
    })
})