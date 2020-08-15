import React from 'react';

import Coupon from '../../models/Coupon';
import helpers from '../../helpers/helpers';

import './coupon.scss';

interface Props {
    coupon: Coupon
}

export const CouponComponent = (props: Props): React.ReactElement => {
    return (
        <div className={'row coupon'}>
            <div className={'col-8 coupon__code'}>
                {props.coupon.code}
            </div>
            <div className={`col-4 coupon__active coupon__active-${props.coupon.active ? 'active' : 'inactive'}`}>
                {props.coupon.active ? 'active' : 'inactive'}
            </div>
            <div className={'col-12 coupon__value'}>
            {
                props.coupon.mode === 0 ?
                    <span> percentage coupon: {props.coupon.start_value * 100}% </span>
                    :
                    <span>
                        fixed price coupon: ${props.coupon.current_value.toFixed(2)} original value: ${props.coupon.start_value.toFixed(2)}
                    </span>
            }
            </div>
            <div className={'col-12 coupon__expire'}>
                expire: {helpers.formatDate(props.coupon.expire)}
            </div>
            <div className={'col-12 coupon__email'}>
                email: {props.coupon.email}
            </div>
        </div>
    )
}