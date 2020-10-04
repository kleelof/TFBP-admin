import React from 'react';
import { Link } from 'react-router-dom';

import './navigation.scss';

export type NavItem = {title: string, link: string}

interface Props {
    navItems: NavItem[]
}

export const SubNavigation = (props: Props): React.ReactElement => {
    return(
            <div className="col-12">
                <div className='row justify-content-center'>
                {
                    props.navItems.map((item: NavItem) => {
                        return(
                            <div className='col-4'>
                                <Link className="subnav__item" to={item.link} key={item.title}>
                                    {item.title}
                                </Link>
                            </div>
                        )
                    })
                }
                </div>
            </div>
    )
}