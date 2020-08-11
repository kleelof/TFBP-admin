import React from 'react';
import {shallow, configure, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SubNavigation, NavItem } from './SubNavigation';

configure({adapter: new Adapter()});

let component: any;
let spy1: any;

describe('SubNavigation tests', () => {

    beforeAll(() => {
        const navItems: NavItem[] = [
            {title: 'title_1', link: 'link_1'},
            {title: 'title_2', link: 'link_2'}
        ]
        component = shallow(
            <SubNavigation navItems={navItems}/>
        )
    })

    it('should list all items', () => {
        expect(component.find('.subnav__item').length).toEqual(2);
    })
})