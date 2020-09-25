import React from 'react';
import {shallow, configure, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter, Route } from 'react-router-dom';

import newsletterService from '../../services/NewsletterService';
import {BuildNewsletter} from "../../../__mocks__/mockFactories";
import {Newsletters} from "./Newsletters";
import {NewslettersNewsletter} from "./NewslettersNewsletter";
import Newsletter from "../../models/Newsletter";
import helpers from "../../helpers/helpers";
import momentHelper from '../../helpers/MomentHelper';
import NewsletterAdd from "./NewsletterAdd";
import NewsletterEdit from "./NewsletterEdit";

configure({adapter: new Adapter()});

let component: any;
let newsletter: Newsletter;
const getNewslettersSpy: jest.SpyInstance = jest.spyOn(newsletterService, 'get');
const addNewsletterSpy: jest.SpyInstance = jest.spyOn(newsletterService, 'add');
const updateNewsletterSpy: jest.SpyInstance = jest.spyOn(newsletterService, 'update');
const historyMock: any = { push: jest.fn() };
let props: any;

describe('Newsletters Tests', () => {
    beforeAll( () => {
        getNewslettersSpy.mockImplementation(() => Promise.resolve(BuildNewsletter({count: 3})));
        component = shallow(<Newsletters />);
    })

    it('should load all newsletters', async () => {
        await(() => expect(component.find(NewslettersNewsletter).length).toBe(3));
    })
})

describe('NewslettersNewsletter', () => {
    it('should display title', () => {
        const newsletter: Newsletter = BuildNewsletter({count:1});
        component = shallow(<NewslettersNewsletter newsletter={newsletter} />);
        expect(component.text()).toContain(newsletter.title);
    })

    it('should display release_date if given', () => {
        const newsletter: Newsletter = BuildNewsletter({count: 1, release_date: '2020-07-04'});
        component = shallow(<NewslettersNewsletter newsletter={newsletter} />);
        expect(component.text()).toContain(momentHelper.asFullDate('2020-07-04'));
    })
})

describe('NewsletterAdd tests', () => {
    it('should submit title and redirect to edit page',  async () => {
        const newsletter: Newsletter = BuildNewsletter({count: 1})
        getNewslettersSpy.mockImplementation(() => Promise.resolve(newsletter))
        component = mount(
            <MemoryRouter>
                <NewsletterAdd
                    history={historyMock}
                    location={{} as any}
                    match={{} as any}
                    />
            </MemoryRouter>
        )

        component.find('input').simulate('change', {target: {value: 'test_new_newsletter'}});
        component.find('button').simulate('click');
        await component.update();

        expect(addNewsletterSpy).toHaveBeenCalledTimes(1);
        expect(addNewsletterSpy.mock.calls[0][0]['title']).toBe('test_new_newsletter');

        expect(historyMock.push).toHaveBeenCalled(); //.toEqual(`/dashboard/newsletter/edit/${newsletter.id}`); // TODO: fix
    })
})

describe('NewsletterEdit tests', () => {
    beforeAll( async() => {
        props = {
            match: {
                params: {
                    id: 1
                }
            }
        }
        newsletter = BuildNewsletter({count: 1});
        getNewslettersSpy.mockImplementation(() => Promise.resolve(newsletter));

        component = await mount(
            <MemoryRouter>
                <NewsletterEdit {...props}/>
            </MemoryRouter>
        )

        await component.update();
    })

    it('should set-up correctly', () => {
        expect(component.text()).toContain(newsletter.content);
        expect(component.find('.newsletter_edit__save_btn').props().disabled).toBe(true);
        expect(component.find('.newsletter_edit_controls__email_btn').props().disabled).toBe(false);
        expect(component.find('.newsletter_edit_controls__email_input').props().disabled).toBe(false);
        expect(component.text()).toContain(newsletter.title); // TODO: fix
    })

    it('should enable save button and disable emailing if changes have been made', () => {
        component.find('.newsletter_edit__title_input').simulate('change', {target: {value: 'boogie_baby'}});
        expect(component.find('.newsletter_edit__save_btn').props().disabled).toBe(false);
        expect(component.find('.newsletter_edit_controls__email_btn').props().disabled).toBe(true);
        expect(component.find('.newsletter_edit_controls__email_input').props().disabled).toBe(true);
    })

    it('should submit correct data to API and reset buttons to correct states', () => {
        component.find('.newsletter_edit__title_input').simulate('change', {target: { value: 'send_title'}});
        component.find('.newsletter_edit__content_input').simulate('change', {target: { value: 'send_content'}});
        component.find('.newsletter_edit__save_btn').simulate('click');

        expect(updateNewsletterSpy).toHaveBeenCalledTimes(1);
        expect(updateNewsletterSpy.mock.calls[0][1]['title']).toBe('send_title');
        expect(updateNewsletterSpy.mock.calls[0][1]['content']).toBe('send_content');
    })

    it('should show no errors if newsletter classes are present', () => {
        expect(component.find('.newsletter_edit__error').length).toBe(0); // TODO: fix
    })

    describe('missing newsletter classes tests', () => {
        beforeEach(async () => {
            jest.clearAllMocks();

            props = {
                match: {
                    params: {
                        id: 1
                    }
                }
            }
            newsletter = BuildNewsletter({count: 1});
            newsletter.content="invalid content";
            getNewslettersSpy.mockImplementation(() => Promise.resolve(newsletter));

            component = await shallow(
                <NewsletterEdit {...props}/>
            )

            await component.update();
        })

        it('should show errors', () => {
            expect(getNewslettersSpy).toHaveBeenCalledTimes(1);
            expect(component.find('.newsletter_edit__error').length).toBe(2);
        })
    })
})