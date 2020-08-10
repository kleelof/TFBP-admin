import React from 'react';

import loadingAnimation from '../../assets/loader.gif'
import './overlays.scss';

export default class LoadingOverlay extends React.Component<any, any> {

    //TODO: Add ability to override CSS. ex; change BG color/transparency

    public render() {
        return(
            <div className="loading-overlay">
                <img src={loadingAnimation} alt="loadingIcon"/>
            </div>
        )
    }
}