import React, { useState } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";
import FormElements from './form-elements';
import ID from './UUID';
import { SelectionState } from "draft-js";
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import store from './stores/store';

const fieldsGroupTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    const item = monitor.getItem()
    return true;
    //return canMakeChessMove(item.fromPosition, props.position)
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can use componentDidUpdate() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset()
    const componentRect = findDOMNode(component).getBoundingClientRect()

    // You can check whether we're over a nested drop target
    const isOnlyThisOne = monitor.isOver({ shallow: true })

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop()
  },

  drop(props, monitor, component) {

    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return
    }
    
    let item = monitor.getItem();
    store.dispatch('createChild', { parentId: component.state.id, item: item.onCreate(item.data) });
    // Obtain the dragged item
    //const item = monitor.getItem()
    //props.onDrop(item)
    //store.dispatch('create', this.create(item));
    // You can do something with it
    //ChessActions.movePiece(item.fromPosition, props.position)

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true }
  }
}

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class Dustbin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id,
      components: []
    }
    //this.onDrop = this.onDrop.bind(this);
    store.subscribe(state => { 
      //let c = state.data.find(i => i.id == this.props.id);
      let c = this.findData(state.data, this.props.id);
      if (c && c.childs) {
        this.setState({components: c.childs });
      }
      //console.log(c)
      //console.log(this.props.id)
      //let cc = this.state.components.concat(c.childs);
      //this.setState({components: this.state.components.concat(c.childs) });
      
      
    });
  }

  findData(data, id) {
    for (let item of data) {
      if (item.id == id)
        return item;
      
      this.findData(data, id);
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

  // const [hasDropped, setHasDropped] = useState(false);
  // const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  // const [childs, setChilds] = useState([]);

  // const [{ isOver, isOverCurrent }, drop] = useDrop({
    
  //   accept: ItemTypes.CARD,
  //   drop(item, monitor) {
  //     const didDrop = monitor.didDrop();
  //     if (didDrop) {
  //       return;
  //     }
  //     setHasDropped(true);
  //     setHasDroppedOnChild(didDrop);
  //     //del(item);
  //     let components = components.concat([item.data]);
  //     setChilds(components);
  //     //store.dispatch('create', this.create(item));
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //     isOverCurrent: monitor.isOver({ shallow: true }),
  //   }),
  // });

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

  _onDestroy (item) {
    store.dispatch('delete', item);
  }

  render() {
    //Your component receives its own props as usual
    const { position } = this.props
    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const { isOver, canDrop, connectDropTarget, components } = this.props;

    return connectDropTarget(
      <div>
        <div className="card">
          <div className="card-header">{this.props.data.Label}</div>
          <div className="card-body">
            {/* {isOver ? <h6>Drop Here</h6> : null} */}
            {this.state.components.map((item, index) => this.getElement(item, index))}
          </div>
        </div>
        <br />
      </div>
    );
  }
};


export default DropTarget(ItemTypes.CARD, fieldsGroupTarget, collect)(Dustbin)