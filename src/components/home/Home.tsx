import React from 'react';
import {SubNavigation} from "../nav/SubNavigation";
import BrowserTool from "../browser_tool/BrowserTool";


export default class Home extends React.Component<any, any>{
    public render() {
        return(
            <div className={'row home'}>
                <SubNavigation navItems={[
                    {title: 'Browser', link:'/dashboard/browser'},
                ]} />
            </div>
        )
    }
}