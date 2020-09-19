import React from 'react';
import {shallow, configure, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {SpinnerButton} from "./SpinnerButton";

configure({adapter: new Adapter()});

let component: any;

describe('SpinnerButton tests', () => {
    it('should show checkmark if not active', () => {
        component = shallow(<SpinnerButton active={false} />);
        expect(component.find('.spinner_button__checkmark').length).toBe(1);
        expect(component.find('.spinner_button--inactive').length).toBe(1);
    })

    it('should show spinning icon if active', () => {
        component = shallow(<SpinnerButton active={true} />);
        expect(component.find('.spinner_button__loader').length).toBe(1);
        expect(component.find('.spinner_button--inactive').length).toBe(0);
    })
})
