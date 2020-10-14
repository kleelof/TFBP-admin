import React from "react";
import printIcon from '../../../assets/print_icon.png';
import './print_button.scss';

interface Props {
    prompt: string
}

export const PrintButton = (props: Props): React.ReactElement => {

    return (
        <div className='print_button'>
            <img
                src={printIcon}
                alt={`print ${props.prompt}`}
                />
        </div>
    )
}