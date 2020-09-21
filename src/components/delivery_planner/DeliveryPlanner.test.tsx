import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import deliveryWindowService from '../../services/DeliveryWindowService'
import {DeliveryPlanner, Marker} from "./DeliveryPlanner";
import {BuildRoute} from "../../../__mocks__/mockFactories";
import { MemoryRouter, Route } from 'react-router-dom';
import RouteOrganizer from "./RouteOrganizer";
import {RouteOrganizerEntry} from "./RouteOrganizerEntry";
import {act} from "react-dom/test-utils";

configure({adapter: new Adapter()});

let component: any;
let props: any;
let retrieveRouteSpy: jest.SpyInstance = jest.spyOn(deliveryWindowService, 'retrieveRoute');

describe('DeliveryPlanner tests', () => {
    beforeEach(async () => {
        retrieveRouteSpy.mockImplementation(() => Promise.resolve(BuildRoute({count: 3})));
        component = await mount(
            <MemoryRouter initialEntries={['/dashboard/delivery_planner/1']}>
                <Route path='/dashboard/delivery_planner/:delivery_window'>
                    <DeliveryPlanner  />
                </Route>
            </MemoryRouter>
        )

        await component.update();
    })

    it('should list all markers', () => {
        expect(component.find(Marker).length).toBe(3);
    })

    it('should respond to optimize', () => {
        expect(component.find('.route_organizer__optimize_btn').length).toBe(1);
        act(() => component.find('.route_organizer__optimize_btn').simulate('click'));
    })
})

describe ('Marker tests', () => {
    beforeEach(() => {
        props = {
            lat: 0,
            lng: 0,
            text: '_69'
        }
        component = shallow(
            <Marker {...props} />
        )
    })

    it('should display all info', () => {
        expect(component.text()).toContain('_69');
    })
})

describe('RouteOrganizer tests', () => {
    beforeEach(() => {
      component = shallow(
          <RouteOrganizer routeEntries={BuildRoute({count:3})} optimize={jest.fn()} />
      )
    })

    it('should list all stops', () => {
        expect(component.find(RouteOrganizerEntry).length).toBe(3);
    })
})

describe('RouteOrganizerEntry tests', () => {
    describe('Setup for planning mode -- default mode', () => {
        beforeEach(() => {
            component = shallow(
                <RouteOrganizerEntry
                    routeEntry={BuildRoute({count: 1})}
                    mode={'plan'}
                    moveEntry={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
        })

        it('should display all info', () => {
            expect(component.text()).toContain('street_address_1');
            expect(component.text()).toContain('5 minutes');
            expect(component.find('.plan_controls__up_btn').props().disabled).toBe(true);
            expect(component.find('.plan_controls__down_btn').props().disabled).toBe(false);
        })
    })

})