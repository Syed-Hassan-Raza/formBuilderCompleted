// eslint-disable-next-line max-classes-per-file
import React from "react";
import Select from "react-select";
import xss from "xss";
// import moment from 'moment';
import ReactBootstrapSlider from "react-bootstrap-slider";
import StarRating from "./star-rating";
import HeaderBar from "./header-bar";
import FieldsGroup from "./FieldsGroupBox";
import { Editor } from "react-draft-wysiwyg";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';

const FormElements = {};
const myxss = new xss.FilterXSS({
  whiteList: {
    u: [],
    br: [],
    b: [],
    i: [],
    ol: ["style"],
    ul: ["style"],
    li: [],
    p: ["style"],
    sub: [],
    sup: [],
    div: ["style"],
    em: [],
    strong: [],
    span: ["style"],
  },
});

const FieldsWidth = (width) => {
  let widthStyle = {
    float: "left",
    width: width * 100 + "%",
  };
  return widthStyle;
};

const ComponentLabel = (props) => {
  const hasMandatoryLabel =
    props.data.hasOwnProperty("Mandatory") && props.data.Mandatory === true;

  const hasReadOnlyLabel =
    props.data.hasOwnProperty("ReadOnly") && props.data.ReadOnly === true;

  const hasVisibleLabel =
    props.data.hasOwnProperty("Visible") && props.data.Visible === false;

  return (
    <label className={props.className || ""}>
      <span
        dangerouslySetInnerHTML={{ __html: myxss.process(props.data.Label) }}
      />

      {hasVisibleLabel && (
        <>
          <span> </span>
          <i className="far fa-eye-slash"></i>
        </>
      )}

      {hasMandatoryLabel && (
        <>
          <span> </span>
          <span className="label-Mandatory badge badge-danger">Mandatory</span>
        </>
      )}
      {hasReadOnlyLabel && (
        <>
          <span> </span>
          <span className="label-Mandatory badge badge-secondary">
            Read Only
          </span>
        </>
      )}
    </label>
  );
};

const ComponentHeader = (props) => {
  if (props.mutable) {
    return null;
  }
  return (
    <div>
      {props.data.pageBreakBefore && (
        <div className="preview-page-break">Page Break</div>
      )}
      <HeaderBar
        parent={props.parent}
        editModeOn={props.editModeOn}
        data={props.data}
        onDestroy={props._onDestroy}
        onEdit={props.onEdit}
        static={props.data.static}
        Mandatory={props.data.Mandatory}
      />
      <br />
    </div>
  );
};

class Header extends React.Component {
  render() {
    // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <h2
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.Label),
          }}
        />
      </div>
    );
  }
}

class FieldGroups extends React.Component {
  Tree(items) {
    // our base case, if we have no items, render nothing.
    if (!items || !items.length) {
      return null;
    }

    return items.map((item) => (
      <FieldsGroup key={item.name} {...this.props}>
        <div>{item.name}</div>
        {/* And here's the recursion! */}
        <Tree items={item.child} />
      </FieldsGroup>
    ));
  }
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let baseClasses = "SortableItem rfb-item fields-group";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        {<FieldsGroup {...this.props} />}
      </div>
    );
  }
}

class Paragraph extends React.Component {
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />{" "}
        <span className="label-Mandatory badge badge-info">
          {this.props.data.element}
        </span>
        <p
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.Label),
          }}
        />
      </div>
    );
  }
}

class Label extends React.Component {
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />{" "}
        <span className="label-Mandatory badge badge-info">
          {this.props.data.element}
        </span>
        <label
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.Label),
          }}
        />
      </div>
    );
  }
}

class Calculated extends React.Component {
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <label
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.Label),
          }}
        />{" "}
        <span className="label-Mandatory badge badge-info">
          {this.props.data.element}
        </span>
      </div>
    );
  }
}

class Counter extends React.Component {
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <label
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.Label),
          }}
        />{" "}
        <span className="label-Mandatory badge badge-info">
          {this.props.data.element}
        </span>
      </div>
    );
  }
}

class Action extends React.Component {
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <label
          className={classNames}
          dangerouslySetInnerHTML={{
            __html: myxss.process(this.props.data.Label),
          }}
        />{" "}
        <span className="label-Mandatory badge badge-info">
          {this.props.data.element}
        </span>
      </div>
    );
  }
}

class LineBreak extends React.Component {
  render() {
    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <hr />
      </div>
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "", width: props.ControlWidthRatio || 1 };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;

    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            value={this.props.data.DefaultValue || undefined}
            onChange={this.handleValueChange}
          />
        </div>
      </div>
    );
  }
}

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "number";
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            value={this.props.data.DefaultValue || undefined}
            onChange={this.handleValueChange}
          />
        </div>
      </div>
    );
  }
}

class DecimalInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            value={this.props.data.DefaultValue || undefined}
            onChange={this.handleValueChange}
          />
        </div>
      </div>
    );
  }
}

class StaticText extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      element: this.props.data,
    };
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

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;    
    
    let classNames = "static";
    if (this.props.data.bold) {
      classNames += " bold";
    }
    if (this.props.data.italic) {
      classNames += " italic";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }
    let editorState = this.loadEditState();
    return (
      <div className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <Editor
            editorStyle={{ height: "auto" }}
            editorState={editorState}
            toolbarHidden={true}
            stripPastedStyles={true}
          />{" "}
        </div>
      </div>
    );
  }
}

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <textarea
            {...props}
            value={this.props.data.DefaultValue || undefined}
            onChange={this.handleValueChange}
            rows="3"
          />
        </div>
      </div>
    );
  }
}
class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            value={this.props.data.TypeDetail}
            onChange={this.handleValueChange}
          />
        </div>
      </div>
    );
  }
}
class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }
    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }
    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <div>
            <input
              {...props}
              value={this.props.data.TypeDetail || undefined}
              onChange={this.handleValueChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <select {...props}>
            {/* {this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`;
              return (
                <option value={option.value} key={this_key}>
                  {option.text}
                </option>
              );
            })} */}
          </select>
        </div>
      </div>
    );
  }
}

class Assignee extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <select {...props}>
            {/* {this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`;
              return (
                <option value={option.value} key={this_key}>
                  {option.text}
                </option>
              );
            })} */}
          </select>
        </div>
      </div>
    );
  }
}

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.className = "form-control";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <select {...props}>
            {/* {this.props.data.options.map((option) => {
              const this_key = `preview_${option.key}`;
              return (
                <option value={option.value} key={this_key}>
                  {option.text}
                </option>
              );
            })} */}
          </select>
        </div>
      </div>
    );
  }
}

class Signature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue,
    };
    this.inputField = React.createRef();
    this.canvas = React.createRef();
  }

  clear = () => {
    if (this.state.defaultValue) {
      this.setState({ defaultValue: "" });
    } else if (this.canvas.current) {
      this.canvas.current.clear();
    }
  };

  render() {
    const { defaultValue } = this.state;
    let canClear = !!defaultValue;
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "hidden";
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = defaultValue;
      props.ref = this.inputField;
    }
    const pad_props = {};
    // umd requires canvasProps={{ width: 400, height: 150 }}
    if (this.props.mutable) {
      pad_props.defaultValue = defaultValue;
      pad_props.ref = this.canvas;
      canClear = !this.props.ReadOnly;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    let sourceDataURL;
    if (defaultValue && defaultValue.length > 0) {
      sourceDataURL = `data:image/png;base64,${defaultValue}`;
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input {...props} />
        </div>
      </div>
    );
  }
}

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    const { defaultValue, data } = props;
    this.state = { value: this.getDefaultValue(defaultValue, data.options) };
  }

  getDefaultValue(defaultValue, options) {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        const vals = defaultValue.split(",").map((x) => x.trim());
        return options.filter((x) => vals.indexOf(x.value) > -1);
      }
      return options.filter((x) => defaultValue.indexOf(x.value) > -1);
    }
    return [];
  }

  // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };

  handleChange = (e) => {
    this.setState({ value: e });
  };

  render() {
    const options = this.props.data.options.map((option) => {
      option.label = option.text;
      return option;
    });
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.isMulti = true;
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;

    props.options = options;
    if (!this.props.mutable) {
      props.value = options[0].text;
    } // to show a sample of what tags looks like
    if (this.props.mutable) {
      props.isDisabled = this.props.ReadOnly;
      props.value = this.state.value;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <Select {...props} />
        </div>
      </div>
    );
  }
}

