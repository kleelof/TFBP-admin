import React from 'react';
import {shallow, configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

import InputWidget from './InputWidget';

configure({adapter: new Adapter()});

describe('InputWidget widget tests', () => {
    let component: any;
    let spy: any;
    let input_element: any;
    const onHandleUpdate = jest.fn();

    beforeEach(() => {
        component = shallow(<InputWidget
            id={'test_id'}
            type=""
            initialValue={'initial_value_text'}
            onUpdate={onHandleUpdate}
            placeholder={'test_placeholder'}
        />);
        input_element = component.find('input');
    });

    it('should fill in INPUT', () => {
        expect(input_element.prop('value')).toBe('initial_value_text');
    });

    it("should not UPDATE if text hasn't changed", () => {
        input_element.simulate('change', {
            target: {
                value: 'initial_value_text'
            }
        });
        component.instance().sendUpdate();
        expect(onHandleUpdate).toHaveBeenCalledTimes(0);
    });

    it("should UPDATE if text has changed", () => {
        input_element.simulate('change', {
            target: {
                value: 'updated_value_text'
            }
        });
        component.instance().sendUpdate();
        expect(onHandleUpdate).toHaveBeenCalledTimes(1);
    });

    it('should call sendUpdate on "enter"', () => {
        spy = jest.spyOn(component.instance(), 'sendUpdate').mockImplementation(jest.fn());

        input_element
            .simulate('change', {
                target: {
                    value: 'updated_value_text'
                }
            })
            .simulate('keypress', {key: 'Enter'});
        expect(spy).toHaveBeenCalledTimes(0);
    });

    describe.skip('defaultUpdateValue testing', () => {
        beforeEach(() => {
            component = shallow(<InputWidget
                id={'test_id'}
                type=""
                initialValue={'initial_value_text'}
                onUpdate={onHandleUpdate}
                placeholder={'test_placeholder'}
                defaultUpdateValue={''}
            />);
            component.instance().setState({currentValue: ''});
            input_element = component.find('input');
            onHandleUpdate.mockClear();
        });

        it('should send empty string if defaultUpdateValue is not set', () => {
            component.instance().sendUpdate();
            expect(onHandleUpdate).toHaveBeenCalledTimes(1);
            expect(onHandleUpdate).toHaveBeenCalledWith('test_id', '');
        });

        it('should send defaultUpdateValue instead of empty string', () => {
            component.instance().setState({defaultUpdateValue: 'default_value'});
            component.instance().sendUpdate();
            expect(onHandleUpdate).toHaveBeenCalledTimes(1);
            expect(onHandleUpdate).toHaveBeenCalledWith('test_id', 'default_value');
        });
    })

});