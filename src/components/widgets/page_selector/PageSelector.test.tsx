import React from 'react';
import {shallow, configure, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {PageSelector} from "./PageSelector";

configure({adapter: new Adapter()});

let component: any;
let baseProps: any;


describe('PageSelector tests', () => {
    it('should not display if number of pages < 2', () => {
        component = shallow(<PageSelector numItems={5} currentPage={1} gotoPage={jest.fn()} />)
        const items: any[] = component.find('.page_selector__item');

        expect(items.length).toBe(0);
    })

    it('should show only numbers if more than 1 and less than 10 pages', () => {
        component = shallow(<PageSelector numItems={100} currentPage={1} gotoPage={jest.fn()} />)

        expect(component.find('.page_selector__item--selectable').length).toBe(3);
        expect(component.find('.page_selector__item--selected').length).toBe(1);
        expect(component.find('.page_selector__item--move_forward').length).toBe(0);
        expect(component.find('.page_selector__item--move_back').length).toBe(0);
        expect(component.find('.page_selector__item--selected').text()).toBe('1');
    })

    it('should display 1-8 and > ', () => {
        component = shallow(<PageSelector numItems={255} currentPage={3} gotoPage={jest.fn()} />);

        expect(component.find('.page_selector__item--selectable').length).toBe(7);
        expect(component.find('.page_selector__item--selected').length).toBe(1);
        expect(component.find('.page_selector__item--move_forward').length).toBe(1);
        expect(component.find('.page_selector__item--move_back').length).toBe(0);
        expect(component.find('.page_selector__item--selected').text()).toBe('3');
    })

    it('should display < # - # ', () => {
        component = shallow(<PageSelector numItems={500} currentPage={18} gotoPage={jest.fn()} />);

        expect(component.find('.page_selector__item--selectable').length).toBe(7);
        expect(component.find('.page_selector__item--selected').length).toBe(1);
        expect(component.find('.page_selector__item--move_forward').length).toBe(0);
        expect(component.find('.page_selector__item--move_back').length).toBe(1);
        expect(component.find('.page_selector__item--selected').text()).toBe('18');
    })

    it('should display < # - # > if choices below and above displayed range', () => {
        component = shallow(<PageSelector numItems={500} currentPage={10} gotoPage={jest.fn()} />);

        expect(component.find('.page_selector__item--selectable').length).toBe(6);
        expect(component.find('.page_selector__item--selected').length).toBe(1);
        expect(component.find('.page_selector__item--move_forward').length).toBe(1);
        expect(component.find('.page_selector__item--move_back').length).toBe(1);
        expect(component.find('.page_selector__item--selected').text()).toBe('10');
    })

    it('should advance 8 pages', () => { // 7 pages to make adding arrows easier
        baseProps = {
            numItems: 500,
            currentPage: 10,
            gotoPage: jest.fn()
        }

        component = shallow(<PageSelector {...baseProps} />)
        component.find('.page_selector__item--move_forward').simulate('click');

        expect(baseProps.gotoPage).toHaveBeenCalledTimes(1);
        expect(baseProps.gotoPage).toHaveBeenCalledWith(18);
    })

    it('should go back 8 pages', () => {
        baseProps = {
            numItems: 500,
            currentPage: 10,
            gotoPage: jest.fn()
        }

        component = shallow(<PageSelector {...baseProps} />)
        component.find('.page_selector__item--move_back').simulate('click');

        expect(baseProps.gotoPage).toHaveBeenCalledTimes(1);
        expect(baseProps.gotoPage).toHaveBeenCalledWith(2);
    })
})