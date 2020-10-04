import React, {useState} from 'react';
import { config } from '../../../config';

import './page_selector.scss';

interface Props {
    numItems: number,
    currentPage:number,
    gotoPage: (pageNumber: number) => void
}

type Choice = {
    text: string,
    type: string
}

export const PageSelector = (props: Props): React.ReactElement => {
    const numPages: number = Math.ceil(props.numItems / config.RESULTS_PER_PAGE);

    if (numPages < 2)
        return(<div></div>)

    const getRangeOfChoices = (start: number, end: number, selected: number): Choice[] => {
        const choices: Choice[] = [];
        for (let x: number = start; x <= end; x ++)
            choices.push({
                text: x.toString(),
                type: selected === x ? 'selected' : 'selectable'
            })
        return choices;
    }

    const choiceClicked = (choice: Choice): void => {
        if (choice.type === 'selected')
            return

        const page: number = choice.type === 'selectable' ? parseInt(choice.text) : props.currentPage;

        props.gotoPage(
            choice.type === 'selectable' ? page :
                            choice.type === 'move_back' ? page - 8 > 0 ? page - 8 : 1 :
                                page + 8 <= numPages? page + 8 : numPages
        )
    }

    let choices: Choice[] = [];
    if (numPages < 10){
        choices = getRangeOfChoices(1, numPages, props.currentPage);
    } else {
        if (props.currentPage < 9) {
            choices = getRangeOfChoices(1, 8, props.currentPage);
            choices.push({text: '>', type: 'move_forward'});
        } else if (numPages - props.currentPage < 9) {
            const t = numPages - props.currentPage;
            choices = getRangeOfChoices(numPages - 7, numPages, props.currentPage);
            choices.unshift({text: '<', type: 'move_back'});
        } else {
            choices = getRangeOfChoices(props.currentPage - 3, props.currentPage + 3, props.currentPage)
            choices.unshift({text: '<', type: 'move_back'});
            choices.push({text: '>', type: 'move_forward'});
        }
    }

    return(
        <div className='page_selector'>
            {
                choices.map((choice:Choice) => {
                    return(
                        <div className={`page_selector__item page_selector__item--${choice.type}`}
                             onClick={() => choiceClicked(choice)}
                        >
                            {choice.text}
                        </div>
                    )
                    }
                )
            }
        </div>
    )
}