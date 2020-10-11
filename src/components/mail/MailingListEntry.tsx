import React, {useState} from 'react';
import MailingListModel from "../../models/MailingListModel";
import mailingListService from '../../services/MailingListService';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";

interface Props {
    dto: MailingListModel
}

export const MailingListEntry = (props: Props): React.ReactElement => {
    let checkDTO: MailingListModel = props.dto;
    const [code, setCode] = useState<string>(checkDTO.code);
    const [active, setActive] = useState<boolean>(checkDTO.active);
    const [email, setEmail] = useState<string>(checkDTO.email);
    const [saving, setSaving] = useState(false);

    const save = (): void => {
        setSaving(true);
        mailingListService.update<MailingListModel>(new MailingListModel(checkDTO.id, email, code, active))
            .then((dto:MailingListModel) => {
                checkDTO = dto;
                setSaving(false);
            })
            .catch( err => window.alert('unable to update entry'))
    }

    const disabled: boolean = code === checkDTO.code && active === checkDTO.active && email === checkDTO.email;

    return (
        <tr>
            <td className='d-none d-md-table-cell'>
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
                <LoadingIconButton
                    label='save'
                    onClick={save}
                    busy={saving}
                    btnClass='btn btn-outline-success'
                    outerClass='mailing_list__save_btn'
                    disabled={disabled}
                    />
            </td>
        </tr>
    )
}