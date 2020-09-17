import React from 'react';
import Zipcode from "../../models/ZipcodeModel";

import './zone.scss';

interface Props {
    code: Zipcode,
    removeCode: (code: Zipcode) => void
}

export const ZoneCode = (props: Props): React.ReactElement => {

    return (
        <div className={'zone_code'} onClick={() => props.removeCode(props.code)}>
            <div className={'zone_code__code'}>
                {props.code.code}
            </div>
        </div>
    )
}