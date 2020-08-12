import React, { useEffect } from 'react';

import './overlays.scss';

interface Props {
    component: React.ReactElement,
    closeCallback?: any
}

//TODO: Change FullOverlay to autoclose instead of App closing it.
export const FullOverlay = (props: Props): React.ReactElement => {
    const body: any = window.document.getElementById("body");
    body.classList.add('noscroll');
    const root: any = window.document.getElementById("root");
    root.classList.add('noscroll');

    useEffect(() => {
        const body: any = window.document.getElementById("body");
        body.classList.add('noscroll');
        const root: any = window.document.getElementById("root");
        root.classList.add('noscroll');
        return () => {
            body.classList.remove('noscroll');
            root.classList.remove('noscroll');
        }
    })

    return(
        <div className="overlay no-gutter">
            <script>document.getElementById("body").className += 'noscroll';console.log('xxxxx');</script>
            <div className="overlay-inner">
                {((props.closeCallback !== null && props.closeCallback !== undefined)) && 
                    <div className="col-12x  text-right mb-3 ">
                        <div className="overlay-close" onClick={()=> props.closeCallback()}>X</div>
                    </div>
                }
                <div className='row no-gutter'>
                    <div className="col-12 overlay-component">
                        {props.component}
                    </div>
                </div>
            </div> 
        </div>
    )
}
