import React, {useEffect, useState} from 'react';
import Newsletter from '../../models/Newsletter';
import newsletterService from '../../services/NewsletterService';
import LoadingOverlay from "../overlays/LoadingOverlay";
import {NewslettersNewsletter} from "./NewslettersNewsletter";
import NewsletterAdd from "./NewsletterAdd";

export const Newsletters = (): React.ReactElement => {
    const[newsLetters, setNewsLetters] = useState<Newsletter[]>([]);
    const[loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        newsletterService.get<Newsletter[]>()
            .then((newsletters: Newsletter[]) => {
                setNewsLetters(newsletters);
                setLoading(false);
            })
            .catch( err => window.alert('unable to load newsletters'))
    }, [])

    if (loading)
        return <LoadingOverlay />

    // @ts-ignore
    // @ts-ignore
    return(
        <div className={'row newsletters'}>
            <div className={'col-12'}>
                <h3>newsletters</h3>
                <hr/>
            </div>
            <div className={'col-12 mb-2'}>
                <NewsletterAdd />
            </div>
            <div className={'col-12'}>
                {
                    newsLetters.length > 0 ?
                        <table className={'table'}>
                            <thead>
                                <tr>
                                    <th>title</th>
                                    <th>release</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newsLetters.map((newsletter: Newsletter) =>
                                        <NewslettersNewsletter newsletter={newsletter} key={`nl_${newsletter.id}`} />
                                    )
                                }
                            </tbody>
                        </table>
                        :
                        <p>
                            Newsletters are a great way to keep your customers updated about new menu items and your success
                        </p>
                }
            </div>
        </div>

    )
}