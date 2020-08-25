import React from 'react';
import MailTemplateComponent from "./MailTemplateComponent";

export const MailTemplates = (): React.ReactElement => {
    const templateSlugs: string[] = [
        'upcoming-delivery',
        'upcoming-delivery-day'
    ]

    return(
        <div className={'row mail_template'}>
            <div className={'col-12'}>
                {
                    templateSlugs.map((slug: string) => <MailTemplateComponent templateSlug={slug} key={slug} />)
                }
            </div>
        </div>
    )
}