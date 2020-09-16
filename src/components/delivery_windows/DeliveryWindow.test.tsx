import React from 'react';
import moment from 'moment';
import momentHelper from '../../helpers/MomentHelper';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import DeliveryWindow from "../../models/DeliveryWindowModel";
import {BuildDeliveryWindow} from "../../../__mocks__/deliveryMocks";
import {DeliveryWindowsWindow} from "./DeliveryWindowsWindow";

configure({adapter: new Adapter()});

let component: any;
let props: any;
let deliveryWindow: DeliveryWindow;

describe('DeliveryWindows tests', () => {

})

describe('DeliveryWindowsWindow tests', () => {
    it('should set up correctly default "recurring"', async () => {
        deliveryWindow = BuildDeliveryWindow({count: 1, start_date: null, end_date: null});
        component = shallow(<DeliveryWindowsWindow window={deliveryWindow} />);
        await(() => expect(component.find('recurring').length).toBe(1));
    })

    it('should display expired', async () => {
        deliveryWindow = BuildDeliveryWindow({count: 1, start_date: '1800-01-01', end_date: '1900-01-01'});
        component = shallow(<DeliveryWindowsWindow window={deliveryWindow} />);
        await(() => expect(component.find('expired').length).toBe(1));
    })

    it('should display range of dates', async () => {
        let today= moment();

        deliveryWindow = BuildDeliveryWindow({
            count: 1,
            start_date: '2020-07-04',
            end_date: '2020-07-11'
        })
        component = shallow(<DeliveryWindowsWindow window={deliveryWindow} />);
        await(() => {
            expect(component.text).toContain('Jul 7 2020');
            expect(component.text).toContain('Jul 11 2020')
        });
    })
})