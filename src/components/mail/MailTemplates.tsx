import React from 'react';
import MailTemplateComponent from "./MailTemplateComponent";

export const MailTemplates = (): React.ReactElement => {
    const templateSlugs: string[] = [
        'upcoming-delivery',
        'upcoming-delivery-day',
        'newsletter'
    ]

    return(
        <div className={'row mail_template'}>
            <div className={'col-12 mt-2'}>
                <h3>mass mail templates</h3>
                <hr/>
            </div>
            {
                templateSlugs.map((slug: string) => <MailTemplateComponent templateSlug={slug} key={slug} />)
            }
        </div>
    )
}