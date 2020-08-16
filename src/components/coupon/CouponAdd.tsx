import React, { Fragment } from 'react';

import couponService from '../../services/CouponService';
import Coupon from "../../models/Coupon";
import LoadingOverlay from "../overlays/LoadingOverlay";
import {RouteComponentProps} from 'react-router-dom'

interface State {
    saving: boolean,
    coupon: Coupon
}

export default class CouponAdd extends React.Component<RouteComponentProps, State> {

    state = {
        saving: false,
        coupon: new Coupon()
    }

    private cancel = (): void => {
        if (window.confirm('Are you sure you want to cancel?'))
            this.props.history.push('/dashboard/coupons');
    }

    private save = (): void => {
        this.setState({saving: true});

        let coupon: Coupon = this.state.coupon;

        if (coupon.mode === 0 && coupon.start_value > 1)
            coupon.start_value = coupon.start_value * .01

        couponService.add<Coupon>(this.state.coupon)
            .then(() => this.props.history.push({pathname: '/dashboard/coupons'}))
            .catch( err => alert('unable to add coupon'))
            .finally(() => this.setState({saving: false}));
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        let coupon: any = this.state.coupon;
        coupon[e.target.id] = e.target.value;
        this.setState({coupon});
    }

    public render() {
        if (this.state.saving)
            return <LoadingOverlay />

        return (
            <div className={'row justify-content-center edit_coupon'}>
                <div className={'col-12 col-md-4'}>
                    <h3>Add Coupon</h3>
                    <div className={'row'}>
                        <div className={'col-12 col-6 mt-3'}>
                            Type:
                            <select id={'mode'} className={'form-control edit_coupon__mode'}
                                value={this.state.coupon.mode}
                                onChange={this.updateData}>
                                <option value={0}>percentage</option>
                                <option value={1}>fixed value</option>
                            </select>
                        </div>
                        <div className={'col-12 col-6 mt-3 edit_coupon__start_value'}>
                            value:
                            <input
                                id={'start_value'}
                                value={this.state.coupon.start_value || ''}
                                onChange={this.updateData}
                                className={'form-control'} />
                        </div>
                        <div className={'col-12 col-6 mt-3 edit_coupon__email'}>
                            uses:
                            <input
                                id={'remaining_uses'}
                                type={'number'}
                                value={this.state.coupon.remaining_uses}
                                onChange={this.updateData}
                                className={'form-control'} />
                        </div>
                        <div className={'col-12 col-6 mt-3 edit_coupon__email'}>
                            expire:
                            <input
                                id={'expire'}
                                value={this.state.coupon.expire}
                                onChange={this.updateData}
                                type={'date'}
                                className={'form-control'} />
                        </div>
                        <div className={'col-12 col-6 mt-3 edit_coupon__email'}>
                            email:
                            <input
                                id={'email'}
                                value={this.state.coupon.email}
                                onChange={this.updateData}
                                className={'form-control'} />
                        </div>
                        <div className={'col-12 mt-3'}>
                            <div className={'row justify-content-center'}>
                                <button className={'btn btn-success mr-3'} onClick={this.save}>
                                    save
                                </button>
                                <button className={'btn btn-outline-default edit_coupon__cancel'} onClick={this.cancel}>
                                    cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.saving &&
                    <LoadingOverlay />
                }

            </div>
        )
    }
}