import React, { useState } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";
import FormElements from './form-elements';
import ID from './UUID';
import { SelectionState } from "draft-js";
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import store from './stores/store';
const style = {

  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
};
const fieldsGroupTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem()
    if (!item.onCreate)
      return false;

    return true;
  },

  hover(props, monitor, component) {
    const clientOffset = monitor.getClientOffset()
    const componentRect = findDOMNode(component).getBoundingClientRect()
    const isOnlyThisOne = monitor.isOver({ shallow: true })
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {

    if (monitor.didDrop()) {
      return
    }

    let item = monitor.getItem();
    store.dispatch('create', { parentId: component.state.id, item: item.onCreate(item.data) });
    return { moved: true }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class FieldsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      components: []
    }

    store.subscribe(state => {
      let data = this.findData(state.data.FieldGroups, this.props.id);
      if (data && (data.Fields || data.FieldGroups)) {
        this.setState({ components: [].concat(data.Fields, data.FieldGroups) });
      }
    });
  }

  findData(data, id) {
    for (let item of data) {
      if (item.id == id)
        return item;

      if (item.FieldGroups) {
        if (item.FieldGroups.length <= 0)
          continue;

        let result = this.findData(item.FieldGroups, id);
        if (result)
          return result;
      }
    }
  }

  componentDidMount() {
    let data = this.findData(store.state.data.FieldGroups, this.props.id);
    if (data && (data.Fields || data.FieldGroups)) {
      this.setState({ components: [].concat(data.Fields, data.FieldGroups) });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOver && this.props.isOver) {
      // You can use this as enter handler
    }

    if (prevProps.isOver && !this.props.isOver) {
      // You can use this as leave handler
    }

    if (prevProps.isOverCurrent && !this.props.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  getElement(item, index) {
    const FormElement = FormElements[item.element];
    //return <FormElement id={item.id} seq={Math.random()} index={index} moveCard={moveCard} insertCard={insertCard} mutable={false} parent={this.props.parent} editModeOn={() => {}} isDraggable={true} key={item.id} sortData={item.id} data={item} _onDestroy={_onDestroy} />;
    return <FormElement id={item.id} seq={Math.random()} index={index} moveCard={this.moveCard} insertCard={this.insertCard} mutable={false} parent={this.props.parent} editModeOn={this.props.editModeOn} isDraggable={true} key={item.id} sortData={item.id} data={item} _onDestroy={this.props._onDestroy} />;
  }

  moveCard(dragIndex, hoverIndex) {
    const { data } = this.state;
    const dragCard = data[dragIndex];
    this.saveData(dragCard, dragIndex, hoverIndex);
  }

  insertCard(item, hoverIndex) {
    const { data } = this.state;
    data.splice(hoverIndex, 0, item);
    this.saveData(item, hoverIndex, hoverIndex);
  }

  _onDestroy(item) {
    store.dispatch('delete', item);
  }

  render() {
    const { position } = this.props
    const { isOver, canDrop, connectDropTarget, components } = this.props;
    return connectDropTarget(
      <div>
        <div className="card">
          <div className="card-header">{this.props.data.Label}</div>
          <div className="card-body" style={isOver ? style : null}>
            {/* {isOver ? <h6>Drop Here</h6> : null} */}
            {this.state.components.map((item, index) => this.getElement(item, index))}
          </div>
        </div>
      </div>
    );
  }
};

export default DropTarget(ItemTypes.CARD, fieldsGroupTarget, collect)(FieldsGroup)