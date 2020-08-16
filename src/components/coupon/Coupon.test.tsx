import React from 'react';
import {shallow, configure, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {CouponComponent} from "./CouponComponent";
import {BuildCoupon} from "../../../__mocks__/mockFactories";
import Coupon from "../../models/Coupon";
import couponService from '../../services/CouponService';
import Coupons from '../coupon/Coupons';
import CouponAdd from "./CouponAdd";

configure({adapter: new Adapter()});

let component: any;
const couponGetSpy: jest.SpyInstance = jest.spyOn(couponService, 'get');
const couponAddSpy: jest.SpyInstance = jest.spyOn(couponService, 'add');
const couponUpdateSpy: jest.SpyInstance = jest.spyOn(couponService, 'update');

describe('Coupons tests', () => {
    beforeAll(() => {
        couponGetSpy.mockImplementation(() => Promise.resolve(BuildCoupon({count: 2})));
    })

    beforeEach(async () => {
        const props: any = {history: []};
        component = await shallow(
            <Coupons {...props}/>
        )
        await component.update();
    })

    it('should create new coupon', async () => {
        const addCoupon: any = component.find('.add_coupon');
        addCoupon.simulate('click');
        expect(couponAddSpy).toBeCalledTimes(1);
    })

    it('should list all the coupons', () => {
        expect(component.find(CouponComponent).length).toEqual(2);
    })
})

describe('CouponComponent tests', () => {
    it('should list all the details', () => {
        const coupon: Coupon = BuildCoupon({count: 1});
        component = shallow(
            <CouponComponent coupon={coupon} couponUpdated={jest.fn()} />
        )
        expect(component.find('.coupon__code').text()).toEqual(coupon.code);
        // expect(component.find('.coupon__active').text()).toContain('active');
        expect(component.find('.coupon__start_value').text()).toContain('20%');
        expect(component.find('.coupon__uses').text()).toBe('1');
        expect(component.find('.coupon__expire').text()).toContain('Sunday July 4, 2021');
        expect(component.find('.coupon__email').text()).toContain('user_1@mail.com');
    })

    it('should call props.couponUpdated when deactivated', async() => {
        global.confirm = () => true;
        couponUpdateSpy.mockImplementation(() => Promise.resolve(BuildCoupon({count:1})))
        const coupon: Coupon = BuildCoupon({count: 1});
        const couponUpdated = jest.fn();
        component = await shallow(
            <CouponComponent coupon={coupon} couponUpdated={couponUpdated} />
        )
        component.find('.coupon__deactivate').simulate('click');
        await component.update();
        expect(couponUpdated).toHaveBeenCalledTimes(1);
    })
})

describe ('CouponAdd tests', () => {
    it('should display correct details --percentage mode --active', async () => {
        const coupon: Coupon = BuildCoupon({count: 1});
        couponGetSpy.mockImplementation(() => Promise.resolve(coupon));
        const props: any = {match: { params: {id: coupon.id}}}
        component = await mount(
            <CouponAdd {...props} />
        )
        await component.update();

        expect(component.find('.edit_coupon__code').text()).toContain(coupon.code);
        expect(component.find('.edit_coupon__email').text()).toContain(coupon.email);
        expect(component.find('.edit_coupon__mode').instance().value).toBe("0");
        expect(component.find('.edit_coupon__start_value').length).toBe(1);
        expect(component.find('.edit_coupon__current_value').length).toBe(0);
        expect(component.find('.edit_coupon__active--active').length).toBe(1);
    })

    it('should display correct details --fixed price mode --inactive', async () => {
        const coupon: Coupon = BuildCoupon({count: 1, mode: 1, active: false});
        couponGetSpy.mockImplementation(() => Promise.resolve(coupon));
        const props: any = {match: { params: {id: coupon.id}}};
        component = await mount(
            <CouponAdd {...props} />
        )
        await component.update();
        expect(component.find('.edit_coupon__mode').instance().value).toBe("1");
        expect(component.find('.edit_coupon__start_value').length).toBe(1);
        expect(component.find('.edit_coupon__current_value').length).toBe(1);
        expect(component.find('.edit_coupon__active--inactive').length).toBe(1);
    })
})