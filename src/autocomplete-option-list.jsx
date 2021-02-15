import React from "react";
import ID from "./UUID";

export default class AutoCompleteOptionList extends React.Component {
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
    let val=e.target.value;
    
    const this_element = this.state.element;
    let _typeDetail = JSON.parse(this.state.element.TypeDetail);

    _typeDetail.data[option_index] = val;

    this_element.TypeDetail = JSON.stringify(_typeDetail) ;
    this.setState({
      element: this_element,
      dirty: true,
    });
  }


  updateOption(e) {
      // const this_element = this.state.element;

      // //this_element.TypeDetail = JSON.stringify(obj);

      // if (this.state.dirty) {
      //   this.props.updateElement.call(this.props.preview, this_element);
      //   this.setState({ dirty: false });
      // }
    
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
  addOption(option) {
    // const this_element = this.state.element;
    // const _typeDetail = JSON.parse(this.state.element.TypeDetail);

    // let rendomValue = Math.random().toString(36).substring(7);
    // _typeDetail.data.push('');
    // this_element.TypeDetail = JSON.stringify(_typeDetail);
    // this.props.updateElement.call(this.props.preview, this_element);
    


     const this_element = this.state.element;
     const _typeDetail = JSON.parse(this.state.element.TypeDetail);

    let rendomValue = Math.random().toString(36).substring(7);
    let props = {data:[]};

    Object.keys(_typeDetail.data).map(function (key,i) {
      debugger
      if (_typeDetail.data[i] === option) {
        props.data.push(_typeDetail.data[i]);
        props.data.push("");
      } else {
        props.data.push(_typeDetail.data[i]);
      }
    });

    this_element.TypeDetail = JSON.stringify(props);
    this.props.updateElement.call(this.props.preview, this_element);
  }

  removeOption(index) {
      
    const this_element = this.state.element;
    const _typeDetail = JSON.parse(this.state.element.TypeDetail);
    //this_element.TypeDetail.splice(index, 1);
    _typeDetail.data.splice(index, 1);
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
                <b>Options </b> <font className="text-muted">(Values should be unique)</font> 
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
          {Object.keys(obj.data).map((option, index) => {
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
                      name={`text_${obj.data[index]}`}
                      placeholder="Option text"
                      value={obj.data[index]}
                      onBlur={this.updateOption.bind(this)}
                      onChange={this.editOption.bind(this, index)}
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
                        onClick={this.addOption.bind(this, obj.data[option])}
                        className="btn btn-success"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                      {obj && (
                        <button
                          onClick={this.removeOption.bind(this, index)}
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
