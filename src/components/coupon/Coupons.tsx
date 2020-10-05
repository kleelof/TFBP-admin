import React from 'react';
import Coupon from '../../models/Coupon';

import couponService from '../../services/CouponService';

import './coupon.scss';
import {CouponComponent} from "./CouponComponent";
import LoadingOverlay from "../overlays/LoadingOverlay";
import {RouteComponentProps} from 'react-router-dom';
import PagedResultsDTO from "../../dto/PagedResultsDTO";
import {PageSelector} from "../widgets/page_selector/PageSelector";

interface State {
    loading: boolean,
    coupons: Coupon[],
    addingCoupon: boolean,
    currentPage: number,
    paginationCount: number
}

export default class Coupons extends React.Component<RouteComponentProps, State> {

    state = {
        loading: true,
        coupons: [],
        addingCoupon: false,
        currentPage: 0,
        paginationCount: 0
    }

    public componentDidMount = (): void => {
        this.changePages(1);
    }

    private changePages = (pageNumber: number): void => {
        this.setState({currentPage: pageNumber, loading: true});

        couponService.pagedSearchResults(pageNumber)
            .then((dto: PagedResultsDTO) => {
                this.setState({
                    coupons: dto.results as Coupon[],
                    loading: false,
                    paginationCount: dto.count
                })
                }
            )
            .catch( err => console.log(err))
    }

    private couponUpdated = (coupon: Coupon): void => {
        this.setState({
            coupons: this.state.coupons.map((c: Coupon) => {
                if (c.id === coupon.id)
                    return coupon
                else
                    return c
            })
        })
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

        const coupons: Coupon[] = this.state.coupons.sort((a: Coupon, b:Coupon) => {
            return a.active < b.active ?
                1
                :
                a.active > b.active ?
                    -1 : 0
        })

        return(
            <div className="row coupons">
                <div className='col-12'>
                    <h3>coupons</h3>
                    <hr/>
                </div>
                <div className={'col-12'}>
                    <div className={'add_coupon'} onClick={() => this.props.history.push({pathname: '/dashboard/coupon/add'})}>
                        {
                            this.state.addingCoupon ?
                                'Creating coupon...'
                                :
                                '+ Add Coupon'
                        }
                    </div>
                    <PageSelector numItems={this.state.paginationCount} currentPage={this.state.currentPage} gotoPage={this.changePages} />
                </div>
                <div className={'col-12 mt-3'}>
                    {
                        coupons.length > 0 ?
                            <table className={'table'}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>code</th>
                                    <th className='d-none d-md-table-cell'>mode</th>
                                    <th className='d-none d-md-table-cell'>calculation</th>
                                    <th>uses</th>
                                    <th className='d-none d-md-table-cell'>start value</th>
                                    <th className='d-none d-md-table-cell'>current value</th>
                                    <th>expire</th>
                                    <th className='d-none d-md-table-cell'>email</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    coupons.map((coupon: Coupon) =>
                                        <CouponComponent
                                            coupon={coupon} key={`c_${coupon.id}`}
                                            couponUpdated={this.couponUpdated}/>
                                    )
                                }
                                </tbody>
                            </table>
                            :
                            <p>
                                Coupons can be used for ad campaigns, rewarding great customers or an option to refunding
                            </p>
                    }
                </div>
            </div>
        )
    }
}