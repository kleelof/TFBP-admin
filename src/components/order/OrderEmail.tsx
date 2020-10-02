import React from 'react';
import Order from "../../models/OrderModel";
import adminService from '../../services/APIActionService';

interface Props {
    order: Order
}

interface State {
    subject: string,
    body: string,
    include_order: boolean,
    submitting: boolean
}

export default class OrderEmail extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            subject: `Order ${props.order.public_id}`,
            body: '',
            include_order: true,
            submitting: false
        }
    }

    private submit = (): void => {
        this.setState(({submitting: true}));

        adminService.sendSupportEmail(
            this.props.order.email,
            this.state.subject,
            this.state.body,
            this.state.include_order ? this.props.order : null)
            .then(() => {
                window.alert('Email Sent');
                this.setState({subject: '', body: '', include_order: true})
            })
            .catch( err => window.alert('unable to send email'))
            .then(() => this.setState({submitting: false}))
    }

    private toggleIncludeOrder = (): void => {console.log(this.state.include_order)
        this.setState(({include_order: !this.state.include_order}));
    }

    private updateData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        this.setState({
            [e.target.id]: e.target.value as any,
        } as Pick<State, keyof State>);
    }

    public render() {
        return (
            <div className={`row order_email`}>
                <div className={`col-12 col-md-6`}>
                    <label>subject:</label>
                    <input className={'form-control order_email__subject'} id={'subject'}
                        value={this.state.subject} onChange={this.updateData} disabled={this.state.submitting}/>
                </div>
                <div className={'col-12 mt-3'}>
                    <label>Message</label>
                    <textarea className={'form-control order_email__body'} id={'body'} value={this.state.body}
                        onChange={this.updateData} disabled={this.state.submitting} rows={8}/>
                </div>
                <div className={'col-12 mt-3'}>
                    Include Order: &nbsp;&nbsp;
                    <input className={'order_email__include_order'} type={'checkbox'} id={'include_order'} checked={this.state.include_order}
                        onChange={this.toggleIncludeOrder} disabled={this.state.submitting}/>
                </div>
                <div className={'col-12 mt-3'}>
                    <button
                        className={'btn btn-outline-success order_email__submit'}
                        disabled={this.state.subject === '' || this.state.body === '' || this.state.submitting}
                        onClick={this.submit}
                        >Send Email</button>
                </div>
            </div>
        )
    }
}