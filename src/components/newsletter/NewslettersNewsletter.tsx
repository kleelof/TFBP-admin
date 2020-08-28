import React from 'react';
import Newsletter from "../../models/Newsletter";
import helpers from '../../helpers/helpers';
import { useHistory } from 'react-router-dom';

import './newsletter.scss';

interface Props {
    newsletter: Newsletter
}

export const NewslettersNewsletter = (props: Props): React.ReactElement => {
    const history = useHistory();

    return (
        <tr className={'row newsletters_newsletter'}>
            <td>{props.newsletter.title}</td>
            <td>
                {
                    props.newsletter.release_date !== null && props.newsletter.release_date !== undefined ?
                        helpers.formatDate(props.newsletter.release_date)
                        :
                        <button
                            className={'btn btn-outline-danger newsletters_newsletter__release_btn'}
                            >release</button>
                }
            </td>
            <td>
                <button
                    className={'btn btn-success'}
                    onClick={() => history.push({pathname: `/dashboard/newsletter/edit/${props.newsletter.id}`})}
                    >Edit</button>
            </td>
        </tr>
    )
}