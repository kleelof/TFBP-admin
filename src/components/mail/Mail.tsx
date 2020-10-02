import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MailingList from "./MailingList";
import {MailTemplates} from "./MailTemplates";
import MailMassMailer from "./MailMassMailer";

export const Mail = (): React.ReactElement => {

    return(
        <div className='row mail'>
            <div className="col-12">
                <Switch>
                    <Route path="/dashboard/mail/list/" component={MailingList} />
                    <Route path={'/dashboard/mail/template'} component={MailTemplates} />
                    <Route path={'/dashboard/mail/mass_mailer/:mail_type/:option'} component={MailMassMailer} />
                    <Route path={'/dashboard/mail/mass_mailer'} component={MailMassMailer} />
                    <Route path="/dashboard/mail/" component={MailTemplates} />
                </Switch>
            </div>
        </div>
    )
}