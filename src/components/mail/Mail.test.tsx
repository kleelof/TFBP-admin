import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import {MailTemplates} from "./MailTemplates";
import MailTemplateComponent from "./MailTemplateComponent";

configure({adapter: new Adapter()});

let component: any;

describe('MailTemplates tests', () => {
    beforeEach(() => {
        component = shallow(
            <MailTemplates />
        )
    })
    it('should list all templates', () => {
        expect(component.find(MailTemplateComponent).length).toEqual(2);
    })
})

describe('MailTemplateComponent tests', () => {

})