class Checkboxes extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "checkbox";
    props.className = "custom-control custom-checkbox";

    if (this.props.mutable) {
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    if (this.props.data.ReadOnly) {
      props.disabled = "disabled";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />

        <div className="form-group">
          <div className="form-group">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                value=""
                checked={this.props.data.DefaultValue}
                onChange={this.handleValueChange}
              />{" "}
              <ComponentLabel {...this.props} />
            </label>
          </div>
        </div>
      </div>
    );

    // let classNames = "custom-control custom-checkbox";
    // if (this.props.data.inline) {
    //   classNames += " option-inline";
    // }

    // let baseClasses = "SortableItem rfb-item";
    // if (this.props.data.pageBreakBefore) {
    //   baseClasses += " alwaysbreak";
    // }

    // return (
    //   <div className={baseClasses} style={FieldsWidth(props.width)}>
    //     <ComponentHeader {...this.props} />
    //     <div className="form-group">
    //       <ComponentLabel className="form-label" {...this.props} />
    //       { Object.keys(obj).map((option,i) => {
    //         const this_key = `preview_${i}`;
    //         const props = {};
    //         props.name = `option_${obj[option]}`;

    //         props.type = "checkbox";
    //         props.value = obj[option];
    //         if (self.props.mutable) {
    //           props.defaultChecked =
    //             self.props.defaultValue !== undefined &&
    //             self.props.defaultValue.indexOf(option) > -1;
    //         }
    //         if (this.props.ReadOnly) {
    //           props.disabled = "disabled";
    //         }
    //         return (
    //           <div className={classNames} key={this_key}>
    //             <input
    //               id={"fid_" + this_key}
    //               className="custom-control-input"
    //               ref={(c) => {
    //                 if (c && self.props.mutable) {
    //                   self.options[`child_ref_${obj[option]}`] = c;
    //                 }
    //               }}
    //               {...props}
    //             />
    //             <label
    //               className="custom-control-label"
    //               htmlFor={"fid_" + this_key}
    //             >
    //               {obj[option]}
    //             </label>
    //           </div>
    //         );
    //       })}
    //    </div>
    //  </div>
    //  );
  }
}

class RadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.options = {};
    this.state = { value: "" };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const self = this;
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;

    let obj = JSON.parse(this.props.data.TypeDetail);
    let classNames = "custom-control custom-radio";
    if (this.props.data.inline) {
      classNames += " option-inline";
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          {Object.keys(obj).map((option, i) => {
            const defaultValue =
              this.props.data.DefaultValue === option ? true : false;

            const this_key = `preview_${i}`;
            const props = {};
            props.width = this.props.data.ControlWidthRatio || 1;
            props.name = self.props.data.field_name;

            props.type = "radio";
            props.value = option.value;
            if (self.props.mutable) {
              props.defaultChecked =
                self.props.defaultValue !== undefined &&
                (self.props.defaultValue.indexOf(option) > -1 ||
                  self.props.defaultValue.indexOf(option) > -1);
            }
            if (this.props.ReadOnly) {
              props.disabled = "disabled";
            }

            return (
              <div className={classNames} key={this_key}>
                <input
                  type="Radiobutton"
                  id={"fid_" + this_key}
                  className="custom-control-input"
                  ref={(c) => {
                    if (c && self.props.mutable) {
                      self.options[`child_ref_${obj[option]}`] = c;
                    }
                  }}
                  {...props}
                  checked={defaultValue}
                  onChange={this.handleValueChange}
                />
                <label
                  className="custom-control-label"
                  htmlFor={"fid_" + this_key}
                >
                  {obj[option]}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

class Image extends React.Component {
  render() {
    const style = this.props.data.center ? { textAlign: "center" } : null;

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div
        className={baseClasses}
        style={FieldsWidth(props.width)}
        style={style}
      >
        {!this.props.mutable && (
          <HeaderBar
            parent={this.props.parent}
            editModeOn={this.props.editModeOn}
            data={this.props.data}
            onDestroy={this.props._onDestroy}
            onEdit={this.props.onEdit}
            Mandatory={this.props.data.Mandatory}
          />
        )}
        {this.props.data.src && (
          <img
            src={this.props.data.src}
            width={this.props.data.width}
            height={this.props.data.height}
          />
        )}
        {!this.props.data.src && <div className="no-image">No Image</div>}
      </div>
    );
  }
}

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.name = this.props.data.field_name;
    props.ratingAmount = 5;

    if (this.props.mutable) {
      props.rating =
        this.props.defaultValue !== undefined
          ? parseFloat(this.props.defaultValue, 10)
          : 0;
      props.editing = true;
      props.disabled = this.props.ReadOnly;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <StarRating {...props} />
        </div>
      </div>
    );
  }
}

class HyperLink extends React.Component {
  render() {
    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <a target="_blank" href={this.props.data.href}>
            {this.props.data.Label}
          </a>
        </div>
      </div>
    );
  }
}

class Download extends React.Component {
  render() {
    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <a
            href={`${this.props.download_path}?id=${this.props.data.file_path}`}
          >
            {this.props.data.Label}
          </a>
        </div>
      </div>
    );
  }
}

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = { img: null };
  }

  displayImage = (e) => {
    const self = this;
    const target = e.target;
    let file;
    let reader;

    if (target.files && target.files.length) {
      file = target.files[0];
      // eslint-disable-next-line no-undef
      reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        self.setState({
          img: reader.result,
        });
      };
    }
  };

  clearImage = () => {
    this.setState({
      img: null,
    });
  };

  render() {
    let baseClasses = "SortableItem rfb-item";
    const name = this.props.data.field_name;
    const fileInputStyle = this.state.img ? { display: "none" } : null;
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }
    let sourceDataURL;
    if (
      this.props.ReadOnly === true &&
      this.props.defaultValue &&
      this.props.defaultValue.length > 0
    ) {
      if (this.props.defaultValue.indexOf(name > -1)) {
        sourceDataURL = this.props.defaultValue;
      } else {
        sourceDataURL = `data:image/png;base64,${this.props.defaultValue}`;
      }
    }
    //console.log("sourceDataURL", sourceDataURL);
    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          {this.props.ReadOnly === true &&
          this.props.defaultValue &&
          this.props.defaultValue.length > 0 ? (
            <div>
              <img src={sourceDataURL} />
            </div>
          ) : (
            <div className="image-upload-container">
              <div style={fileInputStyle}>
                <input
                  name={name}
                  type="file"
                  accept="image/*"
                  capture="camera"
                  className="image-upload"
                  onChange={this.displayImage}
                />
                <div className="image-upload-control">
                  <div className="btn btn-default btn-school">
                    <i className="fas fa-camera"></i> Upload Photo
                  </div>
                  <p>Select an image from your computer or device.</p>
                </div>
              </div>

              {this.state.img && (
                <div>
                  <img
                    src={this.state.img}
                    height="100"
                    className="image-upload-preview"
                  />
                  <br />
                  <div
                    className="btn btn-school btn-image-clear"
                    onClick={this.clearImage}
                  >
                    <i className="fas fa-times"></i> Clear Photo
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

class Range extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      value:
        props.defaultValue !== undefined
          ? parseInt(props.defaultValue, 10)
          : parseInt(props.data.default_value, 10),
    };
  }

  changeValue = (e) => {
    const { target } = e;
    this.setState({
      value: target.value,
    });
  };

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    const name = this.props.data.field_name;

    props.type = "range";
    props.list = `tickmarks_${name}`;
    props.min = this.props.data.min_value;
    props.max = this.props.data.max_value;
    props.step = this.props.data.step;

    props.value = this.state.value;
    props.change = this.changeValue;

    if (this.props.mutable) {
      props.ref = this.inputField;
    }

    const datalist = [];
    for (
      let i = parseInt(props.min_value, 10);
      i <= parseInt(props.max_value, 10);
      i += parseInt(props.step, 10)
    ) {
      datalist.push(i);
    }

    const oneBig = 100 / (datalist.length - 1);

    const _datalist = datalist.map((d, idx) => (
      <option key={`${props.list}_${idx}`}>{d}</option>
    ));

    const visible_marks = datalist.map((d, idx) => {
      const option_props = {};
      let w = oneBig;
      if (idx === 0 || idx === datalist.length - 1) {
        w = oneBig / 2;
      }
      option_props.key = `${props.list}_label_${idx}`;
      option_props.style = { width: `${w}%` };
      if (idx === datalist.length - 1) {
        option_props.style = { width: `${w}%`, textAlign: "right" };
      }
      return <label {...option_props}>{d}</label>;
    });

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <div className="range">
            <div className="clearfix">
              <span className="float-left">{this.props.data.min_label}</span>
              <span className="float-right">{this.props.data.max_label}</span>
            </div>
            <ReactBootstrapSlider {...props} />
          </div>
          <div className="visible_marks">{visible_marks}</div>
          <input name={name} value={this.state.value} type="hidden" />
          <datalist id={props.list}>{_datalist}</datalist>
        </div>
      </div>
    );
  }
}

