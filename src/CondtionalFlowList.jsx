import { data } from "jquery";
import React from "react";

export default class CondtionalFlowList extends React.Component {
    constructor(props) {
        super(props);
        this.txtValueRef = React.createRef();
        this.txtShowFieldsRef = React.createRef();
        this.txtHideFieldsRef = React.createRef();
        this.state = {
            data: this.props.ConditionalFlow.entries
        }
    }

    add = () => {
        if (this.state.data.some(i => i.value == this.txtValueRef.current.value)) {
            alert("Values should be unique.");
            return;
        }

        let newCondition = {
            value: this.txtValueRef.current.value,
            then: {
                show: this.txtShowFieldsRef.split(','),
                hide: []
            },
            else: {
                show: this.txtShowFieldsRef.split(','),
                hide: []
            }
        }
    }

    render() {
        return (
            <div>
                <fieldset>
                    <legend>Conditional Flow</legend>
                    <div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label>When Value</label>
                                    <input type="text" class="form-control" />
                                </div>
                            </div>
                        </div>
                        <fieldset>
                            <legend>Then</legend>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Show Fields</label>
                                        <input type="text" class="form-control" />
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Hide Fields</label>
                                        <input type="text" class="form-control" />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>Else</legend>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Show Fields</label>
                                        <input type="text" class="form-control" />
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Hide Fields</label>
                                        <input type="text" class="form-control" />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <ul class="list-group">
                            {this.state.data.map(function (d, idx) {
                                return (
                                    <li class="list-group-item">
                                        {d.value}
                                        <button type="button" class="btn btn-primary pull-right">Primary</button>
                                    </li>
                                )
                            })}
                        </ul>
                </fieldset>
            </div>
        )
    }
}