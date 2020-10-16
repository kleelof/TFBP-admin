import React, {useState} from 'react';

import './loading_icon_button.scss';
interface Props {
    label: string,
    onClick: any,
    busy: boolean,
    btnClass?: string,
    disabledBtnClass?: string,
    disabled?: boolean,
    outerClass?: string
}

export const LoadingIconButton = (props: Props): React.ReactElement => {

    const disabled: boolean = props.disabled !== undefined ? props.disabled : false;

    return (
        <div className={`loading_icon_button ${props.outerClass !== undefined ? props.outerClass : ''}`}>
            <button
                className={
                    `${
                        disabled ?
                            props.disabledBtnClass !== undefined ?
                                props.disabledBtnClass : 
                                props.btnClass !== undefined ?
                                    props.btnClass : ''
                            :
                            props.btnClass !== undefined ?
                                props.btnClass : ''
                    }`
                }
                onClick={props.onClick}
                disabled={disabled}
            >{props.label}</button>
            {props.busy &&
                <div className='loading_icon_button__loader_layer'>
                    <div className='loading_icon_button__loader'></div>
                </div>
            }
        </div>
    )
}