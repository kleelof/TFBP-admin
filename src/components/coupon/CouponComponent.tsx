import React, {useEffect, useState} from 'react';

import Coupon from '../../models/CouponModel';
import momentHelper from '../../helpers/MomentHelper';

import './coupon.scss';
import couponService from '../../services/CouponService';

interface Props {
    coupon: Coupon,
    couponUpdated: (coupon: Coupon) => void
}

export const CouponComponent = (props: Props): React.ReactElement => {
    const modes: string[] = ['standard', 'one off'];
    const calculation_types: string[] = ['percentage', 'fixed'];
    const [coupon, setCoupon] = useState<Coupon>(props.coupon);
    const [deactivating, setDeactivating] = useState(false);

    const deactivateCoupon = (): void => {
        if (!window.confirm(`Are you sure you want to deactivate:\n${coupon.code}\n\nCoupons cannot be reactivated!`)) return;
        setDeactivating(true);
        coupon.active = false;
        couponService.update(coupon)
            .then((coupon: Coupon) => {
                setCoupon(coupon);
                props.couponUpdated(coupon);
            })
            .catch(
                err => console.log(err))
    }

    return (
        <tr className={`coupon ${!props.coupon.active ? 'coupon--inactive' : ''}`}>
            <td>
                { coupon.active &&
                    <button className={'btn btn-outline-danger coupon__deactivate'}
                            disabled={deactivating}
                            onClick={deactivateCoupon}
                    >X</button>
                }
            </td>
            <td className={'coupon__code'}>{coupon.code}</td>
            <td className={'coupon__mode d-none d-md-table-cell'}>{modes[coupon.mode]}</td>
            <td className={'coupon__mode d-none d-md-table-cell'}>{calculation_types[coupon.calculation_type]}</td>
            <td className={'coupon__uses'}>{coupon.remaining_uses}</td>
            <td className={'coupon__start_value d-none d-md-table-cell'}>
                {
                    props.coupon.calculation_type === 0 ?
                        `${coupon.start_value * 100}%`
                        :
                        `$${coupon.start_value.toFixed(2)}`
                }
            </td>
            <td className={'coupon__end_value d-none d-md-table-cell'}>
                {
                    coupon.calculation_type === 0 ?
                        ``
                        :
                        `$${coupon.current_value.toFixed(2)}`
                }
            </td>
            <td className={'coupon__expire'}>
                {momentHelper.asFullDate(coupon.expire)}
            </td>
            <td className={'coupon__email d-none d-md-table-cell'}>
                {coupon.email}
            </td>
        </tr>
    )
}