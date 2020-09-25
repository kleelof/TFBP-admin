import React from 'react';
import {shallow, configure, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Zone from "../../models/ZoneModel";
import {BuildZipcode, BuildZone} from "../../../__mocks__/mockFactories";
import {ZoneTool} from "./ZoneTool";
import {ZoneCode} from "./ZoneCode";
import Zipcode from "../../models/ZipcodeModel";
import zipcodeService from '../../services/ZipService';

configure({adapter: new Adapter()});

let component: any;
let zone: Zone;
let code: Zipcode;
let spy: jest.MockedFunction<any> = jest.fn();
let deleteZipSpy: any = jest.spyOn(zipcodeService, 'delete');

describe('Zones tests', () => {
    it('should list all zones', () => {});

    describe('ZoneTool tests', () => {
        beforeEach(() => {
            zone = BuildZone({count: 1, zip_codes: BuildZipcode({count: 5})});
            component = mount(
                <ZoneTool zone={zone} />
            )
        })
        it('should setup correctly', () => {
            expect(component.find('.zone_tool__name').instance().value).toContain(zone.name);
        })

        it('should list all codes', () => {
            expect(component.find(ZoneCode).length).toBe(5);
        })

        it('should call API to remove code; remove code', async () => {
            const zip: Zipcode = BuildZipcode({count: 1});
            window.confirm = () => true;
            deleteZipSpy.mockImplementation(() => Promise.resolve());
            zone = BuildZone({count: 1, zip_codes: [zip]});
            component = await mount(
                <ZoneTool zone={zone} />
            )


            const code: any = component.find(ZoneCode);
            code.simulate('click');
            expect(deleteZipSpy).toHaveBeenCalledTimes(1);
            expect(deleteZipSpy).toHaveBeenCalledWith(1);

            await component.update();
            expect(component.find(ZoneCode).length).toBe(0); // TODO: fix
        })
    })

    describe('ZoneCode tests', () => {
        beforeEach(() => {
            code = BuildZipcode({count: 1});
            component = shallow(<ZoneCode code={code} removeCode={spy} />)
        })

        it('should setup up correctly', () => {
            expect(component.text()).toContain(code.code.toString());
        })

        it('should call removeCode if clicked', () => {
            component.simulate('click');
            expect(spy).toHaveBeenCalledTimes(1);
        })
    })
})