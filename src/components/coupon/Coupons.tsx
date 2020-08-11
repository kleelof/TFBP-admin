import React from 'react';
import Coupon from '../../models/Coupon';

import couponService from '../../services/CouponService';

import './coupon.scss';

interface State {
    loading: boolean,
    coupons: Coupon[]
}

export default class Coupons extends React.Component<any, State> {

    state = {
        loading: true,
        coupons: []
    }

    public componentDidMount = (): void => {
        couponService.get<Coupon[]>()
            .then((coupons: Coupon[]) => this.setState({coupons, loading: false}))
            .catch( err => window.alert(err))
    }

    public render() {
        return(
            <div className="row coupons">
                <div className="col-12">
                    <table>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Type</th>
                                <th>Start</th>
                                <th>Current</th>
                                <th>Email</th>
                                <th>Expire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.coupons.map((coupon: Coupon) =>
                                    <tr className={`coupon ${coupon.id % 2 === 0 ? 'row-highlight' : ''}`} key={`c_${coupon.id}`}>
                                        <td>{coupon.code}</td>
                                        <td>{['percent', 'fixed'][coupon.mode]}</td>
                                        <td>{coupon.start_value.toFixed(2)}</td>
                                        <td>{coupon.current_value.toFixed(2)}</td>
                                        <td>{coupon.email !== null ? coupon.email : "no email"}</td>
                                        <td>{coupon.expire}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}