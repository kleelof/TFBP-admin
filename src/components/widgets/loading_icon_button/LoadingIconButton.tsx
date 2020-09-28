import React, {useState} from 'react';

import './loading_icon_button.scss';
interface Props {
    label: string,
    onClick: any,
    busy: boolean,
    btnClass?: string,
    disabled?: boolean,
    outerClass?: string
}

export const LoadingIconButton = (props: Props): React.ReactElement => {

    return (
        <div className={`loading_icon_button ${props.outerClass !== undefined ? props.outerClass : ''}`}>
            <button
                className={
                    `${props.btnClass !== undefined ? props.btnClass : ''}`
                }
                onClick={props.onClick}
                disabled={props.disabled !== undefined ? props.disabled : false}
            >{props.label}</button>
            {props.busy &&
                <div className='loading_icon_button__loader_layer'>
                    <div className='loading_icon_button__loader'></div>
                </div>
            }
        </div>
    )
}