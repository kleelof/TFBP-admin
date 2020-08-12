import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import Deliveries from './Deliveries';
import deliveryDayService from '../../services/DeliveryDayService';

configure({adapter: new Adapter()});

let component: any;
let listSpy: jest.SpyInstance = jest.spyOn(deliveryDayService, 'get')

describe('Deliveries tests', () => {
    beforeAll(() => {
        listSpy.mockImplementation(() => Promise.resolve(BuildDeliveryDay({count: 2})))
        component = shallow(
            <Deliveries />
        )
    })

    it('should request days starting with today when launched', () => {

    })

    it('should list all days and menu items', () => {

    })

    it('should not allow adding/duplicating if start date is after end date', () => {

    })
})