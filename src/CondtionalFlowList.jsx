import { data } from "jquery";
import React from "react";
import store from './stores/store';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default class CondtionalFlowList extends React.Component {
    constructor(props) {
        super(props);
        this.thenShowRef = React.createRef();
        this.thenHideRef = React.createRef();
        this.elseShowRef = React.createRef();
        this.elseHideRef = React.createRef();
        
        let data = JSON.parse(this.props.conditionalFlow);

        this.state = {
            data: data.entries,
            editState: {
                value: '',
                then: {
                    show: [],
                    hide: []
                },
                else: {
                    show: [],
                    hide: []
                }
            }
        }

        this.fieldNames = [];
        this.getFieldNames(store.state.data, this.fieldNames);
    }

    getFieldNames = (data, addToList) => {
        data.Fields.forEach((item) => {
            if (item.Name)
                addToList.push(item.Name);
        });

        if (data.FieldGroups && data.FieldGroups.length > 0) {
            data.FieldGroups.forEach((item) => {
                if (item.Name)
                    addToList.push(item.Name);

                this.getFieldNames(item);
            });
        }
    }

    save = () => {

        if (!this.state.editState.value) {
            return;
        }

        if (!this.state.data.some(i => i.value == this.state.editState.value)) {
            let newCondition = {
                value: this.state.editState.value,
                then: {
                    show: this.state.editState.then.show.join(',').split(','),
                    hide: this.state.editState.then.hide.join(',').split(',')
                },
                else: {
                    show: this.state.editState.else.show.join(',').split(','),
                    hide: this.state.editState.else.hide.join(',').split(',')
                }
            }

            this.setState({
                data: this.state.data.concat(newCondition)
            }, this.liftStateUp);

            this.clearEdit();
        }
        else {
            let index = this.state.data.findIndex(i => i.value == this.state.editState.value);
            if (index !== -1) {
                this.state.data[index] = {
                    value: this.state.editState.value,
                    then: {
                        show: this.state.editState.then.show.join(',').split(','),
                        hide: this.state.editState.then.hide.join(',').split(',')
                    },
                    else: {
                        show: this.state.editState.else.show.join(',').split(','),
                        hide: this.state.editState.else.hide.join(',').split(',')
                    }
                }

                this.setState({
                    data: this.state.data
                }, this.liftStateUp);

                this.clearEdit();
            }
        }
    }

    edit = (value) => {
        let item = this.state.data.find(i => i.value == value);
        this.setState({
            editState: item
        })
    }

    remove = (value) => {
        let index = this.state.data.findIndex(i => i.value == value);
        this.state.data.splice(index, 1);
        this.setState({
            data: this.state.data
        }, this.liftStateUp);
    }

    onChange = (e, p1, p2) => {
        if (!p2) {
            this.state.editState[p1] = e.target.value;
        }
        else {
            this.state.editState[p1][p2] = e;
        }

        this.setState({
            editState: this.state.editState
        })
    }

    clearEdit = () => {
        this.thenShowRef.current.clear();
        this.thenHideRef.current.clear();
        this.elseShowRef.current.clear();
        this.elseHideRef.current.clear();

        this.setState({
            editState: {
                value: '',
                then: {
                    show: [],
                    hide: []
                },
                else: {
                    show: [],
                    hide: []
                }
            }
        })
    }
    
    liftStateUp = () => {
        this.props.onConditionalFlowChange.call(this.props.parent, 'ConditionalFlow', 'ConditionalFlow', {
            target: {
                ConditionalFlow: JSON.stringify({
                    entries: this.state.data
                })
            }
        });
    }

    render() {
        return (
            <div>
                <fieldset>
                    <legend>Conditional Flow</legend>
                    <div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label>When Value</label>
                                    <input type="text" className="form-control" value={this.state.editState.value} onChange={e => this.onChange(e, 'value')} />
                                </div>
                            </div>
                        </div>
                        <fieldset>
                            <legend>Then</legend>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Show Fields</label>
                                        <Typeahead id="thenshow" ref={this.thenShowRef} multiple options={this.fieldNames} selected={this.state.editState.then.show} onChange={e => this.onChange(e, 'then', 'show')}></Typeahead>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Hide Fields</label>
                                        <Typeahead id="thenhide" ref={this.thenHideRef} multiple options={this.fieldNames} selected={this.state.editState.then.hide} onChange={e => this.onChange(e, 'then', 'hide')}></Typeahead>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>Else</legend>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Show Fields</label>
                                        <Typeahead id="elseshow" ref={this.elseShowRef} multiple options={this.fieldNames} selected={this.state.editState.else.show} onChange={e => this.onChange(e, 'else', 'show')}></Typeahead>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Hide Fields</label>
                                        <Typeahead id="elsehide" ref={this.elseHideRef} multiple options={this.fieldNames} selected={this.state.editState.else.hide} onChange={e => this.onChange(e, 'else', 'hide')}></Typeahead>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="row">
                            <div className="col-sm-12">
                                <button type="button" className="btn btn-success" style={{ float: "right", marginBottom: "10", width: "85px" }} onClick={this.save}>Save</button>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map((item, idx) => {
                                    return (
                                        <tr key={item.value}>
                                            <td style={{ padding: "0.45rem 0.75rem" }}>
                                                <div>
                                                    <label style={{ marginTop: "9px" }}>
                                                        {item.value}
                                                    </label>
                                                    <button type="button" className="btn btn-danger" style={{ float: "right", width: "85px", marginLeft: "5px" }} onClick={() => this.remove(item.value)}>Remove</button>
                                                    <button type="button" className="btn btn-primary" style={{ float: "right", width: "85px" }} onClick={() => this.edit(item.value)}>Edit</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>
        )
    }
}