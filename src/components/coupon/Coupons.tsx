import React from 'react';
import Coupon from '../../models/Coupon';

import couponService from '../../services/CouponService';

import './coupon.scss';
import {CouponComponent} from "./CouponComponent";
import LoadingOverlay from "../overlays/LoadingOverlay";
import {RouteComponentProps} from 'react-router-dom';

interface State {
    loading: boolean,
    coupons: Coupon[],
    addingCoupon: boolean
}

export default class Coupons extends React.Component<RouteComponentProps, State> {

    state = {
        loading: true,
        coupons: [],
        addingCoupon: false
    }

    public componentDidMount = (): void => {
        couponService.get<Coupon[]>()
            .then((coupons: Coupon[]) =>
                this.setState({coupons, loading: false}))
            .catch( err => console.log(err))
    }

    private addCoupon = (): void => {
        this.setState(({addingCoupon: true}));
        couponService.add<Coupon>(new Coupon())
            .then((coupon: Coupon) => {this.props.history.push({pathname: `/dashboard/coupon/edit/${coupon.id}`})})
            .catch( err => window.alert('Unable to create coupon'));
    }

    public render() {
        if (this.state.loading)
            return <LoadingOverlay />

        return(
            <div className="row coupons">
                <div className={'col-12 mb-2'}>
                    <div className={'add_coupon'} onClick={() => this.props.history.push({pathname: '/dashboard/coupon/add'})}>
                        {
                            this.state.addingCoupon ?
                                'Creating coupon...'
                                :
                                '+ Add Coupon'
                        }
                    </div>
                </div>
                <div className={'col-12'}>
                    <table className={'table'}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>code</th>
                                <th>type</th>
                                <th>uses</th>
                                <th>start value</th>
                                <th>current value</th>
                                <th>expire</th>
                                <th>email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.coupons.map((coupon: Coupon) =>
                                    <CouponComponent coupon={coupon} key={`c_${coupon.id}`} />
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}