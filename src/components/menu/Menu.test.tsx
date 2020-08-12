import React from 'react';
import {shallow, configure, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactRouter from 'react-router-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import menuItemService from '../../services/MenuItemService';
import { MenuItems } from './MenuItems';
import { BuildMenuItem } from '../../../__mocks__/mockFactories';
import { NewMenuItem } from './NewMenuItem';
import Menu from './Menu';

configure({adapter: new Adapter()});

let component: any;
let addSpy: any = jest.spyOn(menuItemService, 'add');
let loadSpy: any = jest.spyOn(menuItemService, 'loadByCategory');

describe('Menu tests', () => {
    beforeAll( async () => {
        loadSpy.mockImplementation(() => Promise.resolve([BuildMenuItem({count: 1})]));
        component = await mount(
            <MemoryRouter initialEntries={['/dashboard/menu/en']}>
                <Route path='/dashboard/menu/:category'>
                    <Menu  />
                </Route>
            </MemoryRouter>
        )
        
    })

    it('should submit valid MenuItem to API', async () => {
        await component.update();
        component.find('#new_menu_item__name').simulate('change', {target: {value: 'item_name'}});
        component.find('.new_menu_item .btn').simulate('click');
        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith({"allergens": "", "category": "en", "description": "", "id": 0, "image": "", "name": "item_name", "price": 10, "proteins": "", "spicy": false});
    })
})

describe('MenuItems tests', () => {

    it('should load based on category', async () => {
        loadSpy.mockImplementation(() => Promise.resolve([BuildMenuItem({count: 1})]));
    
        component = await mount(
            <MemoryRouter initialEntries={['/dashboard/menu/en']}>
                <Route path='/dashboard/menu/:category'>
                    <MenuItems  />
                </Route>
            </MemoryRouter>
        )
        await component.update();
        expect(component.find('.menuitems__menuitem').length).toEqual(1);
        expect(loadSpy).toBeCalledWith('en');
        expect(component.text()).toContain('menu_item_1');
    })
})

describe('NewMenuItem tests', () => {
    beforeAll(() => {
        
        component = mount(
            <NewMenuItem />
        )
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should disable add btn if no name', () => {
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
        expect(addSpy).toHaveBeenCalledWith({"allergens": "", "category": "en", "description": "", "id": 0, "image": "", "name": "item_name", "price": 10, "proteins": "", "spicy": false});
    })

    it('should submit valid info after category change', () => {
        component.find('#new_menu_item__name').simulate('change', {target: {value: 'item_name'}});
        component.find('select').simulate('change', {target: {value: 'ap'}})
        component.find('.btn').simulate('click')
        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith({"allergens": "", "category": "ap", "description": "", "id": 0, "image": "", "name": "item_name", "price": 10, "proteins": "", "spicy": false});
    })
})