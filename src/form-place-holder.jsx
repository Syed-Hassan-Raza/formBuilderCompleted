import React from "react";
import PropTypes from "prop-types";

const PLACE_HOLDER = "form-place-holder";
const style = {
  border: "2px dashed #0eb923",
  display: "block",
  marginTop: "20px",
  padding: "20px",
  width: "100%",
  height: "70px",
  textAlign: "center",
};
export default class PlaceHolder extends React.Component {
  render() {
    return this.props.show && <div style={style}>
      <label >{this.props.text}</label>;
    </div>
  }
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
};

PlaceHolder.defaultProps = {
  text: "Drag 'n' drop new item here or click on item",
  show: true,
};
