import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import {MailTemplates} from "./MailTemplates";
import MailTemplateComponent from "./MailTemplateComponent";
import mailTemplateService from '../../services/MailTemplateService'
import {BuildMailTemplate} from "../../../__mocks__/mockFactories";
import MailTemplate from "../../models/MailTemplate";
import MailMassMailer from "./MailMassMailer";
import deliveryDayService from '../../services/DeliveryDayService';
import deliveryWindowService from '../../services/DeliveryWindowService';
import {BuildDeliveryDay, BuildDeliveryDaysDTO, BuildDeliveryWindowDTO} from "../../../__mocks__/deliveryMocks";
import {BuildMailingList} from '../../../__mocks__/mockFactories';
import MailingListModel from "../../models/MailingListModel";
import {MailingListEntry} from "./MailingListEntry";

configure({adapter: new Adapter()});

let component: any;
const getTemplateSpy: jest.SpyInstance = jest.spyOn(mailTemplateService, 'get_template_by_slug');
const updateTemplateSpy: jest.SpyInstance = jest.spyOn(mailTemplateService, 'update');
const getDeliveryDaySpy: jest.SpyInstance = jest.spyOn(deliveryDayService, 'get');
const getDeliveryWindowSpy: jest.SpyInstance = jest.spyOn(deliveryWindowService, 'get');
const confirmSpy: any = jest.fn(() => true)
let matchProps: any = {
    match: {
        params: {}
    }
}
let props: any;

global.confirm = confirmSpy;

describe('MailTemplates tests', () => {
    beforeEach(() => {
        component = shallow(
            <MailTemplates />
        )
    })
    it('should list all templates', () => {
        expect(component.find(MailTemplateComponent).length).toEqual(3);
    })
})

describe('MailMassMailer tests', () => {
    describe('configuring from URL params', () => {

        it('should handle upcoming_delivery', async () => {
            getDeliveryDaySpy.mockImplementation(() => Promise.resolve(BuildDeliveryDay({count: 2})));
            getDeliveryWindowSpy.mockImplementation(() => Promise.resolve(BuildDeliveryWindowDTO({count: 2})));
            props = {
                match: {
                    params: {
                        mail_type: 'upcoming_delivery',
                        option: '2020-07-04'
                    }
                }
            }
            component = await mount(<MailMassMailer {...props} />);
            await component.update();

            expect(component.find('#upcoming_delivery').instance().checked).toBe(true);
            expect(component.find('.options__upcoming_delivery').instance().value).toBe(''); // TODO: fix
        })
    })

    describe('options/includes displaying tests; initial set-up', () => {
         beforeAll(async () => {
             getDeliveryDaySpy.mockImplementation(() => Promise.resolve(BuildDeliveryDay({count: 2})));
             getDeliveryWindowSpy.mockImplementation(() => Promise.resolve(BuildDeliveryWindowDTO({count: 2})));
             component = await shallow(
                 <MailMassMailer {...matchProps}/>
                )
             await component.update();
        })

        it('should set-up correctly', () => {
            expect(component.find('#all_customers').props().checked).toBe(true);
            expect(component.find('.mass_mailer__options').children().length).toBe(0);
        })

        it('should show include_samples if who = all_customers', () => {
            component.find('#delivery_window').simulate('change', {target: {checked: true}});
            component.update();
            component.find('#all_customers').simulate('change', {target: {checked: true}});
            component.update();

            expect(component.find('.includes__include_samples').length).toBe(1);
        })

        it('should show delivery windows if who = delivery_window', () => {
            component.find('#delivery_window').simulate('change', {target: {checked: true}});
            component.update();

            expect(component.find('.options__delivery_windows').length).toBe(1);
            expect(component.find('.options__delivery_windows').children().length).toBe(2);
        })

        it('should show calendar if who = upcoming_delivery', () => {
            component.find('#upcoming_delivery').simulate('change', {target: {checked: true}});
            component.update();

            expect(component.find('.options__upcoming_delivery').length).toBe(1);
        })

        it('should show delivery days if who = upcoming_delivery_days', () => {
            component.find('#upcoming_delivery_days').simulate('change', {target: {checked: true}});
            component.update();

            expect(component.find('.options__upcoming_delivery_days').length).toBe(1);
            expect(component.find('.options__upcoming_delivery_days').children().length).toBe(2);
            expect(component.find('.includes__include_samples').length).toBe(0);
        })
    })

    describe('disable TO selectors when missing related options', () => {
        beforeAll(async () => {
             getDeliveryDaySpy.mockImplementation(() => Promise.resolve([]));
             getDeliveryWindowSpy.mockImplementation(() => Promise.resolve([]))
             component = await shallow(
                 <MailMassMailer {...matchProps} />
                )
             await component.update();
        })

        it('should disable delivery_window', () => {
            expect(component.find('#delivery_window').props().disabled).toBe(true);
        })

        it('should disable upcoming_delivery_days', () => {
            expect(component.find('#upcoming_delivery_days').props().disabled).toBe(true);
        })
    })

    describe('send email tests', () => {
        beforeAll(async () => {
             getDeliveryDaySpy.mockImplementation(() => Promise.resolve(BuildDeliveryDay({count: 2})));
             getDeliveryWindowSpy.mockImplementation(() => Promise.resolve(BuildDeliveryWindowDTO({count: 2})));
             component = await shallow(
                 <MailMassMailer {...matchProps} />
                )
             await component.update();

             component.find('.mass_mailer__message').simulate('change', {target: {value: 'test_send_body'}});
             await component.update();
        })
        it('should perform all_customers mailing', async () => {
            component.find('.buttons__send').simulate('click');
            await component.update();

            expect(confirmSpy).toBeCalledTimes(1);

            //expect(confirmSpy).toBeCalledWith('Send to all customers');
        })
    })
})

describe('MailingList tests', () => {

})

describe('MailingListEntry', () => {
    beforeAll(() => {
        const dto: MailingListModel = BuildMailingList({count: 1, email: 'fred@bedrock.com', code: '94610'});
        component = mount(
            <MailingListEntry dto={dto} />
        )
    })

    it('should setup correctly', () => {
        expect(component.find('.mailing_list__code').instance().value).toBe('94610');
        expect(component.find('.mailing_list__email').instance().value).toBe('fred@bedrock.com');
        expect(component.find('.mailing_list__active').props().checked).toBe(true);
        expect(component.find('.mailing_list__save_btn').props().disabled).toBe(true);
    })

    it('should enable save btn if something changes', () => {
        component.find('.mailing_list__code').simulate('change', {target: {value: '123'}});
        expect(component.find('.mailing_list__save_btn').props().disabled).toBe(false);
    })

})

describe('MailTemplateComponent tests', () => {
    beforeEach(async () => {
        const template: MailTemplate = BuildMailTemplate({count: 1});
        getTemplateSpy.mockImplementation(() => Promise.resolve(template));
        component = await mount(
            <MailTemplateComponent templateSlug={'test-slug'} />
        )

        await component.update();
    })

    it('should fill-in template text', () => {
        expect(component.find('.mail_template__body').text()).toEqual('template text 1')
    })

    it('should submit updates', async () => {
        component.find('.mail_template__body').simulate('change', {target: {value: 'test_change_text'}});
        await component.update();
        component.find('.btn').simulate('click');
        await component.update();
        expect(updateTemplateSpy).toBeCalledTimes(1); // TODO: fix
        expect(updateTemplateSpy.mock.calls[0][1]['text']).toBe('test_change_text');
    })
})