import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OrderEmail from "./OrderEmail";
import {BuildOrder} from "../../../__mocks__/mockFactories";
import Order from "../../models/OrderModel";
import adminService from '../../services/AdminService';

configure ({adapter: new Adapter()});

let component: any;
let sendSupportEmailSpy: jest.SpyInstance = jest.spyOn(adminService, 'sendSupportEmail');

describe('OrderEmail tests', () => {
    const order: Order = BuildOrder({count: 1});
    beforeEach(() => {
        component = mount(
            <OrderEmail order={order} />
        )

        jest.clearAllMocks();
    })

    it('should set-up correctly', () => {
        expect(component.find('.order_email__subject').instance().value).toBe(`Order ${order.public_id}`);
    })

    it('should enable submit when subject and body are filled', async () => {
        component.find('.order_email__body').simulate('change', {target: {id: 'body', value: 'body text'}});
        expect(component.find('.order_email__submit').prop('disabled')).toEqual(false);
    })

    it('should submit correctly --include_order', () => {
        component.find('.order_email__body').simulate('change', {target: {id: 'body', value: 'body text'}});
        component.find('.order_email__submit').simulate('click');

        expect(sendSupportEmailSpy).toHaveBeenCalledTimes(1);
        expect (sendSupportEmailSpy.mock.calls[0].length).toEqual(4);
        let calls: any = sendSupportEmailSpy.mock.calls[0];
        expect(calls[0]).toEqual('email_1@email.com');
        expect(calls[1]).toEqual('Order public_id_1');
        expect(calls[2]).toEqual('body text');
        expect(calls[3]).not.toEqual(null);
    })

    it('should submit correctly -- not include_order', () => {
        component.find('.order_email__body').simulate('change', {target: {id: 'body', value: 'body text'}});
        component.find('.order_email__include_order').simulate('change');
        component.find('.order_email__submit').simulate('click');

        expect(sendSupportEmailSpy).toHaveBeenCalledTimes(1);
        expect (sendSupportEmailSpy.mock.calls[0][3]).toEqual(null);
    })
})