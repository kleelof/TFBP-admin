import React from 'react';
import { Link } from 'react-router-dom';

import './navigation.scss';

export type NavItem = {title: string, link: string}

interface Props {
    navItems: NavItem[]
}

export const SubNavigation = (props: Props): React.ReactElement => {
    return(
        <div className="row subnav">
            <div className="col-12">
                {
                    props.navItems.map((item: NavItem) => {
                        return(
                            <Link className="subnav__item" to={item.link} key={item.title}>
                                {item.title}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}