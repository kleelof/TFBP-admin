import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Export from './Export';

export default class Orders extends React.Component<any, any> {

    public render() {
        return(
            <Route path='/export' component={Export} />
        )
    }
}