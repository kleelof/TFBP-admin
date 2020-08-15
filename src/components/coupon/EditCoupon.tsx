import React, { Fragment } from 'react';

import couponService from '../../services/CouponService';
import Coupon from "../../models/Coupon";
import LoadingOverlay from "../overlays/LoadingOverlay";

interface State {
    loading: boolean,
    coupon: Coupon
}

export default class EditCoupon extends React.Component<any, State> {

    state = {
        loading: true,
        coupon: new Coupon()
    }

    public componentDidMount() {
        const { match: { params }} = this.props;

        couponService.get<Coupon>(params.id)
            .then((coupon: Coupon) => {
                this.setState({coupon, loading: false});
            })
            .catch( err => window.alert('unable to load coupon'))
    }

    private toggleActive = (): void => {

    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        let coupon: any = this.state.coupon;
        coupon[e.target.id] = e.target.value;
        this.setState({coupon});
    }

    public render() {
        if (this.state.loading)
            return <LoadingOverlay />

        return (
            <div className={'row justify-content-center edit_coupon'}>
                <div className={'col-12 col-md-9'}>
                    <div className={'row'}>
                        <div className={'col-12 col-6 edit_coupon__code'}>
                            Code: {this.state.coupon.code}
                        </div>
                        <div className={'col-12 col-6 mt-3 edit_coupon__email'}>
                            Email: {this.state.coupon.email}
                        </div>
                        <div className={'col-12 col-6 mt-3'}>
                            Type:
                            <select id={'mode'} className={' edit_coupon__mode'}
                                value={this.state.coupon.mode}
                                onChange={this.updateData}>
                                <option value={0}>percentage</option>
                                <option value={1}>fixed value</option>
                            </select>
                        </div>
                        <div className={'col-12 mt-3'}>
                            <div className={'row'}>
                                {
                                    this.state.coupon.mode === 0 ?
                                        <div className={'col-12 col-6 edit_coupon__start_value'}>
                                            percentage: ( '.20' = 20% )
                                            <input
                                                id={'start_value'}
                                                value={this.state.coupon.start_value || ''}
                                                onChange={this.updateData}
                                                className={'form-control'} />
                                        </div>
                                        :
                                        <Fragment>
                                            <div className={'col-12 col-6 edit_coupon__start_value'}>
                                                start value:
                                                <input
                                                    id={'start_value'}
                                                    value={this.state.coupon.start_value || ''}
                                                    onChange={this.updateData}
                                                    className={'form-control'} />
                                            </div>
                                            <div className={'col-12 col-6 mt-3 edit_coupon__current_value'}>
                                                current value:
                                                <input
                                                    id={'current_value'}
                                                    value={this.state.coupon.current_value || ''}
                                                    onChange={this.updateData}
                                                    className={'form-control'} />
                                            </div>
                                        </Fragment>
                                }
                            </div>
                        </div>
                        <div className={'col-12 mt-3'}>
                            <div className={'row justify-content-center'}>
                                <button className={'btn btn-success mr-3'}>
                                    update
                                </button>
                                {
                                    this.state.coupon.active ?
                                        <button className={'btn btn-outline-danger edit_coupon__active--active'} onClick={this.toggleActive}>
                                            deactivate
                                        </button>
                                        :
                                        <button className={'btn btn-outline-success edit_coupon__active--inactive'} onClick={this.toggleActive}>
                                            activate
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}