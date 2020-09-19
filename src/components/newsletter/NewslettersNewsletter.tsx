import React from 'react';
import Newsletter from "../../models/Newsletter";
import helpers from '../../helpers/helpers';
import momentHelper from '../../helpers/MomentHelper';
import { useHistory } from 'react-router-dom';

import './newsletter.scss';

interface Props {
    newsletter: Newsletter
}

export const NewslettersNewsletter = (props: Props): React.ReactElement => {
    const history = useHistory();

    return (
        <tr className={'newsletters_newsletter'}>
            <td>{props.newsletter.title}</td>
            <td>
                {
                    props.newsletter.release_date !== null && props.newsletter.release_date !== undefined ?
                        momentHelper.asFullDate(props.newsletter.release_date)
                        :
                        <span>click 'Edit' to release</span>
                }
            </td>
            <td>
                <button
                    className={'btn btn-outline-success'}
                    onClick={() => history.push({pathname: `/dashboard/newsletter/edit/${props.newsletter.id}`})}
                    >Edit</button>
            </td>
        </tr>
    )
}