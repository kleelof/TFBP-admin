import React from 'react';

import Coupon from '../../models/Coupon';
import helpers from '../../helpers/helpers';

import './coupon.scss';

interface Props {
    coupon: Coupon
}

export const CouponComponent = (props: Props): React.ReactElement => {
    const types: string[] = ['percentage', 'fixed'];

    return (
        <tr className={'coupon'}>
            <td></td>
            <td className={'coupon__code'}>{props.coupon.code}</td>
            <td className={'coupon__mode'}>{types[props.coupon.mode]}</td>
            <td className={'coupon__uses'}>{props.coupon.remaining_uses}</td>
            <td className={'coupon__start_value'}>
                {
                    props.coupon.mode === 0 ?
                        `${props.coupon.start_value * 100}%`
                        :
                        `$${props.coupon.start_value.toFixed(2)}`
                }
            </td>
            <td className={'coupon__end_value'}>
                {
                    props.coupon.mode === 0 ?
                        ``
                        :
                        `$${props.coupon.current_value.toFixed(2)}`
                }
            </td>
            <td className={'coupon__expire'}>
                {helpers.formatDate(props.coupon.expire)}
            </td>
            <td className={'coupon__email'}>
                {props.coupon.email}
            </td>
        </tr>
    )
}