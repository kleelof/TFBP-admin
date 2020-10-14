import React from 'react';

interface Props {
    item: any,
    itemSelected: (item: any) => void
}

export const SearchWidgetDefaultDisplay = (props: Props): React.ReactElement => {

    return (
        <div className='row search_widget_default_display'>
            <div
                key={`search_result_${props.item.id}`}
                className="row search_widget__result"
                onClick={() => props.itemSelected(props.item)}
            >
                <div className="col-12 result__name">
                    {props.item.name}
                </div>
            </div>
        </div>
    )
}