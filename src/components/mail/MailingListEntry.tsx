import React, {useState} from 'react';
import MailingListModel from "../../models/MailingListModel";
import mailingListService from '../../services/MailingListService';

interface Props {
    dto: MailingListModel
}

export const MailingListEntry = (props: Props): React.ReactElement => {
    let checkDTO: MailingListModel = props.dto;
    const [code, setCode] = useState<string>(checkDTO.code);
    const [active, setActive] = useState<boolean>(checkDTO.active);
    const [email, setEmail] = useState<string>(checkDTO.email);

    const save = (): void => {
        mailingListService.update<MailingListModel>(checkDTO.id, new MailingListModel(email, code, active))
            .then((dto:MailingListModel) => {
                checkDTO = dto;
            })
            .catch( err => window.alert('unable to update entry'))
    }

    const disabled: boolean = code === checkDTO.code && active === checkDTO.active && email === checkDTO.email;

    return (
        <tr>
            <td>
                <input className={'form-control mailing_list__code'} value={code} type={'text'}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)} />
            </td>
            <td>
                <input className={'form-control mailing_list__email'} value={email} type={'email'}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
            </td>
            <td>
                <input className={'mailing_list__active'} type={'checkbox'} checked={active}
                       onChange={() => setActive(!active)} />
            </td>
            <td>
                <button className={'btn btn-outline-success mailing_list__save_btn'} disabled={disabled} onClick={save}
                >save</button>
            </td>
        </tr>
    )
}