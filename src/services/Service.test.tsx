import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import menuItemService from '../services/MenuItemService';
import axiosInstance from "./axiosApi";

configure({adapter: new Adapter()});

const getSpy: jest.SpyInstance = jest.spyOn(axiosInstance, 'get');

describe('Service Tests', () => {
    it('should add query variables', () => {
        menuItemService.get(null, {test: 'var_1'});
        expect(getSpy).toBeCalledWith('/api/dashboard/menu_item/?test=var_1');
    })
})