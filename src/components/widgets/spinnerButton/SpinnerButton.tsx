import React from 'react';

import checkmark from '../../../assets/save_checkmark.png';
import './spinner_button.scss';

interface Props {
    active: boolean;
}

export const SpinnerButton = (props: Props): React.ReactElement => {

    return (
        <div className={`spinner_button ${props.active ? '' : 'spinner_button--inactive'}`}>
            {
                props.active ?
                    <div className='spinner_button__loader'></div>
                    :
                    <div className='spinner_button__checkmark'>
                        <img src={checkmark} />
                    </div>
            }
        </div>
    )
}