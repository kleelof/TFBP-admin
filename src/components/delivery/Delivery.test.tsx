import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import Deliveries from './Deliveries';
import deliveryDayService from '../../services/DeliveryDayService';
import {BuildDeliveryDay} from '../../../__mocks__/deliveryMocks';
import { DeliveryDays } from './DeliveryDays';
import DeliveryDay from '../../models/DeliveryDayModel';
import DeliveryDuplicate from './DeliveryDuplicate';
import { assert } from 'console';
import { MemoryRouter, Route } from 'react-router-dom';

configure({adapter: new Adapter()});

let component: any;
let deliveryGetSpy: jest.SpyInstance = jest.spyOn(deliveryDayService, 'get')

describe('Deliveries tests', () => {
    beforeAll(() => {
        deliveryGetSpy.mockImplementation(() => Promise.resolve(BuildDeliveryDay({count: 2})))
        component = mount(
            <Deliveries />
        )
    })

    it('should request days starting with today when launched', () => {
        expect(deliveryGetSpy).toBeCalledTimes(1);
        expect(deliveryGetSpy).toBeCalledWith(null, {"start_date": "2020-08-12"});
    })

    it('should list all days and menu items', () => {
        expect(component.find(DeliveryDays).length).toEqual(2);
    })

    it('should not allow adding/duplicating if start date is after end date', () => {

    })
})

describe('DeliveryDays tests', () => {
    beforeAll(() => {
        const deliveryDay: DeliveryDay = BuildDeliveryDay({count: 1, date: '2020-07-04', end_date: '2020-07-05'});
        component = shallow(
            <DeliveryDays deliveryDay={deliveryDay} duplicate={jest.fn()} />
        )
    })

    it('should display date range', () => {
        expect(component.find('.delivery_days__date').text()).toEqual('Saturday July 4, 2020');
        expect(component.find('.delivery_days__end_date').text()).toEqual('Sunday July 5, 2020');
    })

    it('should list all menu items', () => {
        expect(component.find('.delivery_days_item').length).toEqual(1);
    })
})

describe('DeliveryDuplicate tests', () => {
    beforeAll(async () => {
        const deliveryDay: DeliveryDay = BuildDeliveryDay({count: 1, date: '2020-07-04', end_date: '2020-07-05'});
        deliveryGetSpy.mockImplementation(() => Promise.resolve(deliveryDay));
        const props: any = {match: { params: {id: deliveryDay.id}}}
        component = await shallow(
            <DeliveryDuplicate {...props}/>
            )
        await component.update();
    })
    it('should display dates of DeliveryDay to duplicate', () => {
        expect(component.find('.delivery_duplicate_dates').text()).toContain('Saturday July 4, 2020');
        expect(component.find('.delivery_duplicate_dates').text()).toContain('Sunday July 5, 2020');
    })

    it('should list dayItems', () => {
        expect(component.find('.delivery_duplicate_items__item').length).toEqual(1);
    })

    it('should submit correct data to API', () => {
        
    })
})