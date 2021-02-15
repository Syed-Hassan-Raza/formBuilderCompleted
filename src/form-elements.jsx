// eslint-disable-next-line max-classes-per-file
import React from "react";
import Select from "react-select";
import xss from "xss";
// import moment from 'moment';
import ReactBootstrapSlider from "react-bootstrap-slider";
import StarRating from "./star-rating";
import HeaderBar from "./header-bar";
import FieldsGroup from "./FieldsGroupBox";
import Editor  from "./CommonMethods/Editor";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import htmlToDraft from "html-to-draftjs";

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
      <div id={this.props.data.id} className={baseClasses} >
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
    let baseClasses = "SortableItem rfb-FieldsGroup fields-group";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
    this.state = { value: ''};
    this.handleValueChange = this.handleValueChange.bind(this);
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
    let node = this.inputField.current;
    if(node){ node.value=this.props.data.DefaultValue?this.props.data.DefaultValue:null}
   
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
      <div id={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props} ref={this.inputField} defaultValue={this.props.data.DefaultValue}
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
    this.state = { value: props.data.DefaultValue||undefined };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    console.log("changed ")
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "number";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    let node = this.inputField.current;
    if(node){ node.value=this.props.data.DefaultValue?this.props.data.DefaultValue:null}
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
      <div id={this.props.data.id} key={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            ref={this.inputField} defaultValue={this.props.data.DefaultValue}
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
    this.state = { value: props.data.DefaultValue||undefined };
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
    let node = this.inputField.current;
    if(node){ node.value=this.props.data.DefaultValue?this.props.data.DefaultValue:null}
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
      <div id={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            ref={this.inputField} defaultValue={this.props.data.DefaultValue}
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
    return (
      <div id={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <Editor
            style={{ height: "auto",border:"1px solid #e9ecee" }}
            isReadOnly={true}
            element={this.props.data}
          />
        </div>
      </div>
    );
  }
}

import TextAreaAutosize from "react-textarea-autosize";

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: props.data.DefaultValue||undefined };
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.className = "form-control";
    props.name = this.props.data.field_name;
    let node = this.inputField.current;
    if(node){ node.value=this.props.data.DefaultValue?this.props.data.DefaultValue:null}
    if (this.props.ReadOnly) {
      props.disabled = "disabled";
    }

    if (this.props.mutable) {
      //props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div id={this.props.data.id} className={baseClasses} style={FieldsWidth(props.width),{cursor:"move"}}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {"Multi-line Input"}
          </span>
          <textarea
            {...props}
            ref={this.inputField} defaultValue={this.props.data.DefaultValue}
            minRows={2}
            disabled
            style={{cursor:"move",backgroundColor:"white"}}
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
    this.state = { value: props.data.DefaultValue||undefined };
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
    let node = this.inputField.current;
    if(node){ node.value=this.props.data.TypeDetail?this.props.data.TypeDetail:null}

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
      <div id={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <input
            {...props}
            ref={this.inputField} defaultValue={this.props.data.DefaultValue}
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
    this.state = { value: this.props.data.TypeDetail };
  }
  handleChange(value) {
    this.setState({value:value});
  }
  render() {
    const props = {};
    props.width = this.props.data.ControlWidthRatio || 1;
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    debugger
    let node = this.inputField.current;
    if(node){ node.value=this.props.data.TypeDetail?this.props.data.TypeDetail:null}
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
      <div id={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />{" "}
          <span className="label-Mandatory badge badge-info">
            {this.props.data.element}
          </span>
          <div>
            <input
              {...props}
              ref={this.inputField} defaultValue={this.props.data.DefaultValue} 
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
      this.setState({ defaultvalue: props.data.DefaultValue||undefined });
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
      <div id={this.props.data.id} className={baseClasses} >
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


class Checkboxes extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = { value: props.data.DefaultValue };
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
      <div id={this.props.data.id} className={baseClasses} >
        <ComponentHeader {...this.props} />

        <div className="form-group">
          <div className="form-group">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                defaultValue={JSON.parse(this.props.data.DefaultValue ? this.props.data.DefaultValue.toString().toLowerCase() : 'false')}
                checked={JSON.parse(this.props.data.DefaultValue ? this.props.data.DefaultValue.toString().toLowerCase() : 'false')}
                onChange={this.handleValueChange.bind(this)}
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
    //   <div className={baseClasses} >
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
    this.state = { value: props.data.DefaultValue||undefined };
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
      <div id={this.props.data.id} className={baseClasses} >
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
      <div id={this.props.data.id} className={baseClasses} >
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
