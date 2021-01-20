import React, { useState } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";
import ID from "./UUID";
import { SelectionState } from "draft-js";
import { DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";
import store from "./stores/store";
import getElementName from "./element-mapper";

const style = {};
const fieldsGroupTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    if (!item.onCreate) return false;

    return true;
  },

  hover(props, monitor, component) {
    const item = monitor.getItem();
     const dragIndex = item.index
     if (dragIndex === -1) {
    $( "hr" ).css("display", "none");
     }
    const clientOffset = monitor.getClientOffset();
    const componentRect = findDOMNode(component).getBoundingClientRect();
    const isOnlyThisOne = monitor.isOver({ shallow: true });
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    let item = monitor.getItem();

    const dragIndex = item.index;
    const hoverIndex = props.index;

    store.dispatch("create", {
      parentId: component.state.id,
      item: item.onCreate(item.data),
    });
    return { moved: true };
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    item: monitor.getItem(),
  };
}

class FieldsGroup extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      components: [],
    };

    store.subscribe((state) => {
      let data = this.findData(state.data.FieldGroups, this.props.id);
      if (data && (data.Fields || data.FieldGroups)) {
        if (this.isMounted) {
          let fieldGroups = data.FieldGroups
            ? data.FieldGroups.filter((x) => !!x)
            : [];

          fieldGroups.forEach((item) => {
            item.Type = "FieldGroups";
          });

          this.setState({ components: [].concat(data.Fields, fieldGroups) });
        }
      }
    });
  }

  findData(data, id) {
    for (let item of data) {
      if (item.id == id) return item;

      if (item.FieldGroups) {
        if (item.FieldGroups.length <= 0) continue;

        let result = this.findData(item.FieldGroups, id);
        if (result) return result;
      }
    }
  }

  componentDidMount() {
    this.isMounted = true;
    let data = this.findData(store.state.data.FieldGroups, this.props.id);
    if (data && (data.Fields || data.FieldGroups)) {
      let fieldGroups = data.FieldGroups
        ? data.FieldGroups.filter((x) => !!x)
        : [];

      fieldGroups.forEach((item) => {
        item.Type = "FieldGroups";
      });

      this.setState({ components: [].concat(data.Fields, fieldGroups) });
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

  componentWillUnmount() {
    this.isMounted = false;
  }

  getElement(item, index) {
    const elementName = getElementName(item.Type);
    item.element = elementName;
    const SortableFormElement = this.props.sortableFormElements[elementName];
    if (SortableFormElement) {
      return (
        <SortableFormElement
          id={item.id}
          seq={Math.random()}
          index={index}
          moveCard={this.moveCard}
          insertCard={this.insertCard}
          mutable={false}
          parent={this.props.parent}
          editModeOn={this.props.editModeOn}
          isDraggable={true}
          key={item.id}
          sortData={item.id}
          data={item}
          _onDestroy={this.props._onDestroy}
          sortableFormElements={this.props.sortableFormElements}
        />
      );
    }

    //return <FormElement id={item.id} seq={Math.random()} index={index} moveCard={moveCard} insertCard={insertCard} mutable={false} parent={this.props.parent} editModeOn={() => {}} isDraggable={true} key={item.id} sortData={item.id} data={item} _onDestroy={_onDestroy} />;
  }

  moveCard(dragIndex, hoverIndex) {
    const { data } = this.state;
    const dragCard = data[dragIndex];
    this.saveData(dragCard, dragIndex, hoverIndex);
  }

  insertCard(item, hoverIndex) {
    // const { data } = this.state;
    // data.splice(hoverIndex, 0, item);
    // this.saveData(item, hoverIndex, hoverIndex);
    // debugger
    // store.dispatch("create", {
    //   parentId: this.state.id,
    //   item: item,
    // });
  }

  _onDestroy(item) {
    store.dispatch("delete", item);
  }

  render() {
    const { position } = this.props;
    const { isOver, canDrop, connectDropTarget, components, item } = this.props;
    return connectDropTarget(
        <div>

          <fieldset className="border p-3" style={{height: '100%', display: 'block'}}>
            <legend className="w-auto px-2">{this.props.data.Label}</legend>
            <div
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {this.state.components.map((item, index) => this.getElement(item, index))}

            </div>
            {item && item.toolbarItem ? (
          <label
            style={{
              border: "2px dashed #0eb923",
              display: "block",
              marginTop: "10px",
              padding: "10px 0px",
              width: "100%",
              textAlign: "center",
            }}
          >
            Drop Zone of {this.props.data.Label}
          </label>
        ) : null}
          </fieldset>
        </div>

    );
  }
}

export default DropTarget(
  ItemTypes.CARD,
  fieldsGroupTarget,
  collect
)( FieldsGroup);
