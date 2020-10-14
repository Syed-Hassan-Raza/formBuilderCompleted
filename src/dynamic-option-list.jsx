import React from "react";
import ID from "./UUID";

export default class DynamicOptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    };
  }

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
  }

  editOption(option_index, e) {
    const this_element = this.state.element;
    let _typeDetail = JSON.parse(this.state.element.TypeDetail);
    let val = e.target.value;

    _typeDetail[option_index] = val;

    this_element.TypeDetail = JSON.stringify(_typeDetail);
    this.setState({
      element: this_element,
      dirty: true,
    });
  }

  editValue(option_index, e) {
    const this_element = this.state.element;
    const val =
      e.target.value === ""
        ? this._setValue(this_element.TypeDetail[option_index].text)
        : e.target.value;
    this_element.TypeDetail[option_index].value = val;
    this.setState({
      element: this_element,
      dirty: true,
    });
  }

  // eslint-disable-next-line no-unused-vars
  editOptionCorrect(option_index, e) {
    const this_element = this.state.element;
    if (this_element.TypeDetail[option_index].hasOwnProperty("correct")) {
      delete this_element.TypeDetail[option_index].correct;
    } else {
      this_element.TypeDetail[option_index].correct = true;
    }
    this.setState({ element: this_element });
    this.props.updateElement.call(this.props.preview, this_element);
  }

  updateOption(e) {
      const this_element = this.state.element;
      const _typeDetail = [];
      let obj = {};
      Object.assign(_typeDetail, JSON.parse(this.state.element.TypeDetail));
      this_element.TypeDetail = null;

      let found = this.found(_typeDetail, e.target.value);
      if (found) {
        alert("Values should be unique");
      }

      Object.keys(_typeDetail).map((option, index) => {
        let val = _typeDetail[option];
        if (val) {
          obj[val] = val;
        } else {
          let rendomValue = Math.random().toString(36).substring(7);
          obj[rendomValue] = "";
        }
      });

      this_element.TypeDetail = JSON.stringify(obj);

      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({ dirty: false });
      }
    
  }
  found(obj, val) {
    let found = false;
    const propertyNames = Object.keys(obj);

    for (var i = 0; i < propertyNames.length; i++) {
      if (propertyNames[i] === val) {
        found = true;
        break;
      }
    }
    return found;
  }
  addOption() {
    const this_element = this.state.element;
    const _typeDetail = JSON.parse(this.state.element.TypeDetail);

    let rendomValue = Math.random().toString(36).substring(7);
    _typeDetail[rendomValue] = "";
    this_element.TypeDetail = JSON.stringify(_typeDetail);
    this.props.updateElement.call(this.props.preview, this_element);
    console.log(this_element);
  }

  removeOption(proprty) {
    const this_element = this.state.element;
    const _typeDetail = JSON.parse(this.state.element.TypeDetail);
    //this_element.TypeDetail.splice(index, 1);
    delete _typeDetail[proprty];
    this_element.TypeDetail = JSON.stringify(_typeDetail);
    this.props.updateElement.call(this.props.preview, this_element);
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }
    let obj = JSON.parse(this.props.element.TypeDetail);
    return (
      <div className="dynamic-option-list">
        <ul>
          <li>
            <div className="row">
              <div className="col-sm-6">
                <b>Options</b>
              </div>
              {this.props.canHaveOptionValue && (
                <div className="col-sm-2">
                  <b>Value</b>
                </div>
              )}
              {this.props.canHaveOptionValue &&
                this.props.canHaveOptionCorrect && (
                  <div className="col-sm-4">
                    <b>Correct</b>
                  </div>
                )}
            </div>
          </li>
          {Object.keys(obj).map((option, index) => {
            const this_key = `edit_${index}`;
            // obj[option] !== this._setValue(obj[option]) ? obj[option] : "";
            return (
              <li className="clearfix" key={index}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      tabIndex={index}
                      className="form-control"
                      style={{ width: "100%" }}
                      type="text"
                      name={`text_${obj[option]}`}
                      placeholder="Option text"
                      value={obj[option]}
                      onBlur={this.updateOption.bind(this)}
                      onChange={this.editOption.bind(this, option)}
                    />
                  </div>

                  {/* {this.props.canHaveOptionValue && (
                    <div className="col-sm-2">
                      <input
                        className="form-control"
                        type="text"
                        name={`value_${index}`}
                        value={val}
                        onChange={this.editValue.bind(this, index)}
                      />
                    </div>
                  )}
                  {this.props.canHaveOptionValue &&
                    this.props.canHaveOptionCorrect && (
                      <div className="col-sm-1">
                        <input
                          className="form-control"
                          type="checkbox"
                          value="1"
                          onChange={this.editOptionCorrect.bind(this, index)}
                          checked={option.hasOwnProperty("correct")}
                        />
                      </div>
                    )} */}

                  <div className="col-sm-3">
                    <div className="dynamic-options-actions-buttons">
                      <button
                        onClick={this.addOption.bind(this)}
                        className="btn btn-success"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                      {obj && (
                        <button
                          onClick={this.removeOption.bind(this, option)}
                          className="btn btn-danger"
                        >
                          <i className="fas fa-minus-circle"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