class Barcode extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "Barcode";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    return (
      <div className={baseClasses} style={FieldsWidth(props.width)}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input {...props} />
        </div>
      </div>
    );
  }
}

FormElements.Header = Header;
FormElements.Paragraph = Paragraph;
FormElements.Label = Label;
FormElements.LineBreak = LineBreak;
FormElements.TextInput = TextInput;
FormElements.NumberInput = NumberInput;
FormElements.TextArea = TextArea;
FormElements.Dropdown = Dropdown;
FormElements.Signature = Signature;
FormElements.Checkboxes = Checkboxes;
FormElements.DatePicker = DatePicker;
FormElements.RadioButtons = RadioButtons;
FormElements.Image = Image;
FormElements.Rating = Rating;
FormElements.Tags = Tags;
FormElements.HyperLink = HyperLink;
FormElements.Download = Download;
FormElements.Camera = Camera;
FormElements.Range = Range;
FormElements.Barcode = Barcode;
FormElements.DecimalInput = DecimalInput;
FormElements.Assignee = Assignee;
FormElements.StaticText = StaticText;
FormElements.Action = Action;
FormElements.Calculated = Calculated;
FormElements.Counter = Counter;
FormElements.Autocomplete = Autocomplete;
FormElements.FieldGroups = FieldGroups;
FormElements.TimePicker = TimePicker;

export default FormElements;
