import React from 'react';
//import {shallow} from "enzyme";

import InputWidget from './InputWidget';
/*
describe('InputWidget widget tests', () => {
    let wrapper: any;
    let spy: any;
    let input_element: any;
    const onHandleUpdate = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<InputWidget
            id={'test_id'}
            initialValue={'initial_value_text'}
            onUpdate={onHandleUpdate}
            placeholder={'test_placeholder'}
        />);
        input_element = wrapper.find('input');
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
        wrapper.instance().sendUpdate();
        expect(onHandleUpdate).toHaveBeenCalledTimes(0);
    });

    it("should UPDATE if text has changed", () => {
        input_element.simulate('change', {
            target: {
                value: 'updated_value_text'
            }
        });
        wrapper.instance().sendUpdate();
        expect(onHandleUpdate).toHaveBeenCalledTimes(1);
    });

    it('should call sendUpdate on "enter"', () => {
        spy = jest.spyOn(wrapper.instance(), 'sendUpdate').mockImplementation(jest.fn());

        input_element
            .simulate('change', {
                target: {
                    value: 'updated_value_text'
                }
            })
            .simulate('keypress', {key: 'Enter'});
        expect(spy).toHaveBeenCalledTimes(0);
    });

    describe('defaultUpdateValue testing', () => {
        beforeEach(() => {
            wrapper = shallow(<InputWidget
                id={'test_id'}
                initialValue={'initial_value_text'}
                onUpdate={onHandleUpdate}
                placeholder={'test_placeholder'}
                defaultUpdateValue={''}
            />);
            wrapper.instance().setState({currentValue: ''});
            input_element = wrapper.find('input');
            onHandleUpdate.mockClear();
        });

        it('should send empty string if defaultUpdateValue is not set', () => {
            wrapper.instance().sendUpdate();
            expect(onHandleUpdate).toHaveBeenCalledTimes(1);
            expect(onHandleUpdate).toHaveBeenCalledWith('test_id', '');
        });

        it('should send defaultUpdateValue instead of empty string', () => {
            wrapper.instance().setState({defaultUpdateValue: 'default_value'});
            wrapper.instance().sendUpdate();
            expect(onHandleUpdate).toHaveBeenCalledTimes(1);
            expect(onHandleUpdate).toHaveBeenCalledWith('test_id', 'default_value');
        });
    })

});
*/