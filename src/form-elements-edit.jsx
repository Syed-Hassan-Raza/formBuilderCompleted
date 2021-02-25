import React from "react";
import TextAreaAutosize from "react-textarea-autosize";

import { ContentState, EditorState } from "draft-js";

import DynamicOptionList from "./dynamic-option-list";
import AutoCompleteOptionList from "./autocomplete-option-list";
import store from "./stores/store";
import CondtionalFlowList from "./CondtionalFlowList";

import {
  fieldNames,
  editorFormats,
  dateFormats,
  timeFormats,
  findElementName,
  hasWhiteSpace,
  convertToCode,
} from "./constants";
import Editor from "./CommonMethods/Editor";

import $ from "jquery";

export default class FormElementsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      editorState: undefined,
      isEditor: true,
      isReadOnly: false,
    };
  }

  componentDidMount() {
    $("a[href='#tabs-1']").click(function () {
      $("#tabs-2").hide();
      $("a[href='#tabs-2']").removeClass("active");
      $("a[href='#tabs-1']").addClass("active");
      $("#tabs-1").show().fadeIn();
      return false;
    });
    $("a[href='#tabs-2']").click(function () {
      $("#tabs-1").hide();
      $("a[href='#tabs-1']").removeClass("active");
      $("a[href='#tabs-2']").addClass("active");
      $("#tabs-2").show().fadeIn();
      return false;
    });
  }

  editElementName(e) {
    const this_element = this.state.element;
    this_element.Name = e.target.value;

    let _typeDetail = this.getTypeDetails(e);
    if (_typeDetail) {
      this_element.TypeDetail = _typeDetail;
    }
    this.setState({
      element: this_element,
      dirty: true,
    });
  }

  updateElementName() {
    const this_element = this.state.element;
    // to prevent ajax calls with no change
    let data = this.props.preview.state.data;
    let found = findElementName(data, this_element);
    if (found) {
      alert("This name is already exists.");
      // this_element.Name = "";
    } else {
      if (hasWhiteSpace(this_element.Name)) {
        this_element.Name = this_element.Name.replace(/\s/g, "_");
      }

      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({ dirty: false });
      }
    }
  }
  editElementForFormat(elemProperty, targProperty, e) {
    const this_element = this.state.element;
    let val = e.target.value;
    if (val) {
      this_element[elemProperty] = val;

      let content =
        this.state.editorState ||
        EditorState.createWithContent(ContentState.createFromText(""));
      let defaultValue = convertToCode(content, val);
      this_element["DefaultValue"] = defaultValue;
    } else {
      this_element["DefaultValue"] = "";
      this_element[elemProperty] = null;
    }

    this.setState({
      element: this_element,
      dirty: true,
    });
  }
  getTypeDetails(e) {
    let obj = fieldNames;
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].name == e.target.value) {
        return obj[i].typeDetail;
      }
    }
  }
  editElementProp(elemProperty, targProperty, e) {
    const this_element = this.state.element;
    this_element[elemProperty] = e.target[targProperty];

    this.setState(
      {
        element: this_element,
        dirty: true,
      },
      () => {
        if (targProperty === "checked") {
          this.updateElement();
        }
      }
    );
  }

  editElementForCheckBox(elemProperty, targProperty, e) {
    const this_element = this.state.element;
    this_element[elemProperty] = JSON.stringify(e.target[targProperty]);

    this.setState(
      {
        element: this_element,
        dirty: true,
      },
      () => {
        if (targProperty === "checked") {
          this.updateElement();
        }
      }
    );
  }

  updateElement() {
    const this_element = this.state.element;
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element);
      this.setState({ dirty: false });
    }
  }

  toggleColor = (color) => {
    const newEditorState = styles.color.toggle(this.state.editorState, color);

    return this.updateEditorState(newEditorState);
  };

  handleButtonChange(para, event) {
    // var val = event.currentTarget.querySelector("input").value;
    let val = para === "editor" ? true : false;
    this.setState({ isEditor: val });
  }

  handleRadioDefaultValue() {
    this.setState({ element: this.props.element });
  }
  defaultValueSection(controlType) {
    return (
      <div className="form-group">
        <div className="row">
          <div className="col-sm-12 tooltip">
            <label className="control-label" htmlFor="elementWidth">
              Default Value
            </label>
            {controlType === "TextArea" && (
              <textarea
                rows="3"
                className="form-control"
                value={this.state.element.DefaultValue || ""}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(
                  this,
                  "DefaultValue",
                  "value"
                )}
              />
            )}

            {controlType !== "TextArea" && (
              <input
                type={controlType}
                className="form-control"
                value={this.state.element.DefaultValue || ""}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(
                  this,
                  "DefaultValue",
                  "value"
                )}
              />
            )}

            <span className="tooltiptext tooltiptext-bottom">
              The default value of the control, if user is not put any value
              this value will be used
            </span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.dirty) {
      this.props.element.dirty = true;
    }
    const this_Mandatory = this.props.element.hasOwnProperty("Mandatory")
      ? this.props.element.Mandatory
      : false;
    let this_DefaultValue;
    if (this.props.element.element === "Checkboxes")
      this_DefaultValue = JSON.parse(
        this.props.element.DefaultValue
          ? this.props.element.DefaultValue.toString().toLowerCase()
          : "false"
      );

    const this_read_only = this.props.element.hasOwnProperty("ReadOnly")
      ? this.props.element.ReadOnly
      : false;

    const this_Visible = this.props.element.hasOwnProperty("Visible")
      ? this.props.element.Visible
      : false;
    const this_default_today = this.props.element.hasOwnProperty("defaultToday")
      ? this.props.element.defaultToday
      : false;
    const this_show_time_select = this.props.element.hasOwnProperty(
      "showTimeSelect"
    )
      ? this.props.element.showTimeSelect
      : false;
    const this_show_time_select_only = this.props.element.hasOwnProperty(
      "showTimeSelectOnly"
    )
      ? this.props.element.showTimeSelectOnly
      : false;
    const this_checked_inline = this.props.element.hasOwnProperty("inline")
      ? this.props.element.inline
      : false;
    const this_checked_bold = this.props.element.hasOwnProperty("bold")
      ? this.props.element.bold
      : false;
    const this_checked_italic = this.props.element.hasOwnProperty("italic")
      ? this.props.element.italic
      : false;
    const this_checked_center = this.props.element.hasOwnProperty("center")
      ? this.props.element.center
      : false;
    const this_checked_page_break = this.props.element.hasOwnProperty(
      "pageBreakBefore"
    )
      ? this.props.element.pageBreakBefore
      : false;
    const this_checked_alternate_form = this.props.element.hasOwnProperty(
      "alternateForm"
    )
      ? this.props.element.alternateForm
      : false;

    const {
      canHavePageBreakBefore,
      canHaveAlternateForm,
      canHaveDisplayHorizontal,
      canHaveOptionCorrect,
      canHaveOptionValue,
    } = this.props.element;

    const this_files = this.props.files.length ? this.props.files : [];
    if (
      this_files.length < 1 ||
      (this_files.length > 0 && this_files[0].id !== "")
    ) {
      this_files.unshift({ id: "", file_name: "" });
    }

    let dateTimeFormats;
    if (this.props.element.Type === 4) {
      dateTimeFormats = dateFormats;
    }
    if (this.props.element.Type === 7) {
      dateTimeFormats = timeFormats;
    }

    // let editorState =this.state.editorState;
    //
    // let isHtml=(this.props.element.TypeDetail==="html" || this.props.element.TypeDetail==="html64")?true:false;
    // // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
    // let md,html
    // if(this.props.element.DefaultValue)
    // {  if(!isHtml){     md =markdownToDraft(this.props.element.DefaultValue);
    //   editorState=md;

    // }
    //    if(isHtml){
    //     html=this.convertFromHTML(this.props.element.DefaultValue)
    //     editorState=html;

    //    }
    // }

    let baseClassForEditor = "btn btn-primary";
    if (this.state.isEditor) {
      baseClassForEditor += " active";
    }

    let baseClassForCode = "btn btn-primary";
    if (!this.state.isEditor) {
      baseClassForCode += " active";
    }
    let RedioTypeDetails;
    if (this.state.element.element === "RadioButtons") {
      RedioTypeDetails = JSON.parse(this.state.element.TypeDetail || {});
    }

    return (
      <div>
        <div className="clearfix">
          <div className="container">
            <div className="row">
              {this.props.element.Name !== "StateFlow" && (
                <div className="col-10">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#tabs-1"
                        role="tab"
                      >
                        Properties
                      </a>
                    </li>
                    {this.props.element.element !== "FieldGroups" && (
                      <li className="nav-item">
                        <a className="nav-link" href="#tabs-2" role="tab">
                          Conditional Flow
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div
                className={
                  this.props.element.Name === "StateFlow" ? "col-12" : "col-2"
                }
              >
                <i
                  className="float-right fas fa-times dismiss-edit"
                  onClick={this.props.manualEditModeOff}
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div className="tab-pane active" id="tabs-1" role="tabpanel">
            <div className="row">
              <div className="col-sm-12">
                {this.props.element.Name !== "StateFlow" && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-12 tooltip">
                        <label className="control-label" htmlFor="elementWidth">
                          Field Name{" "}
                          {this.props.element.element !== "FieldGroups" && (
                            <span className="badge badge-danger">Required</span>
                          )}
                        </label>

                        <div className="select-editable">
                          <select
                            className="form-control"
                            onChange={this.editElementName.bind(this)}
                          >
                            {Object.keys(fieldNames).map((k, i) => {
                              return (
                                <option value={fieldNames[k].name} key={i}>
                                  {fieldNames[k].name}
                                </option>
                              );
                            })}
                          </select>
                          <input
                            id="fieldNames"
                            value={this.props.element.Name}
                            className="form-control"
                            autoComplete="off"
                            onBlur={this.updateElementName.bind(this)}
                            onChange={this.editElementName.bind(this)}
                          />
                        </div>

                        <span
                          className="tooltiptext tooltiptext-bottom"
                          style={{ marginTop: "25px" }}
                        >
                          Control name, you can put your custom name or select
                          from the list. used in form submission
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {this.props.element.hasOwnProperty("Label") && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-12 tooltip">
                        <label className="control-label" htmlFor="elementWidth">
                          Display Label
                        </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={this.props.element.Label}
                            onBlur={this.updateElement.bind(this)}
                            onChange={this.editElementProp.bind(
                              this,
                              "Label",
                              "value"
                            )}
                          />

                        <span className="tooltiptext tooltiptext-bottom">
                          A static label text which displays along with your
                          field
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(this.props.element.Type === 4 ||
                  this.props.element.Type === 7) && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="control-label" htmlFor="Format">
                          Format
                        </label>

                        <div className="select-editable">
                          <select
                            className="form-control"
                            onChange={this.editElementProp.bind(
                              this,
                              "TypeDetail",
                              "value"
                            )}
                          >
                            <option></option>
                            {dateTimeFormats.map((k, i) => {
                              return (
                                <option value={k} key={i}>
                                  {k}
                                </option>
                              );
                            })}
                          </select>
                          <input
                            id="Format"
                            className="form-control"
                            onBlur={this.updateElement.bind(this)}
                            value={this.state.element.TypeDetail || ""}
                            onChange={this.editElementProp.bind(
                              this,
                              "TypeDetail",
                              "value"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {this.props.element.element === "Checkboxes" && (
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        id="is-defaultvalue"
                        className="custom-control-input"
                        type="checkbox"
                        checked={this_DefaultValue || false}
                        onChange={this.editElementForCheckBox.bind(
                          this,
                          "DefaultValue",
                          "checked"
                        )}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="is-defaultvalue"
                      >
                        Default Value
                      </label>
                    </div>
                  </div>
                )}

                {this.props.element.Type === 5 && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-12 tooltip">
                        <label className="control-label" htmlFor="defaultValue">
                          Pick List{" "}
                          <span className="badge badge-danger">Required</span>
                        </label>
                        <select
                          id="defaultValue"
                          value={this.props.element.TypeDetail}
                          className="form-control"
                          onBlur={this.updateElement.bind(this)}
                          onChange={this.editElementProp.bind(
                            this,
                            "TypeDetail",
                            "value"
                          )}
                        >
                          {store.state.pickLists &&
                            Object.keys(store.state.pickLists).map((obj, i) => {
                              return (
                                <option
                                  value={store.state.pickLists[obj].Key}
                                  key={i}
                                >
                                  {store.state.pickLists[obj].Value}
                                </option>
                              );
                            })}
                        </select>
                        <span className="tooltiptext tooltiptext-bottom">
                          An auto-populated list from the server. select list
                          values will be filled according to the selected Pick
                          List.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {this.props.element.element === "RadioButtons" && (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="control-label" htmlFor="defaultValue">
                          Default Value
                        </label>
                        <select
                          value={this.state.element.DefaultValue}
                          id="defaultValue"
                          className="form-control"
                          onClick={this.handleRadioDefaultValue.bind(this)}
                          onBlur={this.updateElement.bind(this)}
                          onChange={this.editElementProp.bind(
                            this,
                            "DefaultValue",
                            "value"
                          )}
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
                      </div>
                    </div>
                  </div>
                )}
                {
                  <div>
                    {(this.props.element.element === "TextArea" ||
                      this.props.element.element === "Autocomplete" ||
                      this.props.element.element === "Assignee" ||
                      this.props.element.element === "Barcode") &&
                      this.defaultValueSection("TextArea")}

                    {(this.props.element.element === "TextInput" ||
                      this.props.element.element === "DatePicker" ||
                      this.props.element.element === "TimePicker" ||
                      this.props.element.element === "Dropdown") &&
                      this.defaultValueSection("text")}

                    {(this.props.element.element === "NumberInput" ||
                      this.props.element.element === "DecimalInput" ||
                      this.props.element.element === "Calculated" ||
                      this.props.element.element === "Counter") &&
                      this.defaultValueSection("number")}

                    {this.props.element.element === "StaticText" && (
                      <>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-sm-6">
                              <label
                                className="control-label"
                                htmlFor="defaultValue"
                              >
                                Format
                              </label>
                              <select
                                id="defaultValue"
                                className="form-control"
                                onBlur={this.updateElement.bind(this)}
                                defaultValue={
                                  this.props.element.TypeDetail || null
                                }
                                onChange={this.editElementForFormat.bind(
                                  this,
                                  "TypeDetail",
                                  "value"
                                )}
                              >
                                {editorFormats.map((k, i) => {
                                  return (
                                    <option value={k} key={i}>
                                      {k}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            {this.state.element.TypeDetail && (
                              <div className="col-sm-5">
                                <div
                                  className="btn-group btn-group-toggle"
                                  data-toggle="buttons"
                                  style={{ marginTop: 28 }}
                                >
                                  <label className={baseClassForEditor}>
                                    <input
                                      type="checkbox"
                                      name="options1"
                                      defaultChecked={
                                        this.state.isEditor ||
                                        this.props.isEditor
                                      }
                                      defaultValue={false}
                                      onClick={this.handleButtonChange.bind(
                                        this,
                                        "editor"
                                      )}
                                    />{" "}
                                    Editor
                                  </label>
                                  <label className={baseClassForCode}>
                                    <input
                                      type="checkbox"
                                      name="options2"
                                      defaultChecked={
                                        !this.state.isEditor ||
                                        this.props.isEditor
                                      }
                                      defaultValue={false}
                                      onClick={this.handleButtonChange.bind(
                                        this,
                                        "code"
                                      )}
                                    />{" "}
                                    Code
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-sm-12 tooltip">
                              <label>Default Value</label>
                              {this.state.isEditor &&
                                this.state.element.TypeDetail && (
                                  <Editor
                                    style={{
                                      cursor: "text",
                                      border: "1px solid #e9ecee",
                                    }}
                                    element={this.state.element}
                                    isReadOnly={false}
                                    updateElement={this.props.updateElement}
                                    preview={this.props.preview}
                                    state={this.state}
                                    // handlePastedText={this.handlePastedText}
                                  />
                                )}
                              {(!this.state.isEditor ||
                                !this.state.element.TypeDetail) && (
                                <div>
                                  <label
                                    className="control-label"
                                    htmlFor="elementWidth"
                                  >
                                    {this.state.element.TypeDetail
                                      ? this.state.element.TypeDetail +
                                        " Output"
                                      : "Plain Text"}
                                  </label>
                                  <textarea
                                    rows="5"
                                    className="form-control"
                                    value={this.state.element.DefaultValue}
                                    onBlur={this.updateElement.bind(this)}
                                    onChange={this.editElementProp.bind(
                                      this,
                                      "DefaultValue",
                                      "value"
                                    )}
                                  />
                                  {this.state.element.TypeDetail && (
                                    <span className="tooltiptext tooltiptext-bottom">
                                      {" "}
                                      {this.state.element.TypeDetail +
                                        " auto-generated code, you can also modify it"}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {this.props.element.Name !== "StateFlow" && (
                      <div className="form-group">
                        <div className="row">
                          <div className="col-sm-4 tooltip">
                            <label className="control-label">Max Width</label>
                            <input
                              type="number"
                              className="form-control"
                              defaultValue={this.props.element.MaxWidth}
                              onBlur={this.updateElement.bind(this)}
                              onChange={this.editElementProp.bind(
                                this,
                                "MaxWidth",
                                "value"
                              )}
                            />
                            <span className="tooltiptext tooltiptext-bottom">
                              Maximum width of the control
                            </span>
                          </div>
                          <div className="col-sm-4 tooltip">
                            <label className="control-label">Min Width</label>
                            <input
                              type="number"
                              className="form-control"
                              defaultValue={this.props.element.MinWidth}
                              onBlur={this.updateElement.bind(this)}
                              onChange={this.editElementProp.bind(
                                this,
                                "MinWidth",
                                "value"
                              )}
                            />
                            <span className="tooltiptext tooltiptext-bottom">
                              Minimum width of the control
                            </span>
                          </div>
                          <div className="col-sm-4 tooltip">
                            <label className="control-label">Width Ratio</label>
                            <input
                              type="number"
                              max={1}
                              min={0}
                              className="form-control"
                              defaultValue={
                                this.props.element.ControlWidthRatio
                              }
                              onBlur={this.updateElement.bind(this)}
                              onChange={this.editElementProp.bind(
                                this,
                                "ControlWidthRatio",
                                "value"
                              )}
                            />
                            <span className="tooltiptext tooltiptext-bottom">
                              The ratio of the horizontal width of the control.
                              1 for full width or 0.5 for half, etc.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                }
                <br />

                {this.props.element.hasOwnProperty("Label") && (
                  <div className="form-group">
                    {this.state.element.element !== "StaticText" && (
                      <div className="custom-control custom-checkbox">
                        <input
                          id="is-required"
                          className="custom-control-input"
                          type="checkbox"
                          checked={this_Mandatory}
                          disabled={this_read_only}
                          onChange={this.editElementProp.bind(
                            this,
                            "Mandatory",
                            "checked"
                          )}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="is-required"
                        >
                          Mandatory
                        </label>
                      </div>
                    )}
                    <div className="custom-control custom-checkbox">
                      <input
                        id="is-Visible"
                        className="custom-control-input"
                        type="checkbox"
                        checked={this_Visible}
                        value={true}
                        onChange={this.editElementProp.bind(
                          this,
                          "Visible",
                          "checked"
                        )}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="is-Visible"
                      >
                        Visible
                      </label>
                    </div>

                    <div className="custom-control custom-checkbox">
                      <input
                        id="is-ReadOnly"
                        className="custom-control-input"
                        type="checkbox"
                        checked={this_read_only}
                        disabled={this_Mandatory}
                        onChange={this.editElementProp.bind(
                          this,
                          "ReadOnly",
                          "checked"
                        )}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="is-ReadOnly"
                      >
                        Read Only
                      </label>
                    </div>
                  </div>
                )}

                {this.props.element.showDescription && (
                  <div className="form-group">
                    <label
                      className="control-label"
                      htmlFor="questionDescription"
                    >
                      Description
                    </label>
                    <TextAreaAutosize
                      type="text"
                      className="form-control"
                      id="questionDescription"
                      defaultValue={this.props.element.description}
                      onBlur={this.updateElement.bind(this)}
                      onChange={this.editElementProp.bind(
                        this,
                        "description",
                        "value"
                      )}
                    />
                  </div>
                )}

                {this.props.element.Type === 12 && (
                  <DynamicOptionList
                    handleRadioDefaultValue={this.handleRadioDefaultValue.bind(
                      this
                    )}
                    canHaveOptionCorrect={canHaveOptionCorrect}
                    canHaveOptionValue={canHaveOptionValue}
                    updateElement={this.props.updateElement}
                    preview={this.props.preview}
                    element={this.props.element}
                    key={this.props.element.TypeDetail.length}
                  />
                )}
                {this.props.element.Type === 15 && (
                  <AutoCompleteOptionList
                    showCorrectColumn={this.props.showCorrectColumn}
                    canHaveOptionCorrect={canHaveOptionCorrect}
                    canHaveOptionValue={canHaveOptionValue}
                    data={this.props.preview.state.data}
                    updateElement={this.props.updateElement}
                    preview={this.props.preview}
                    element={this.props.element}
                    key={this.props.element.TypeDetail.length}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="tab-pane" id="tabs-2" role="tabpanel">
            {this.props.element.hasOwnProperty("ConditionalFlow") &&
              this.props.element.Name !== "StateFlow" && (
                <>
                  <CondtionalFlowList
                    conditionalFlowMode={true}
                    parent={this}
                    conditionalFlow={this.props.element.ConditionalFlow}
                    onConditionalFlowChange={this.editElementProp}
                  ></CondtionalFlowList>
                </>
              )}
          </div>
        </div>

        {this.props.element.Name === "StateFlow" && (
          <>
            <CondtionalFlowList
              conditionalFlowMode={false}
              parent={this}
              conditionalFlow={this.props.element.ConditionalFlow}
            ></CondtionalFlowList>
          </>
        )}
      </div>
    );
  }
}
FormElementsEdit.defaultProps = { className: "edit-element-fields" };
