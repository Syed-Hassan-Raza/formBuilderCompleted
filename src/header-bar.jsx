/**
  * <HeaderBar />
  */

import React from 'react';

export default class HeaderBar extends React.Component {

  deleteConfirm(e){
    if (confirm('Are you sure you want to delete this?')) {
      $("#"+this.props.data.id).addClass("blink-text");
      setTimeout(() => this.props.onDestroy(this.props.data),300);
    }
  }

  render() {
    return (
      <div className="toolbar-header">
        <span className="badge badge-secondary">{this.props.data.text}</span>
        <div className="toolbar-header-buttons">
          { this.props.data.element !== 'LineBreak' &&
            <div className="btn is-isolated btn-school" style={{padding: '.375rem .25rem'}} onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}><i className="is-isolated fas fa-edit" title="Edit control"></i></div>
          }
          <div className="btn is-isolated btn-school" style={{padding: '.375rem .25rem'}} onClick={this.deleteConfirm.bind(this)}><i className="is-isolated fas fa-trash" title="Remove control"></i></div>
        </div>
      </div>
    );
  }
}
