import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {FullOverlay} from './FullOverlay';
import LoadingOverlay from './LoadingOverlay';

configure({adapter: new Adapter()});

let component: any;
let closeCallback: any = jest.fn();

describe('Overlays Tests', () => {

    describe.skip('FullOverlay tests', () => {

        beforeEach(() => {
            component = shallow(<FullOverlay component={<LoadingOverlay />} closeCallback={closeCallback} />)
        })

        it('Should display given component', () => {
            expect(component.find('LoadingOverlay').length).toEqual(1);
        })

        it('Should display close if closeCallback given', () => {
            expect(component.find('.overlay-close').length).toEqual(1);
        })

        it('Should not display close if closeCallback is null', () => {
            const l_component = shallow(<FullOverlay component={<LoadingOverlay />} closeCallback={null} />);
            expect(l_component.find('.overlay-close').length).toEqual(0);
        })

        it('Should not display close if closeCallback is not given', () => {
            const l_component = shallow(<FullOverlay component={<LoadingOverlay />} />);
            expect(l_component.find('.overlay-close').length).toEqual(0);
        })

        it('Should call closeCallback when close clicked', () => {
            component.find('.overlay-close').first().simulate('click');
            expect(closeCallback).toHaveBeenCalledTimes(1);
        })
    })
});