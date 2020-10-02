import React, { Fragment } from 'react';

import deliveryWindowService from '../../services/DeliveryWindowService';
import deliveryDayService from '../../services/DeliveryDayService';
import DeliveryDay from "../../models/DeliveryDayModel";
import DeliveryWindow from "../../models/DeliveryWindowModel";
import adminService from '../../services/APIActionService';

interface Props {
    match: any
}

interface State {
    who: string,
    deliveryDays: DeliveryDay[],
    deliveryWindows: DeliveryWindow[],
    message: string,
    deliveryWindowId: number,
    deliveryDate: string,
    deliveryDay: DeliveryDay,
    includeSamples: boolean
}

export default class MailMassMailer extends React.Component<Props, State> {
    state = {
        who: 'all_customers',
        deliveryDays: [],
        deliveryWindows: [],
        message: '',
        deliveryWindowId: 0,
        deliveryDate: '',
        deliveryDay: new DeliveryDay(),
        includeSamples: false
    }

    public componentDidMount = (): void => {
        Promise.all([
            deliveryDayService.get<DeliveryDay[]>(),
            deliveryWindowService.get<DeliveryWindow>()
        ])
            .then((values) => {
                // defaults for state
                let who: string = 'all_customers';
                let deliveryDate: string = '';
                const deliveryWindows: DeliveryWindow[] = values[1] as any;
                const deliveryWindow: DeliveryWindow = deliveryWindows.length > 0 ?
                    deliveryWindows[0] : new DeliveryWindow();
                const deliveryDay: DeliveryDay = values[0].length > 0 ?
                    values[0][0] : new DeliveryDay()

                //check if a type of email and option were sent
                const { match: { params }} = this.props;
                const option: any = 'option' in params ? params['option'] : '';

                if ('mail_type' in params) {
                    switch(params['mail_type']) {
                        case('upcoming_delivery'):
                            who = 'upcoming_delivery';
                            deliveryDate = option;
                            break;
                    }
                }

                this.setState({
                    who,
                    deliveryDate,
                    deliveryDays: values[0],
                    deliveryDay: deliveryDay,
                    deliveryWindows: deliveryWindows,
                    deliveryWindowId: deliveryWindow.id
                })
            })
    }

    private goodToSend = (): boolean => {
        const who: string = this.state.who;

        if (this.state.message === "") return false

        return  (
            who == 'all_customers' || who == 'delivery_window' || who == 'upcoming_delivery_days' ||
            (who == 'upcoming_delivery' && this.state.deliveryDate !== '')
        )
    }

    private sendMail = (): void => {
        let confirmMessage: string = 'Send to all customers';
        let options: any = {}

        if (this.state.includeSamples) options['include_menu_sample'] = true

        switch (this.state.who){
            case 'delivery_window':
                confirmMessage = `Send to customers in the selected delivery window.`;
                options['delivery_window'] = this.state.deliveryWindowId;
                break;

            case 'upcoming_delivery':
                confirmMessage = `Send to customers receiving a delivery on: ${this.state.deliveryDate}`;
                options['delivery_date'] = this.state.deliveryDate;
                //TODO: Need to implement this
                break;

            case 'upcoming_delivery_days':
                confirmMessage = `Send to customers in the delivery days ${this.state.deliveryDay.date} to ${this.state.deliveryDay.end_date}`
                break;

            default:
                options['all_customers'] = true;
        }

        if (!window.confirm(`You about to initiate the following: \n\n${confirmMessage}\n\nContinue?`)) return

        adminService.sendMassMail(this.state.message, options)
            .then((resp: any) => {
                if(resp.count === 0 ){
                    window.alert(`${confirmMessage} did not produce any emails.`);
                    return;
                } else {
                    if(!window.confirm(`${confirmMessage}\n\nwill produce approx. ${resp.count} emails.\n\nSend?`))
                        return

                    adminService.sendMassMail(this.state.message, options, true)
                        .then((resp: any) => window.alert(`${resp.count} emails were sent`))
                }
            })
    }

