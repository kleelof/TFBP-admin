import React from 'react';
import {NavItem, SubNavigation} from "../nav/SubNavigation";
import { Switch, Route } from 'react-router-dom';
import MailUtilities from "./MailUtilities";
import MailingList from "./MailingList";
import {MailTemplates} from "./MailTemplates";

export const Mail = (): React.ReactElement => {
    const navItems: NavItem[] = [
            {title: 'Utilities', link:'/dashboard/mail/utility'},
            {title: 'Templates', link:'/dashboard/mail/template'},
            {title: 'Mailing List', link:'/dashboard/mail/list'}
        ]

    return(
        <div className='row mail'>
            <div className={'col-12'}>
                <SubNavigation navItems={navItems} />
            </div>
            <div className="col-12">
                <Switch>
                    <Route path="/dashboard/mail/list/" component={MailingList} />
                    <Route path={'/dashboard/mail/template'} component={MailTemplates} />
                    <Route path="/dashboard/mail/" component={MailUtilities} />
                </Switch>
            </div>
        </div>
    )
}