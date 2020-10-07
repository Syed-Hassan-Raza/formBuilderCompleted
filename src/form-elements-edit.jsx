import React from "react";
import TextAreaAutosize from "react-textarea-autosize";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";

import DynamicOptionList from "./dynamic-option-list";
import { get } from "./stores/requests";
import ID from "./UUID";
import store from './stores/store';

const toolbar = {
  options: [],
  inline: {
    inDropdown: false,
    className: undefined,
    options: [],
  },
};

export default class FormElementsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,

      data: this.props.data,
      dirty: false,
    };
    console.log(props)
  }

  toggleRequired() {
    // const this_element = this.state.element;
  }

  editElementProp(elemProperty, targProperty, e) {
    // elemProperty could be content or label
    // targProperty could be value or checked
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

  onEditorStateChange(index, property, editorContent) {
    // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
    const html = draftToHtml(convertToRaw(editorContent.getCurrentContent()))
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .replace(/(?:\r\n|\r|\n)/g, " ");
    const this_element = this.state.element;
    this_element[property] = html;

    this.setState({
      element: this_element,
      dirty: true,
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

  addOptions() {
    const optionsApiUrl = document.getElementById("optionsApiUrl").value;
    if (optionsApiUrl) {
      get(optionsApiUrl).then((data) => {
        this.props.element.options = [];
        const { options } = this.props.element;
        data.forEach((x) => {
          // eslint-disable-next-line no-param-reassign
          x.key = ID.uuid();
          options.push(x);
        });
        const this_element = this.state.element;
        this.setState({
          element: this_element,
          dirty: true,
        });
      });
    }
  }

  render() {
    if (this.state.dirty) {
      this.props.element.dirty = true;
    }

    const this_Mandatory = this.props.element.hasOwnProperty("Mandatory")
      ? this.props.element.Mandatory
      : false;

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

    let editorState;
    if (this.props.element.hasOwnProperty("content")) {
      editorState = this.convertFromHTML(this.props.element.content);
    }
    if (this.props.element.hasOwnProperty("label")) {
      editorState = this.convertFromHTML(this.props.element.label);
    }

    return (
      <div>
        <div className="clearfix">
          <h4 className="float-left">{this.props.element.text}</h4>
          <i
            className="float-right fas fa-times dismiss-edit"
            onClick={this.props.manualEditModeOff}
          ></i>
        </div>
        {this.props.element.hasOwnProperty("content") && (
          <div className="form-group">
            <div className="row">
              <div className="col-md-12">
                <label className="control-label" htmlFor="elementWidth">
                  Display To Text:
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.label}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, "content", "value")}
                />
              </div>
            </div>
          </div>
        )}
        {this.props.element.hasOwnProperty("file_path") && (
          <div className="form-group">
            <label className="control-label" htmlFor="fileSelect">
              Choose file:
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
                Link to:
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
                  Width:
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
                  Height:
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
              <div className="col-md-12">
                <label className="control-label" htmlFor="elementWidth">
                  Display Label:
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.Label}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(this, "Label", "value")}
                />
              </div>
            </div>
          </div>
        )}

        {this.props.element.hasOwnProperty("ReadOnly") && (
          <div className="form-group">
            <br />
            <div className="row">
              <div className="col-sm-3">
                <label className="control-label" htmlFor="elementWidth">
                  Default Value:
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={this.props.element.DefaultValue}
                  onBlur={this.updateElement.bind(this)}
                  onChange={this.editElementProp.bind(
                    this,
                    "DefaultValue",
                    "value"
                  )}
                />
              </div>
              <div className="col-sm-3">
                <label className="control-label">Max Width:</label>
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
              </div>
              <div className="col-sm-3">
                <label className="control-label">Min Width:</label>
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
              </div>
              <div className="col-sm-3">
                <label className="control-label">Control Width Ratio:</label>
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
              </div>
            </div>
            <br />

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

            {/*  this.props.element.hasOwnProperty('readOnly') &&
               <div className="custom-control custom-checkbox">
                <input id="is-read-only" className="custom-control-input" type="checkbox" checked={this_read_only} value={true} onChange={this.editElementProp.bind(this, 'readOnly', 'checked')} />
                <label className="custom-control-label" htmlFor="is-read-only">
                  Read only
                </label>
              </div>
             */}
          </div>
        )}

        {this.props.element.element === "FieldsGroup" && (
          <div className="form-group">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">Fields Group 
                  <button type="button" className="btn btn-primary">
                  Add
                </button></div>
                  <div className="card-body"></div>
                </div>
              </div>
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
       
        { 
        this.props.element.TypeDetail  && (
          
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
      </div>
    );
  }
}
FormElementsEdit.defaultProps = { className: "edit-element-fields" };
