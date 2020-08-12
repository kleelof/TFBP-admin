import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import menuItemService from '../../../services/MenuItemService';
import SearchWidget from './SearchWidget';
import { BuildMenuItem } from '../../../../__mocks__/mockFactories';
import InputWidget from '../inputWidget/InputWidget';

configure({adapter: new Adapter()});

let component: any;
let searchSpy = jest.spyOn(menuItemService, 'search');
let itemSelected = jest.fn();

describe('SearchWidget tests', () => {
    beforeAll(() => {
        searchSpy.mockImplementation(() => Promise.resolve([BuildMenuItem({count:2})]))

        component = mount(
            <SearchWidget service={menuItemService} itemSelected={itemSelected} />
        )
    })

    it('should list search all found items ', async () => {
        jest.useFakeTimers();

        await component.find(InputWidget).find('input').simulate(
            'change',
            {target: {value: 'menu'}}
        )
        await component.update();

        setTimeout(() => {
            expect(searchSpy).toBeCalledTimes(1);
            expect(searchSpy).toBeCalledWith('menu');
            //expect(component.find('.search_items__search_item').length).toEqual(3);
        }, 1000); // if fails, check delay time given to InputWidget
        

        
        jest.runTimersToTime(1000);
    })
})

