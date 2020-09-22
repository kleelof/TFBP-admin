import React, {useState} from 'react';

import './loading_icon_button.scss';
interface Props {
    label: string,
    onClick: any,
    btnClass?: string,
    disabled?: boolean
}

export const LoadingIconButton = (props: Props): React.ReactElement => {
    const [showAnimation, setShowAnimation] = useState(false);
    const [disabled, setDisabled] = useState<boolean>(props.disabled !== undefined ? props.disabled : false);

    const onClick = (): void => {
        setDisabled(true);
        setShowAnimation(true)
        props.onClick(stopAnimation)
    }

    const stopAnimation = (): void => {
        setDisabled(false);
        setShowAnimation(false);
    }

    return (
        <div className='loading_icon_button'>
            <button
                className={
                    `${props.btnClass !== undefined ? props.btnClass : ''}`
                }
                onClick={onClick}
                disabled={disabled}
            >{props.label}</button>
            {showAnimation &&
                <div className='loading_icon_button__loader_layer'>
                    <div className='loading_icon_button__loader'></div>
                </div>
            }
        </div>
    )
}