import React from 'react';

import adminService from '../../services/AdminService';
import './mail.scss';
import FunctionsResponsesDTO from '../../dto/FunctionsResponsesDTO';

interface State {
    runningRemoteFunction: boolean
}
export default class MailUtilities extends React.Component<any, State> {

    state = {
        runningRemoteFunction: false
    }

    private doFunction = (e: React.MouseEvent): void => {
        if (!window.confirm("Are you sure you want to send mails?")) return;

        this.setState({runningRemoteFunction: true});
        adminService.sendWeeklyEmails()
            .then((resp: FunctionsResponsesDTO) => {
                window.alert(`${resp.send_count} emails were sent`);
                this.setState({runningRemoteFunction: false});
            })
    }

    render() {
        if (this.state.runningRemoteFunction)
            return(<div>One Moment...</div>)
        return(
            <div className="row mail-utilities">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <h3>Mass Mailings</h3>
                            <hr/>
                        </div>
                        <div className="col-3">
                            <button id="weekly_menu" className="btn btn-success" onClick={this.doFunction}>Weekly Menu</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}