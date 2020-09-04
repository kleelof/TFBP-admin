import React from "react";
import {shallow, configure, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {BrowserDay} from "./BrowserDay";
import BrowserTool from "./BrowserTool";
import {months} from '../../constants';
import deliveryWindowService from '../../services/DeliveryWindowService';
import {BuildDeliveryWindow} from "../../../__mocks__/deliveryMocks";
import {DeliveryTagsDisplay, PrepDisplay} from "./BrowserWindowTools";
import {BuildMenuItem, BuildOrder, BuildOrderItem} from "../../../__mocks__/mockFactories";
import {BuildCartItem} from "../../../__mocks__/cartMocks";
import {BrowserRouter as Router} from 'react-router-dom';

configure({adapter: new Adapter()});

let component: any;
let props: any;
let date: Date;

let retrieveWithCountsSpy: jest.SpyInstance = jest.spyOn(deliveryWindowService, 'listWithCounts');

describe('BrowserDay tests', () => {
    beforeAll(() => {
        date = new Date();
        retrieveWithCountsSpy.mockReturnValue([
            {
                dish_count: 3,
                order_count: 8,
                window: BuildDeliveryWindow({count: 1})
            },
            {
                dish_count: 6,
                order_count: 3,
                window: BuildDeliveryWindow({count: 1})
            }
        ])
        component = shallow(<BrowserDay date={date} />)
    })

    it('should display the correct date', () => {
        expect(component.find('.browser_day__date').text()).toContain(date.getDate().toString())
    })

    it('should load and display windows with counts', async () => {
    })
})

describe('BrowserTool tests', () => {
    beforeEach(() => {
        date = new Date();
        props = {
            match: {
                params: {}
            },
            history:{
                push: jest.fn()
            }
        }
        component = shallow(<BrowserTool {...props}/>);
    })

    it('should display correct month and year; default current month and year', () => {
        expect(component.find('.month_nav__date').text()).toContain(months[date.getMonth()]);
        expect(component.find('.month_nav__date').text()).toContain(date.getFullYear().toString());
    })

    it('should display correct month and year when supplied', () => {
        props= {
            match: {
                params: {
                    month: date.getMonth() + 1,
                    year: (date.getFullYear() + 1)
                }
            }
        }
        component = shallow(<BrowserTool {...props}/>);
        expect(component.find('.month_nav__date').text()).toContain(months[date.getMonth() + 1]);
        expect(component.find('.month_nav__date').text()).toContain((date.getFullYear() + 1).toString());
    })

    it('should advance the month', () => {
        component.find('#month_nav__next_month').simulate('click');
        expect(component.find('.month_nav__date').text()).toContain(months[date.getMonth() + 1]);
    })

    it('should decrement the month', () => {
        component.find('#month_nav__last_month').simulate('click');
        expect(component.find('.month_nav__date').text()).toContain(months[date.getMonth() - 1]);
    })

    it('should advance the month into the next year', () => {
        jest.spyOn(Date.prototype, 'getMonth').mockReturnValue(11);
        jest.spyOn(Date.prototype, 'getDate').mockReturnValue(31);

        component = shallow(<BrowserTool {...props}/>);
        component.find('#month_nav__next_month').simulate('click');

        expect(component.find('.month_nav__date').text()).toContain(months[0]);
        expect(component.find('.month_nav__date').text()).toContain((date.getFullYear() + 1).toString());
    })

    it('should decrement the month into the previous year', () => {
        jest.spyOn(Date.prototype, 'getMonth').mockReturnValue(0);
        jest.spyOn(Date.prototype, 'getDate').mockReturnValue(1);

        component = shallow(<BrowserTool {...props}/>);
        component.find('#month_nav__last_month').simulate('click');

        expect(component.find('.month_nav__date').text()).toContain(months[11]);
        expect(component.find('.month_nav__date').text()).toContain((date.getFullYear() - 1).toString());
    })

    it('should display the correct number of days', () => {
        const numberOfDays: number = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const browserDays: number = component.find(BrowserDay).length

        expect(browserDays).not.toBe(0);
        expect(browserDays).toBe(numberOfDays);
    })
})

describe('BrowserWindowTools tests', () => {
    describe('DeliveryTagsDisplay tests', () => {
        let order_1: any;
        let order_2: any;

        beforeAll(() => {
            order_1 = BuildOrder({
                    count: 1,
                    orderItems: [
                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({count: 1})
                        }),
                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({count: 1})
                        })
                    ]
                })
            order_2 = BuildOrder({
                    count: 1,
                    orderItems: [
                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({count: 1})
                        }),
                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({count: 1})
                        })
                    ]
                })
            component = shallow(
                <DeliveryTagsDisplay orders={[order_1, order_2]} date={new Date('2020-07-04')} />
            )
        })



        it('should display all info', () => {
            expect(component.find('.quarter-page').length).toBe(2);
            expect(component.find('.delivery-tag-item').length).toBe(4);

            const component_text = component.text();
            expect(component_text).toContain(order_1.contact_name);
            expect(component_text).toContain(order_1.street_address);
            expect(component_text).toContain(order_1.phone_number);

            expect(component_text).toContain(order_2.contact_name);
            expect(component_text).toContain(order_2.street_address);
            expect(component_text).toContain(order_2.phone_number);
        })
    })

    describe('PrepDisplay tests', () => {
        beforeEach(() => {
            component = shallow(
                <PrepDisplay
                    orderItems={[
                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({
                                count: 1,
                                menuItem: BuildMenuItem({count: 1, name: 'menu_item_a'})
                            })
                        }),
                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({
                                count: 1,
                                menuItem: BuildMenuItem({count: 1, name: 'menu_item_a'})
                            })
                        }),

                        BuildOrderItem({
                            count: 1,
                            cartItem: BuildCartItem({
                                count: 1,
                                menuItem: BuildMenuItem({count: 1, name: 'menu_item_b'})
                            })
                        })
                    ]}
                    date={new Date('2020-07-04')}/>)
        })

        it('should display all info', () => {
            expect(component.find('.print-sheet-header').text()).toContain(3);
            expect(component.text()).toContain('2020-07-04');
            expect(component.find('tbody tr').length).toBe(2);
        })
    })
})