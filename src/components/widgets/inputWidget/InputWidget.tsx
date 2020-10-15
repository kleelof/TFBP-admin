/*
    Provides an INPUT field.
    Provides updated text when:
        The user has stopped typing for 750ms, hits 'ENTER' or the INPUT field loses focus
        The text has changed since last time an update was sent
    <InputWidget    initialValue: starting value
                    defaultUpdateValue: if the INPUT field is empty, this value will be returned instead.
                    onUpdate: callback when there is new text
                    placeholder: text for PLACEHOLDER property on INPUT
                    type: text | textarea
    returns     id: value of ID sent through props
                value: string
 */

import React, {Component} from 'react';

interface Props {
    id: string,
    type: string, // 'textarea', 'text'
    onUpdate: any,
    required?: boolean,
    initialValue?: any,
    placeholder?: string,
    defaultUpdateValue?: any
}

interface State {
    value: string
    lastSavedValue: string
}

//todo: get type='number' to work

export default class InputWidget extends Component<Props, State> {
    
    private timer: any;
    private lastSavedValue: string | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            value: props.initialValue ? props.initialValue : "",
            lastSavedValue: ''
        }

        this.lastSavedValue = props.initialValue;
    };

    static getDerivedStateFromProps = (props: Props, state: State): State | null => {
        if (props.initialValue !== state.lastSavedValue) {
            return {
                value: props.initialValue,
                lastSavedValue: props.initialValue
            }
        }
        return null;
      }

    private handleOnKeyPress = (e: any) => {
        if (e.keyCode === 13) this.sendUpdate();
    };

    private updateValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({value: e.target.value});
        this.resetTimer();
    };

    private sendUpdate = () => {
        if (this.lastSavedValue !== this.state.value) {
            this.lastSavedValue = this.state.value;
            let value = (this.props.defaultUpdateValue !== '' && this.props.initialValue === '') ?
                this.props.defaultUpdateValue : this.state.value;
            this.props.onUpdate(this.props.id, value);
            clearInterval(this.timer);
        }
    };

    private resetTimer = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.sendUpdate, 750)
    };

    public render() {
        if (this.props.type === 'textarea') {
            return (
                <div className={'row input_widget_textarea'}>
                    <div className={'col-12'}>
                        <textarea
                            className = {'form-control iw'}
                            id = {this.props.id}
                            value = {this.state.value}
                            onBlur = {() => this.sendUpdate()}
                            onChange = {(e) =>this.updateValue(e)}
                            onKeyDown = {(e) => this.handleOnKeyPress(e)}
                            required = {(this.props.required)? this.props.required : false}
                        />
                    </div>
                </div>
            )
        } else {
            return (
                <div className={'row input_widget_input'}>
                    <div className={'col-12'}>
                        <input
                            className={'form-control iw'}
                            id={this.props.id}
                            placeholder={this.props.placeholder}
                            value={this.state.value}
                            onBlur={() => this.sendUpdate()}
                            onChange={(e) => this.updateValue(e)}
                            onKeyDown={(e) => this.handleOnKeyPress(e)}
                            autoComplete="off"
                        />
                    </div>
                </div>
            )
        }

    }
}