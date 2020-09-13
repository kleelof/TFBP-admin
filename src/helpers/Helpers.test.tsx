import helpers from './helpers';

import {BuildDeliveryWindow} from '../../__mocks__/deliveryMocks';
import { DeliveryWindowDTO } from '../models/DeliveryWindowModel';
import OrderItem from '../models/OrderItemModel';
import { BuildOrderItem } from '../../__mocks__/mockFactories';
import { BuildCartItem } from '../../__mocks__/cartMocks';

describe('Helpers Tests', () => {
    it('Should convert 24hr to 12hr time', () => {
        expect(helpers.convertToTwelveHour('09:30:00')).toEqual('9:30 am');
        expect(helpers.convertToTwelveHour('12:00:00')).toEqual('12:00 pm');
        expect(helpers.convertToTwelveHour('13:00:00')).toEqual('1:00 pm');
        expect(helpers.convertToTwelveHour('00:00:00')).toEqual('12:00 am');
    })

    it('should sort order items by date', () => {
        const orderItems: OrderItem[] = [
            BuildOrderItem({count: 1, cartItem: BuildCartItem({count: 1, deliveryDate: '2020-07-05'})}),
            BuildOrderItem({count: 1, cartItem: BuildCartItem({count: 1, deliveryDate: '2020-07-06'})})
        ]
        expect(helpers.sortOrderItemsByDate(orderItems)['2020-07-05']).not.toBe({});
        expect(helpers.sortOrderItemsByDate(orderItems)['2020-07-06']).not.toBe({});
    })

    describe('format delivery window text', () => {

        it('should format delivery window text with date', () => {
            const tDeliveryWindow: DeliveryWindowDTO = {date: '2020-07-04', window: BuildDeliveryWindow({count: 1})}
            expect(helpers.formatDeliveryWindow(tDeliveryWindow)).toEqual('Saturday July 4, 2020 between 1:01 am and 2:02 am');
        })

        it('should format delivery window text without date', () => {
            const tDeliveryWindow: DeliveryWindowDTO = {date: '2020-07-04', window: BuildDeliveryWindow({count: 1})}
            expect(helpers.formatDeliveryWindow(tDeliveryWindow, true)).toEqual('1:01 am and 2:02 am');
        })

        it('should give single time if start and end are same', () => {
            const tDeliveryWindow: DeliveryWindowDTO = {
                date: '2020-07-04',
                window: BuildDeliveryWindow({count: 1, start_time: '03:03:03', end_time: '03:03:03'})
            }
            expect(helpers.formatDeliveryWindow(tDeliveryWindow, true)).toEqual('3:03 am');
        })

        it('should have "at" if single time with date', () => {
            const tDeliveryWindow: DeliveryWindowDTO = {
                date: '2020-07-04',
                window: BuildDeliveryWindow({count: 1, start_time: '03:03:03', end_time: '03:03:03'})
            }
            expect(helpers.formatDeliveryWindow(tDeliveryWindow)).toContain('at');
        })

        it('should have "between" if end !== start time with date', () => {
            const tDeliveryWindow: DeliveryWindowDTO = {
                date: '2020-07-04',
                window: BuildDeliveryWindow({count: 1, start_time: '03:03:03', end_time: '04:03:03'})
            }
            expect(helpers.formatDeliveryWindow(tDeliveryWindow)).toContain('between');
        })
    })
})