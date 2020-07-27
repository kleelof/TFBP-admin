import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

import couponService from './CouponService';
import { BuildCoupon } from '../../__mocks__/mockFactories';

//configure({adapter: new Adapter()});

//let postSpy = jest.spyOn(axiosInstance, 'post');

describe('Service Tests', () => {
    describe('CRUD tests', () => {
        it('should ADD', () => {
            //couponService.add(BuildCoupon({count: 1}));
            //expect(postSpy).toBeCalledWith({});
        })
    })
})