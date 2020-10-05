import React from 'react';
import InputWidget from '../inputWidget/InputWidget';
import Service from '../../../services/Service';

import {config} from '../../../config';
import './search_widget.scss';

interface Props {
    service: Service,
    itemSelected: (item: any) => void
}

interface State {
    items: any[]
}

export default class SearchWidget extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    
        this.state = {
            items: []
        }  
    }

    public componentDidMount = (): void => {
        window.onclick = function(event: any) {
            this.close()
        }
    }

    private itemSelected = (item: any): void => {
        this.setState({items: []});
        this.props.itemSelected(item);
    }

    private doSearch = (id: string, text: string): void => {
        this.props.service.search<any[]>(text)
            .then((items: any[]) => this.setState({items}))
            .catch( err => {})
    }

    public render() {
        return(
            <div className="row search_widget">
                <div className="col-12">
                    <InputWidget
                        id='search_widget__InputWidget'
                        type=""
                        initialValue=''
                        onUpdate={this.doSearch}
                        placeholder='Enter Menu Item to Add'
                        defaultUpdateValue={''}
                    />
                </div>
                { this.state.items.length > 0 &&
                    <div className="col-12 search_widget_results">
                        <div className="search_widget_results__content">
                            {
                                this.state.items.map((item: any) => {
                                    return(
                                        <div className="row result"
                                            onClick={() => this.itemSelected(item)}>
                                            <div className="col-9 result__name">
                                                {item.name}
                                            </div>
                                            <div className="col-3">
                                                <img src={item.image} alt={item.name}/>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }   
            </div>
        )
    }
}