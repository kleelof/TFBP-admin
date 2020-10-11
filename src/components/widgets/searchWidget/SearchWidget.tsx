import React from 'react';
import InputWidget from '../inputWidget/InputWidget';
import Service from '../../../services/Service';

import './search_widget.scss';
import PagedResultsDTO from "../../../dto/PagedResultsDTO";

interface Props {
    service: Service,
    itemSelected: (item: any) => void,
    placeholder?: string
}

interface State {
    dto: PagedResultsDTO,
    showChoices: boolean,
    currentValue: string
}

export default class SearchWidget extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    
        this.state = {
            dto: new PagedResultsDTO(),
            showChoices: false,
            currentValue: ''
        }  
    }

    private itemSelected = (item: any): void => {
        this.setState({showChoices: false, currentValue: item.name});
        this.props.itemSelected(item);
    }

    private doSearch = (id: string, text: string): void => {
        this.setState({currentValue: text});

        if (text === '') {
            this.setState({showChoices: false});
            return;
        }

        this.props.service.pagedSearchResults(1, text)
            .then((dto: PagedResultsDTO) => {
                this.setState({dto, showChoices: dto.count > 0});
                this.props.itemSelected(text);
            })
            .catch( () => window.alert('unable to search'))
    }

    public render() {
        return(
            <div
                className="row search_widget"
                onBlur={() => this.setState({showChoices: false, currentValue: ''})}
            >
                <div className="col-12">
                    <InputWidget
                        key={Math.random()}
                        id='search_widget__InputWidget'
                        type=""
                        initialValue={this.state.currentValue}
                        onUpdate={this.doSearch}
                        placeholder={this.props.placeholder || ''}
                        defaultUpdateValue={''}
                    />
                </div>
                <div className={`col-12 search_widget_results--${this.state.showChoices ? 'show' : 'hide'}`}>
                    <div className="search_widget_results__content">
                        {
                            this.state.dto.results.map((item: any) => {
                                return(
                                    <div
                                        key={`search_result_${item.id}`}
                                        className="row search_widget__result"
                                        onClick={() => this.itemSelected(item)}
                                    >
                                        <div className="col-12 result__name">
                                            {item.name}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}