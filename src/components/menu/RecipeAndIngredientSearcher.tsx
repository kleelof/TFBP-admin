import React from 'react';
import InputWidget from '../widgets/inputWidget/InputWidget';
import apiActionsService from '../../services/APIActionService';

import '../widgets/searchWidget/search_widget.scss';
import SearchRecipesAndIngredientsDTO from "../../dto/SearchRecipesAndIngredientsDTO";
import SearchRecipesAndIngredientsResultDTO from "../../dto/SearchRecipesAndIngredientsDTO";

interface Props {
    itemSelected: (item: any) => void,
}

interface State {
    results: SearchRecipesAndIngredientsDTO[],
    showChoices: boolean,
    currentValue: string
}

export default class RecipeAndIngredientSearcher extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            results: [],
            showChoices: false,
            currentValue: ''
        }
    }

    private itemSelected = (item: any): void => {
        this.setState({showChoices: false, currentValue: item.name});
        this.props.itemSelected(item);
    }

    protected doSearch = (id: string, text: string): void => {
        this.setState({currentValue: text});

        if (text === '') {
            this.setState({showChoices: false});
            return;
        }

        apiActionsService.searchRecipesAndIngredients(text)
            .then((results: SearchRecipesAndIngredientsDTO[]) => {
                this.setState({results, showChoices: true});
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
                        placeholder='name of ingredient or recipe to add'
                        defaultUpdateValue={''}
                    />
                </div>
                <div className={`col-12 search_widget_results--${this.state.showChoices ? 'show' : 'hide'}`}>
                    <div className="search_widget_results__content">
                        {
                            this.state.results.map((result: SearchRecipesAndIngredientsResultDTO) =>
                                <div
                                    key={`search_result_${result.item.id.toString() + result.item.name}`}
                                    className='row search_widget_default_display'>
                                    <div
                                        className="row search_widget__result"
                                        onClick={() => this.itemSelected(result)}
                                    >
                                        <div className="col-12 result__name">
                                            {result.item.name}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}