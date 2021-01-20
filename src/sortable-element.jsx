import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget,useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';
import store from "./stores/store";

const style = {
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
  }
};

const cardTarget = {
  
  hover(props, monitor, component) {
    // debugger
    // const item = monitor.getItem();
    // const dragIndex = item.index;
    // const hoverIndex = props.index;
    
    // // Don't replace items with themselves
    // if (dragIndex === hoverIndex) {
    //   return;
    // } 
    // if (dragIndex === -1) {
    //   item.index = hoverIndex;
    //   props.insertCard(item.onCreate(item.data), hoverIndex);
    // }

    // // Determine rectangle on screen
    // const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // // Get vertical middle
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // // Determine mouse position
    // const clientOffset = monitor.getClientOffset();

    // // Get pixels to the top
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // // Only perform the move when the mouse has crossed half of the items height
    // // When dragging downwards, only move when the cursor is below 50%
    // // When dragging upwards, only move when the cursor is above 50%

    // // Dragging downwards
    // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //   return;
    // }

    // // Dragging upwards
    // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //   return;
    // }

    // // Time to actually perform the action
    //props.moveCard(dragIndex, hoverIndex);

    // // Note: we're mutating the monitor item here!
    // // Generally it's better to avoid mutations,
    // // but it's good here for the sake of performance
    // // to avoid expensive index searches.
    //item.index = hoverIndex;

  },
  
  drop(props, monitor, component) {

    if (monitor.didDrop()) {
      return
    }

    const item = monitor.getItem();
    const dragIndex = item.index;
    const hoverIndex = props.index;
    //Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    } 
    else if (dragIndex === -1) {
      item.index = hoverIndex;
      props.insertCard(item.onCreate(item.data), hoverIndex);
      return;
    }

    if(!props.data){return}

    store.dispatch("moveElement", {
      dragId: item.id, 
      hoverId: props.data.id, 
      elementType: props.data.element
    });
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    //item.index = hoverIndex;
  }
}

// eslint-disable-next-line no-unused-vars
export default function (ComposedComponent) {
  const hrStyle= {  
    border: 0,
    borderBottom: '2px dashed #ddd',
    background: 'blue'
  }

  class Card extends Component {
    static propTypes = {
      connectDragSource: PropTypes.func,
      connectDropTarget: PropTypes.func,
      index: PropTypes.number.isRequired,
      isDragging: PropTypes.bool,
      id: PropTypes.any.isRequired,
      // text: PropTypes.string.isRequired,
      isOver: PropTypes.bool,
      canDrop: PropTypes.bool,
      moveCard: PropTypes.func.isRequired,
      seq: PropTypes.number,
    }

    static defaultProps = {
      seq: -1,
    };
    constructor(props){
      super(props);
  }


  
    render() {
      const {
        isDragging,
        connectDragSource,
        connectDropTarget,
        isOver,canDrop,
      } = this.props;
      const opacity = isDragging ? 0.4 : 1;
      let hrShow=isOver && canDrop;

     // let blink=hrShow?"blink-text":"";

      return connectDragSource(
        connectDropTarget(
        
        <div style={{width: (this.props.id == 'form-place-holder' ? 1 : this.props.data.ControlWidthRatio || 1) * 100 + "%", margin: '10px 0px',}}>
         {hrShow && (<hr id="hrSeprater"  style={hrStyle}/>)}
          <ComposedComponent   {...this.props} style={{ ...style,opacity }}></ComposedComponent>
          </div>),
      );
    }
  }


  const x = DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver:monitor.isOver(),
    canDrop:monitor.canDrop(),
  }))(Card);
  return DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => (
    {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
  ))(x);
  
}