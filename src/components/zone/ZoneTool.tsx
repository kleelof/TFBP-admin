import React, {ChangeEvent, useState} from 'react';
import Zone from "../../models/ZoneModel";
import './zone.scss';
import Zipcode from "../../models/ZipcodeModel";
import {ZoneCode} from "./ZoneCode";
import zipService from '../../services/ZipService';

interface Props {
    zone: Zone
}

export const ZoneTool = (props: Props): React.ReactElement => {
    const [codes, setCodes] = useState<Zipcode[]>(props.zone.zip_codes);
    const [newCode, setNewCode] = useState<string>('');

    const removeCode = (code: Zipcode): void => {
        if (!window.confirm(`Are you sure you want to remove: ${code.code}?`)) return
        zipService.delete<Zipcode>(code.id)
            .then(() => setCodes(codes.filter((tcode: Zipcode) => tcode.code !== code.code)))
            .catch(() => window.alert('unable to remove code'))
    }

    const addCode = (): void => {

        if (codes.filter((code: Zipcode) => code.code === newCode).length > 0) {
            alert('that code already exists');
            return;
        }

        zipService.add<Zipcode>(new Zipcode(-1, newCode, props.zone.id))
            .then((code: Zipcode) => {
                setCodes([...codes, code]);
                setNewCode('');
            })
            .catch(() => window.alert('unable to add code'));
    }

    return (
        <div className={'row zone_tool'}>
            <div className={'col-12'}>
                <h3>{props.zone.name}</h3>
                <hr/>
            </div>
            <div className={'col-6'}>
                <div className={'zone_tool__codes'}>
                    {
                        codes.map((code: Zipcode) => <ZoneCode code={code} removeCode={removeCode} key={code.code} />)
                    }
                </div>
            </div>
            <div className={'col-6'}>
                <input className={'form-control'} placeholder={'new code'} value={newCode}
                       onChange={(e:ChangeEvent<HTMLInputElement>) => setNewCode(e.target.value)}
                />
                <div className={'btn btn-success zone_tool__add_btn mt-2'} onClick={addCode}>add code</div>
            </div>
        </div>
    )
}