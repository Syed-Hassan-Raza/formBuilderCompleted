import { data } from "jquery";
import React from "react";
import store from "./stores/store";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default class CondtionalFlowList extends React.Component {
  constructor(props) {
    debugger
    super(props);
    this.thenShowRef = React.createRef();
    this.thenHideRef = React.createRef();
    this.thenEnableRef = React.createRef();
    this.thenDisableRef = React.createRef();
    this.elseShowRef = React.createRef();
    this.elseHideRef = React.createRef();
    this.elseEnableRef = React.createRef();
    this.elseDisableRef = React.createRef();
    let data;
    let templateId;

    if (this.props.conditionalFlowMode) {
      data = JSON.parse(this.props.conditionalFlow || '{ "entries": [] }');
    } else {
      templateId = store.state.data.StateFlowTemplate;
      data = store.state.data.StateFlow || { entries: [] };
    }

    this.state = {
      data: data.entries,
      element:this.props.parent.state.element,
      errorLabel: "",
      editState: {
        value: "",
        templateId: templateId,
        then: {
          show: [],
          hide: [],
          enable: [],
          disable: [],
        },
        else: {
          show: [],
          hide: [],
          enable: [],
          disable: [],
        },
      },
    };

    this.fieldNames = [];
    this.getFieldNames(store.state.data, this.fieldNames);
  }

  getFieldNames = (data, addToList) => {
    data.Fields.forEach((item) => {
      if (item.Name) addToList.push(item.Name);
    });

    if (data.FieldGroups && data.FieldGroups.length > 0) {
      data.FieldGroups.forEach((item) => {
        if (item.Name) addToList.push(item.Name);

        this.getFieldNames(item, addToList);
      });
    }
  };

  save = () => {
    if (!this.state.editState.value) {
        this.setState({ errorLabel: "Please fill all required fields" });
        return;
    } else if (
      !this.props.conditionalFlowMode &&
      !this.state.editState.templateId
    ) {
      this.setState({ errorLabel: "Please fill all required fields" });
      return;
    }

    if (!this.state.data.some((i) => i.value == this.state.editState.value)) {
      let newCondition = {
        value: this.state.editState.value,
        then: {
          show: this.state.editState.then.show
            .join(",")
            .split(",")
            .filter((i) => i),
          hide: this.state.editState.then.hide
            .join(",")
            .split(",")
            .filter((i) => i),
          enable: this.state.editState.then.enable
            .join(",")
            .split(",")
            .filter((i) => i),
          disable: this.state.editState.then.disable
            .join(",")
            .split(",")
            .filter((i) => i),
        },
        else: {
          show: this.state.editState.else.show
            .join(",")
            .split(",")
            .filter((i) => i),
          hide: this.state.editState.else.hide
            .join(",")
            .split(",")
            .filter((i) => i),
          enable: this.state.editState.else.enable
            .join(",")
            .split(",")
            .filter((i) => i),
          disable: this.state.editState.else.disable
            .join(",")
            .split(",")
            .filter((i) => i),
        },
      };

      this.setState(
        {
          data: this.state.data.concat(newCondition),
        },
        this.liftStateUp
      );

      this.clearEdit();
    } else {
      let index = this.state.data.findIndex(
        (i) => i.value == this.state.editState.value
      );
      if (index !== -1) {
        this.state.data[index] = {
          value: this.state.editState.value,
          then: {
            show: this.state.editState.then.show
              .join(",")
              .split(",")
              .filter((i) => i),
            hide: this.state.editState.then.hide
              .join(",")
              .split(",")
              .filter((i) => i),
            enable: this.state.editState.then.enable
              .join(",")
              .split(",")
              .filter((i) => i),
            disable: this.state.editState.then.disable
              .join(",")
              .split(",")
              .filter((i) => i),
          },
          else: {
            show: this.state.editState.else.show
              .join(",")
              .split(",")
              .filter((i) => i),
            hide: this.state.editState.else.hide
              .join(",")
              .split(",")
              .filter((i) => i),
            enable: this.state.editState.else.enable
              .join(",")
              .split(",")
              .filter((i) => i),
            disable: this.state.editState.else.disable
              .join(",")
              .split(",")
              .filter((i) => i),
          },
        };

        this.setState(
          {
            data: this.state.data,
          },
          this.liftStateUp
        );

        this.clearEdit();
      }
    }
    this.setState({ errorLabel:""})

  };

  edit = (value) => {
    let item = this.state.data.find((i) => i.value == value);
    this.setState({
      editState: { templateId: this.state.editState.templateId, ...item }
    });
  };

  remove = (value) => {
    let index = this.state.data.findIndex((i) => i.value == value);
    this.state.data.splice(index, 1);
    this.setState(
      {
        data: this.state.data,
      },
      this.liftStateUp
    );
  };

  onChange = (e, p1, p2) => {
    if (!p2) {
      this.state.editState[p1] = e.target.value;
    } else {
      this.state.editState[p1][p2] = e;
    }

    this.setState({
      editState: this.state.editState,
    }, () => {
      if (p1 == "templateId")
        this.liftStateUp();
    });
  };

  clearEdit = () => {
    this.thenShowRef.current.clear();
    this.thenHideRef.current.clear();
    this.thenEnableRef.current.clear();
    this.thenDisableRef.current.clear();
    this.elseShowRef.current.clear();
    this.elseHideRef.current.clear();
    this.elseEnableRef.current.clear();
    this.elseDisableRef.current.clear();

    this.setState({
      editState: {
        value: "",
        templateId: this.state.editState.templateId,
        then: {
          show: [],
          hide: [],
          enable: [],
          disable: [],
        },
        else: {
          show: [],
          hide: [],
          enable: [],
          disable: [],
        },
      },
    });
  };

  liftStateUp = () => {
    if (this.props.conditionalFlowMode) {
      this.props.onConditionalFlowChange.call(
        this.props.parent,
        "ConditionalFlow",
        "ConditionalFlow",
        {
          target: {
            ConditionalFlow: JSON.stringify({
              entries: this.state.data,
            }),
          },
        }
      );
    } else {
      store.dispatch("handleStateFlow", {
        templateId: this.state.editState.templateId,
        stateFlow: JSON.stringify({ entries: this.state.data }),
      });
    }
  };
  ShowInfo(text) {
    return (
      <div className="tooltip" style={{display:"inline-block",width:"50%"}}>
        <button
          style={{ marginLeft: "5Px",    marginTop: "-8px"}}
          type="button"
          className="btn btn-outline-primary btn-sm"
        >
          <span className="btn-label">
            <i className="fa fa-info"></i>
          </span>
        </button>
        <span className="tooltiptext tooltiptext-bottom">{text}</span>

      </div>
    );
  }
  handleParentState(){
    debugger
    let this_element=this.props.parent.props.element;
   this.setState({element:this_element});
  }

  render() {
    let RedioTypeDetails;
    if (this.state.element.element === "RadioButtons") {
      RedioTypeDetails = JSON.parse(this.state.element.TypeDetail || {});
    }
    return (
      <div>
        <fieldset>
          <legend>
            {this.props.conditionalFlowMode
              ? "Conditional Flow"
              : "State Flow (Entire Form)"}

            {this.props.conditionalFlowMode &&
              this.ShowInfo(
                "Conditional Flows give you the flexibility to show, hide or enable-disable specific control based on a value."
              )}

            {!this.props.conditionalFlowMode &&
              this.ShowInfo(
                "State Flows give you the flexibility to show, hide, or enable-disable specific control based on a form state and template."
              )}
          </legend>
          <div>
            {this.props.conditionalFlowMode ? (
              <></>
            ) : (
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>
                      Template{" "}
                      <span className="badge badge-danger">Required</span>
                    </label>
                    <select
                      className="form-control"
                      value={this.state.editState.templateId || ""}
                      onChange={(e) => this.onChange(e, "templateId") || ""}
                    >
                      <option></option>
                      {store.state.stateFlowTemplates &&
                        store.state.stateFlowTemplates.map((d, i) => {
                          return <option key={i} value={d.Key || ""}>{d.Value}</option>;
                        })}
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label>
                    When {this.props.conditionalFlowMode ? "Value" : "State"}{" "}
                    <span className="badge badge-danger">Required</span>
                  </label>

                  {this.state.element.element==="RadioButtons" && (
                                <select
                                value={this.state.editState.value || ""}
                                id="defaultValue"
                                className="form-control"
                                onClick={this.handleParentState.bind(this)}
                                onChange={(e) => this.onChange(e, "value")}
                              >
                                <option></option>
                                {Object.keys(RedioTypeDetails).map((k, i) => {
                                  if (RedioTypeDetails[k])
                                    return (
                                      <option value={RedioTypeDetails[k]} key={i}>
                                        {RedioTypeDetails[k]}
                                      </option>
                                    );
                                })}
                              </select>
                  )}
                           {this.state.element.element==="Checkboxes" && (
                                <select
                                value={this.state.editState.value || ""}
                                id="defaultValue"
                                className="form-control"
                                onChange={(e) => this.onChange(e, "value")}
                              >
                                <option></option>
                                <option value={true}>Checked</option>
                                <option value={false}>Unchecked</option>

                                    );
                              </select>
                  )}

                  {(this.props.conditionalFlowMode && this.state.element.element!=="Checkboxes" && this.state.element.element!=="RadioButtons") && (
                    
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.editState.value || ""}
                      onChange={(e) => this.onChange(e, "value")}
                    />
                  )} {(!this.props.conditionalFlowMode && this.state.element.element!=="Checkboxes" && this.state.element.element!=="RadioButtons") && (
                    <select
                      className="form-control"
                      value={this.state.editState.value || ""}
                      onChange={(e) => this.onChange(e, "value")}
                    >
                      <option></option>
                      <option value="__DEFAULT__">__DEFAULT__</option>
                      <option value="completed">completed</option>
                      <option value="closed">closed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
            <fieldset>
              <legend>Then</legend>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Show Fields</label>
                    <Typeahead
                      id="thenshow"
                      ref={this.thenShowRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.then.show}
                      onChange={(e) => this.onChange(e, "then", "show")}
                    ></Typeahead>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Hide Fields</label>
                    <Typeahead
                      id="thenhide"
                      ref={this.thenHideRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.then.hide}
                      onChange={(e) => this.onChange(e, "then", "hide")}
                    ></Typeahead>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Enable Fields</label>
                    <Typeahead
                      id="thenenable"
                      ref={this.thenEnableRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.then.enable}
                      onChange={(e) => this.onChange(e, "then", "enable")}
                    ></Typeahead>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Disable Fields</label>
                    <Typeahead
                      id="thendisable"
                      ref={this.thenDisableRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.then.disable}
                      onChange={(e) => this.onChange(e, "then", "disable")}
                    ></Typeahead>
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
                    <Typeahead
                      id="elseshow"
                      ref={this.elseShowRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.else.show}
                      onChange={(e) => this.onChange(e, "else", "show")}
                    ></Typeahead>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Hide Fields</label>
                    <Typeahead
                      id="elsehide"
                      ref={this.elseHideRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.else.hide}
                      onChange={(e) => this.onChange(e, "else", "hide")}
                    ></Typeahead>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Enable Fields</label>
                    <Typeahead
                      id="elseenable"
                      ref={this.elseEnableRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.else.enable}
                      onChange={(e) => this.onChange(e, "else", "enable")}
                    ></Typeahead>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Disable Fields</label>
                    <Typeahead
                      id="elsedisable"
                      ref={this.elseDisableRef}
                      multiple
                      options={this.fieldNames}
                      selected={this.state.editState.else.disable}
                      onChange={(e) => this.onChange(e, "else", "disable")}
                    ></Typeahead>
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="row">
              <div className="col-sm-12">

               {this.state.errorLabel!=="" &&(<div className="alert alert-danger" role="alert">
                  {this.state.errorLabel}
                </div>
               )}
                <button
                  type="button"
                  className="btn btn-success"
                  style={{ float: "right", marginBottom: "10", width: "85px" }}
                  onClick={this.save}
                >
                  Save
                </button>
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
                {this.state.data.length > 0 ? (
                  this.state.data.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td style={{ padding: "0.45rem 0.75rem" }}>
                          <div>
                            <label style={{ marginTop: "9px" }}>
                              {item.value}
                            </label>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{
                                float: "right",
                                width: "85px",
                                marginLeft: "5px",
                              }}
                              onClick={() => this.remove(item.value)}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ float: "right", width: "85px" }}
                              onClick={() => this.edit(item.value)}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {this.props.conditionalFlowMode ? "Conditional" : "State"}{" "}
                      Flow is not applied.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>
    );
  }
}
