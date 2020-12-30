import React from "react";
import PropTypes from "prop-types";

const PLACE_HOLDER = "form-place-holder";

export default class PlaceHolder extends React.Component {
  render() {
    return (
      this.props.show && (
        <label style={{border: '2px dashed #0eb923', display: 'block', marginTop: '10px', padding: '10px 0px', width: '100%', textAlign: 'center'}}>{this.props.text}</label>
      )
    );
  }
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
};

PlaceHolder.defaultProps = {
  text: "You can drop new item here",
  show: false,
};