    public render() {
        return(
            <div className={'row mass_mailer justify-content-center'}>
                <div className={'col-12 col-md-6'}>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <h3>mass mailer</h3>
                            <hr/>
                        </div>
                        <div className={'col-12'}>
                            <label>message:</label>
                            <textarea
                                className={'mass_mailer__message form-control'}
                                value={this.state.message}
                                onChange={(e) => this.setState({message: e.target.value})}
                            ></textarea>
                            ({this.state.message.length} characters)
                        </div>
                        <div className={'col-12 mt-3 mass_mailer_send_to'}>
                            send to:<br/>
                            <div className={'mass_mailer_send_to__option'}>
                                <input type={'radio'}
                                       name={'to'}
                                       id={'all_customers'}
                                       checked={this.state.who === 'all_customers'}
                                       onChange={() => this.setState({who: 'all_customers'})}/> all customers<br/>
                                       <span>anyone who has completed an order</span>
                            </div>
                            <div className={'mass_mailer_send_to__option'}>
                                <input type={'radio'} name={'to'}
                                       id={'delivery_window'}
                                       disabled={this.state.deliveryWindows.length === 0}
                                       checked={this.state.who === 'delivery_window'}
                                       onChange={() => this.setState({who: 'delivery_window'})}/> delivery window<br/>
                                       <span>customers in the window selected below</span>
                            </div>
                            <div className={'mass_mailer_send_to__option'}>
                                <input type={'radio'} name={'to'}
                                   id={'upcoming_delivery'}
                                   checked={this.state.who === 'upcoming_delivery'}
                                   onChange={() => this.setState({who: 'upcoming_delivery'})} /> upcoming delivery<br/>
                                   <span>customers receiving a delivery on the date selected below</span>
                            </div>
                            <div className={'mass_mailer_send_to__option'}>
                                <input type={'radio'} name={'to'}
                                   id={'upcoming_delivery_days'}
                                   disabled={this.state.deliveryDays.length === 0}
                                   checked={this.state.who === 'upcoming_delivery_days'}
                                   onChange={() => this.setState({who: 'upcoming_delivery_days'})} /> upcoming delivery days<br/>
                                   <span>customers receiving an order during the deliver days selected below</span>
                            </div>

                        </div>
                        <div className={'col-12 mt-3 mass_mailer__options'}>
                            {this.state.who === 'upcoming_delivery' &&
                                <Fragment>
                                    select a delivery day:
                                    <input
                                        type={'date'}
                                        value={this.state.deliveryDate}
                                        onChange={(e) =>
                                            this.setState({deliveryDate: e.target.value})}
                                        className={'form-control options__upcoming_delivery'} />
                                </Fragment>
                            }
                            {this.state.who === 'upcoming_delivery_days' &&
                                <Fragment>
                                    select delivery days:
                                    <select className={'form-control options__upcoming_delivery_days'}>
                                        {
                                            this.state.deliveryDays.map((deliveryDay: DeliveryDay) =>
                                                <option key={`dd_${deliveryDay.id}`}>
                                                    {`${deliveryDay.date} to ${deliveryDay.end_date}`}
                                                </option>
                                            )
                                        }
                                    </select>
                                </Fragment>
                            }
                            {this.state.who === 'delivery_window' &&
                                <Fragment>
                                    select delivery window:
                                    <select
                                        className={'form-control options__delivery_windows'}
                                        onChange={(e) =>
                                            this.setState({deliveryWindowId: parseInt(e.target.value)})}>
                                        {
                                            this.state.deliveryWindows.map((window: DeliveryWindow) =>
                                                <option key={`wi_${window.id}`} value={window.id}>
                                                    {window.name}
                                                </option>
                                            )
                                        }
                                    </select>
                                </Fragment>
                            }
                        </div>
                        <div className={'col-12 mt-3 mass_mailer__includes'}>
                            {this.state.who !== 'upcoming_delivery_days'&&
                                <Fragment>
                                    <input
                                        type={'checkbox'}
                                        className={'includes__include_samples'}
                                        checked={this.state.includeSamples}
                                        onChange={(e) => this.setState(({includeSamples: !this.state.includeSamples}))}
                                    /> &nbsp;&nbsp;Include Upcoming Menu Samples
                                </Fragment>
                            }
                        </div>
                        <div className={'col-12 mt-3 mass_mailer__buttons text-center'}>
                            <button
                                className={'btn btn-outline-success buttons__send'}
                                disabled={!this.goodToSend()}
                                onClick={this.sendMail}
                                >Send Mass Mail</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}