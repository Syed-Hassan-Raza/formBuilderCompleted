import React from "react";
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import TextAreaAutosize from "react-textarea-autosize";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";

import DynamicOptionList from "./dynamic-option-list";
import AutoCompleteOptionList from "./autocomplete-option-list";
import { get } from "./stores/requests";
import ID from "./UUID";
import store from "./stores/store";
import { parseJSON } from "date-fns";
import CondtionalFlowList from "./CondtionalFlowList";
const toolbar = {
  options: ["inline", "list", "link", "textAlign", "fontSize", "history"],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ["bold", "italic", "underline", "superscript", "subscript"],
  },
};

export default class FormElementsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      editorState:undefined,
      isEditor: true,
    };
  }
  componentDidMount() {
    this.setState({ editorState: this.loadEditState() ||EditorState.createWithContent(ContentState.createFromText(''))});
  }

  formats = ["html", "html64", "md", "md64"];
  fieldsName = [
    { name: null, typeDetail: "" },
    { name: "sm_asset_category", typeDetail: "" },
    { name: "sm_asset_child_site", typeDetail: "" },
    { name: "sm_asset_child_site", typeDetail: "" },
    { name: "sm_asset_location", typeDetail: "" },
    { name: "sm_asset_machinehours", typeDetail: "" },
    { name: "sm_asset_make", typeDetail: "" },
    { name: "sm_asset_model", typeDetail: "" },
    { name: "sm_asset_name", typeDetail: "" },
    { name: "sm_asset_odometer", typeDetail: "" },
    { name: "sm_asset_odometerunit", typeDetail: 9 },
    { name: "sm_asset_operator", typeDetail: "" },
    { name: "sm_asset_operator_out", typeDetail: "" },
    { name: "sm_asset_serialnumber", typeDetail: "" },
    { name: "sm_asset_site_location", typeDetail: "" },
    { name: "sm_populate_best_cell_phone", typeDetail: "" },
    { name: "sm_populate_best_email", typeDetail: "" },
    { name: "sm_populate_client", typeDetail: 6 },
    { name: "sm_populate_date", typeDetail: "" },
    { name: "sm_populate_datetime", typeDetail: "" },
    { name: "sm_populate_department", typeDetail: 2 },
    { name: "sm_populate_division", typeDetail: 3 },
    { name: "sm_populate_job_classification", typeDetail: 1 },
    { name: "sm_populate_location", typeDetail: 4 },
    { name: "sm_populate_name", typeDetail: "" },
    { name: "sm_populate_personal_cell_phone", typeDetail: "" },
    { name: "sm_populate_personal_email", typeDetail: "" },
    { name: "sm_populate_priority", typeDetail: "" },
    { name: "sm_populate_subcontractor", typeDetail: 19 },
    { name: "sm_populate_time", typeDetail: "" },
    { name: "sm_populate_title", typeDetail: "" },
    { name: "sm_populate_update_date", typeDetail: "" },
    { name: "sm_populate_update_name", typeDetail: "" },
    { name: "sm_populate_work_cell_phone", typeDetail: "" },
    { name: "sm_populate_work_email", typeDetail: "" },
    { name: "sm_populate_latitude", typeDetail: "" },
    { name: "sm_populate_longitude", typeDetail: "" },
    { name: "sm_shapefile_hectare", typeDetail: "" },
    { name: "sm_shapefile_line", typeDetail: "" },
    { name: "sm_shapefile_name", typeDetail: "" },
    { name: "sm_shapefile_pline_id", typeDetail: "" },
    { name: "sm_shapefile_<name>", typeDetail: "" },
    { name: "sm_tag_identifier", typeDetail: 2 },
    { name: "sm_usershape_segment_end_lat", typeDetail: "" },
    { name: "sm_usershape_segment_end_lng", typeDetail: "" },
    { name: "sm_usershape_segment_start_lat", typeDetail: "" },
    { name: "sm_usershape_segment_start_lng", typeDetail: "" },
    { name: "sm_usershape_segmentlength", typeDetail: "" },
    { name: "sm_usershape_shapearea", typeDetail: "" },
    { name: "sm_usershape_shapelength", typeDetail: "" },
    { name: "sm_auto_formid", typeDetail: "" },
    { name: "sm_populate_subject", typeDetail: "" },
    { name: "sm_populate_assignee", typeDetail: 13 },
    { name: "sm_populate_attendee", typeDetail: "" },
  ];
  toggleRequired() {
    // const this_element = this.state.element;
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
  editElementForFormat(elemProperty, targProperty, e) {
    const this_element = this.state.element;
    this_element[elemProperty] = e.target.value;
    let val = e.target.value;
     let content =this.state.editorState||EditorState.createWithContent(ContentState.createFromText(''));

    let code = this.convertToCode(content, val);
    this_element["DefaultValue"] = code;

    this.setState(
      {
        element: this_element,
        dirty: true,
      }
    );
  }
  getTypeDetails(e) {
    let obj = this.fieldsName;
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
  convertToCode(editorContent, TypeDetail) {
    let isHtml =
      TypeDetail === "html" || TypeDetail === "html64" ? true : false;
    if (isHtml) {
      return draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
    } else if (!isHtml) {
      let r= draftjsToMd(convertToRaw(editorContent.getCurrentContent()));
      return r;
    }
    return null;
  }
  onEditorStateChange(index, property, editorContent) {
     let code = this.convertToCode(editorContent, this.props.element.TypeDetail);
    // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
     const this_element = this.state.element;
     this_element[property] = code;

    this.setState({
     element: this_element,
      dirty: true,
      editorState: editorContent,
    });
  }

  updateElement() {
    const this_element = this.state.element;
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element);
      this.setState({ dirty: false });
    }
  }

  convertFromHTML(content) {
    const newContent = convertFromHTML(content);
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      // to prevent crash when no contents in editor
      return EditorState.createEmpty();
    }
    const contentState = ContentState.createFromBlockArray(newContent);
    return EditorState.createWithContent(contentState);
  }
  loadEditState() {
    let editorState;
    if (
      this.state.element.TypeDetail === "html" ||
      this.state.element.TypeDetail === "html64"
    ) {
      if (this.state.element.DefaultValue)
       return this.convertFromHTML(this.state.element.DefaultValue);
    } else if (
      this.state.element.TypeDetail === "md" ||
      this.state.element.TypeDetail === "md64"
    ) {
      if (this.state.element.DefaultValue) {
        const markdownString = this.state.element.DefaultValue;
        const rawData = mdToDraftjs(markdownString);
        const contentState = convertFromRaw(rawData);
        const newEditorState = EditorState.createWithContent(contentState);
        return newEditorState;
      }
    }
    return null;
  }
  handleButtonChange(para, event) {
    // var val = event.currentTarget.querySelector("input").value;
    let val = para === "editor" ? true : false;
    this.setState({ isEditor: val });
  }

  render() {
    if (this.state.dirty) {
      this.props.element.dirty = true;
    }
    const this_Mandatory = this.props.element.hasOwnProperty("Mandatory")
      ? this.props.element.Mandatory
      : false;
    const this_DefaultValue =
      this.props.element.hasOwnProperty("DefaultValue") === ""
        ? false
        : this.props.element.DefaultValue;

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

    let editorState;
    if (this.state.element.element === "StaticText") {
      editorState = this.loadEditState();
    }
    let baseClassForEditor = "btn btn-primary";
    if (this.state.isEditor) {
      baseClassForEditor += " active";
    }

    let baseClassForCode = "btn btn-primary";
    if (!this.state.isEditor) {
      baseClassForCode += " active";
    }

    return (
      <div>
        <div className="clearfix">
          <i
            className="float-right fas fa-times dismiss-edit"
            onClick={this.props.manualEditModeOff}
          ></i>
        </div>
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
                <input
                  list="fileSelect"
                  id="fieldsName"
                  value={this.props.element.Name}
                  className="form-control"
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementName.bind(this)}
                />
                <span className="tooltiptext tooltiptext-bottom">
                  Control name, you can put your custom name or select from the
                  list. used in form submission
                </span>

                <datalist id="fileSelect">
                  {Object.keys(this.fieldsName).map((k, i) => {
                    return (
                      <option value={this.fieldsName[k].name} key={i}></option>
                    );
                  })}
                </datalist>
              </div>
            </div>
          </div>
        )}

        {this.props.element.hasOwnProperty("file_path") && (
          <div className="form-group">
            <label className="control-label" htmlFor="fileSelect">
              Choose file
            </label>
            <select
              id="fileSelect"
              className="form-control"
              defaultValue={this.props.element.file_path}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "file_path", "value")}
            >
              {this_files.map((file) => {
                const this_key = `file_${file.id}`;
                return (
                  <option value={file.id} key={this_key}>
                    {file.file_name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        {this.props.element.hasOwnProperty("href") && (
          <div className="form-group">
            <TextAreaAutosize
              type="text"
              className="form-control"
              defaultValue={this.props.element.href}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "href", "value")}
            />
          </div>
        )}
        {this.props.element.hasOwnProperty("src") && (
          <div>
            <div className="form-group">
              <label className="control-label" htmlFor="srcInput">
                Link to
              </label>
              <input
                id="srcInput"
                type="text"
                className="form-control"
                defaultValue={this.props.element.src}
                onBlur={this.updateElement.bind(this)}
                onChange={this.editElementProp.bind(this, "src", "value")}
              />
            </div>
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  id="do-center"
                  className="custom-control-input"
                  type="checkbox"
                  checked={this_checked_center}
                  value={true}
                  onChange={this.editElementProp.bind(
                    this,
                    "center",
                    "checked"
                  )}
                />
                <label className="custom-control-label" htmlFor="do-center">
                  Center?
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementWidth">
                  Width
                </label>
                <input
                  id="elementWidth"
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.width}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, "width", "value")}
                />
              </div>
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementHeight">
                  Height
                </label>
                <input
                  id="elementHeight"
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.height}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, "height", "value")}
                />
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
                  onChange={this.editElementProp.bind(this, "Label", "value")}
                />
                <span className="tooltiptext tooltiptext-bottom">
                  A static label text which displays along with your field
                </span>
              </div>
            </div>
          </div>
        )}

        {(this.props.element.Type === 4 || this.props.element.Type === 7) && (
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6">
                <label className="control-label" htmlFor="elementWidth">
                  Format
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    this.props.element.Type === 4
                      ? "e.g. dd/MM/yyyy"
                      : "e.g. hh:mm:ss"
                  }
                  defaultValue={this.props.element.TypeDetail}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(
                    this,
                    "TypeDetail",
                    "value"
                  )}
                />
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
                checked={this_DefaultValue}
                onChange={this.editElementProp.bind(
                  this,
                  "DefaultValue",
                  "checked"
                )}
              />
              <label className="custom-control-label" htmlFor="is-defaultvalue">
                Default Value
              </label>
            </div>
          </div>
        )}

        {this.props.element.Type === 30 && (
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6">
                <label className="control-label" htmlFor="defaultValue">
                  Format
                </label>
                <select
                  id="defaultValue"
                  className="form-control"
                  onBlur={this.updateElement.bind(this)}
                  defaultValue={this.props.element.TypeDetail}
                  onChange={this.editElementForFormat.bind(
                    this,
                    "TypeDetail",
                    "value"
                  )}
                >
                  {this.formats.map((k, i) => {
                    return (
                      <option value={k} key={i}>
                        {k}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-sm-5">
               
                <div
                  className="btn-group btn-group-toggle"
                  data-toggle="buttons"
                  style={{marginTop:28}}
                >
                  <label className={baseClassForEditor}>
                    <input
                      type="checkbox"
                      name="options"
                      checked={this.state.isEditor}
                      value={false}
                      onChange={this.handleButtonChange.bind(this, "editor")}
                    />{" "}
                    Editor
                  </label>
                  <label className={baseClassForCode}>
                    <input
                      type="checkbox"
                      name="options"
                      checked={!this.state.isEditor}
                      value={false}
                      onChange={this.handleButtonChange.bind(this, "code")}
                    />{" "}
                    Code
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.props.element.Type === 5 && (
          <div className="form-group">
            <div className="row">
              <div className="col-sm-12 tooltip">
                <label className="control-label" htmlFor="defaultValue">
                  Pick List {" "} <span className="badge badge-danger">Required</span>
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
                        <option value={store.state.pickLists[obj].Key} key={i}>
                          {store.state.pickLists[obj].Value}
                        </option>
                      );
                    })}
                </select>
                <span className="tooltiptext tooltiptext-bottom">
                  An auto-populated list from the server. select list values
                  will be filled according to the selected Pick List.
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
                  value={this.props.element.DefaultValue}
                  id="defaultValue"
                  className="form-control"
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(
                    this,
                    "DefaultValue",
                    "value"
                  )}
                >
                  <option></option>
                  {Object.keys(JSON.parse(this.props.element.TypeDetail)).map(
                    (k, i) => {
                      return (
                        <option value={k} key={i}>
                          {k}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
            </div>
          </div>
        )}
        {
          <div>
            {this.props.element.element !== "Action" &&
              this.props.element.element !== "FieldGroups" &&
              this.props.element.element !== "RadioButtons" &&
              this.props.element.element !== "Checkboxes" &&
              this.props.element.element !== "Signature" &&
              this.props.element.element !== "StaticText" && (
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-12 tooltip">
                      <label className="control-label" htmlFor="elementWidth">
                        Default Value
                      </label>
                      <textarea
                        rows="3"
                        className="form-control"
                        defaultValue={this.props.element.DefaultValue}
                        onBlur={this.updateElement.bind(this)}
                        onChange={this.editElementProp.bind(
                          this,
                          "DefaultValue",
                          "value"
                        )}
                      />
                      <span className="tooltiptext tooltiptext-bottom">
                        The default value of the control, if user is not put any
                        value this value will be used
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {this.props.element.element === "StaticText" && (
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-12 tooltip">
                    <label>Default Value</label>
                    {this.state.isEditor && (
                      <Editor
                        defaultEditorState={editorState}
                        onBlur={this.updateElement.bind(this)}
                        onEditorStateChange={this.onEditorStateChange.bind(
                          this,
                          0,
                          "DefaultValue"
                        )}
                        stripPastedStyles={true}
                      />
                    )}
                   {!this.state.isEditor && (<div>
                    <label className="control-label" htmlFor="elementWidth">
                      {this.state.element.TypeDetail} Output
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
                    <span className="tooltiptext tooltiptext-bottom">
                      The output code genrated.
                    </span>
                    </div>)}
                  </div>
                </div>
              </div>
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
                      className="form-control"
                      defaultValue={this.props.element.ControlWidthRatio}
                      onBlur={this.updateElement.bind(this)}
                      onChange={this.editElementProp.bind(
                        this,
                        "ControlWidthRatio",
                        "value"
                      )}
                    />
                    <span className="tooltiptext tooltiptext-bottom">
                      The ratio of the horizontal width of the control. 1 for
                      full width or 0.5 for half, etc.
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
            <div className="custom-control custom-checkbox">
              <input
                id="is-required"
                className="custom-control-input"
                type="checkbox"
                checked={this_Mandatory}
                value={false}
                onChange={this.editElementProp.bind(
                  this,
                  "Mandatory",
                  "checked"
                )}
              />
              <label className="custom-control-label" htmlFor="is-required">
                Mandatory
              </label>
            </div>

            <div className="custom-control custom-checkbox">
              <input
                id="is-Visible"
                className="custom-control-input"
                type="checkbox"
                checked={this_Visible}
                value={true}
                onChange={this.editElementProp.bind(this, "Visible", "checked")}
              />
              <label className="custom-control-label" htmlFor="is-Visible">
                Visible
              </label>
            </div>

            <div className="custom-control custom-checkbox">
              <input
                id="is-ReadOnly"
                className="custom-control-input"
                type="checkbox"
                checked={this_read_only}
                value={false}
                onChange={this.editElementProp.bind(
                  this,
                  "ReadOnly",
                  "checked"
                )}
              />
              <label className="custom-control-label" htmlFor="is-ReadOnly">
                Read Only
              </label>
            </div>
          </div>
        )}

        {this.props.element.showDescription && (
          <div className="form-group">
            <label className="control-label" htmlFor="questionDescription">
              Description
            </label>
            <TextAreaAutosize
              type="text"
              className="form-control"
              id="questionDescription"
              defaultValue={this.props.element.description}
              onBlur={this.updateElement.bind(this)}
              onChange={this.editElementProp.bind(this, "description", "value")}
            />
          </div>
        )}

        {this.props.element.Type === 12 && (
          <DynamicOptionList
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
        {this.props.element.hasOwnProperty("ConditionalFlow") &&
          this.props.element.Name !== "StateFlow" && (
            <>
              <hr />
              <CondtionalFlowList
                conditionalFlowMode={true}
                parent={this}
                conditionalFlow={this.props.element.ConditionalFlow}
                onConditionalFlowChange={this.editElementProp}
              ></CondtionalFlowList>
            </>
          )}
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
