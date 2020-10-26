import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import deliveryWindowService from '../../services/DeliveryWindowService'
import {DeliveryPlanner, Marker} from "./DeliveryPlanner";
import {BuildRoute, BuildRouteStop} from "../../../__mocks__/mockFactories";
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

        retrieveRouteSpy.mockImplementation(() => Promise.resolve(BuildRoute({count: 1})));
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
        expect(component.find(Marker).length).toBe(2);
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
          <RouteOrganizer
              route={BuildRoute({count:1})}
              updateRoute={jest.fn()}
          />
      )
    })

    it('should list all stops', () => {
        expect(component.find(RouteOrganizerEntry).length).toBe(2);
    })
})

describe('RouteOrganizerEntry tests', () => {
    describe('Setup for planning mode -- default mode', () => {
        beforeEach(() => {

        })

        it('should display all info', () => {
            component = shallow(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1})}
                    route={BuildRoute({count:1})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
            const t = component.text()
            expect(component.text()).toContain('street_address_1');
            expect(component.find('.plan_controls__up_btn').props().disabled).toBe(true);
            expect(component.find('.plan_controls__down_btn').props().disabled).toBe(false);
        })

        it('should display completed when finished', () => {
            component = shallow(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:3})}
                    route={BuildRoute({count:1})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
            expect(component.text()).toContain('delivered:')
        })

        it('should display no delivery time when route ends, but no delivery', () => {
            component = shallow(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:2})}
                    route={BuildRoute({count:1, route_status:3})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
            expect(component.text()).toContain('no delivery')
        })

        it('should display canceled', () => {
            component = shallow(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:4})}
                    route={BuildRoute({count:1, route_status:3})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
            expect(component.text()).toContain('canceled')
        })

        it('should display navigate button', () => {
            component = shallow(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:0})}
                    route={BuildRoute({count:1, route_status:2})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
            expect(component.find('.delivery_controls__navigate').length).toBe(1);
            expect(component.find('.organizer_entry__plan_controls').length).toBe(0);
            expect(component.find('.delivery_controls__finished').length).toBe(0);
            expect(component.find('.delivery_controls__arrive').length).toBe(0);
        })

        it('should display arrive button', () => {
            component = mount(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:1})}
                    route={BuildRoute({count:1, route_status:2})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )
            expect(component.find('.delivery_controls__arrive').length).toBe(1);
            expect(component.find('.delivery_controls__navigate').length).toBe(0);
            expect(component.find('.organizer_entry__plan_controls').length).toBe(0);
            expect(component.find('.delivery_controls__finished').length).toBe(0);
        })

        it('should display finished button', () => {
            component = mount(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:2})}
                    route={BuildRoute({count:1, route_status:2})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )

            expect(component.find('.delivery_controls__finished').length).toBe(1);
            expect(component.find('.delivery_controls__arrive').length).toBe(0);
            expect(component.find('.delivery_controls__navigate').length).toBe(0);
            expect(component.find('.organizer_entry__plan_controls').length).toBe(0);
        })

        it('should display move buttons', () => {
            component = mount(
                <RouteOrganizerEntry
                    stop={BuildRouteStop({count: 1, stop_status:2})}
                    route={BuildRoute({count:1, route_status:0})}
                    moveStop={() => {}}
                    canMoveDown={true}
                    canMoveUp={false}
                />
            )

            expect(component.find('.organizer_entry__plan_controls').length).toBe(1);
            expect(component.find('.delivery_controls__finished').length).toBe(0);
            expect(component.find('.delivery_controls__arrive').length).toBe(0);
            expect(component.find('.delivery_controls__navigate').length).toBe(0);
        })
    })

})