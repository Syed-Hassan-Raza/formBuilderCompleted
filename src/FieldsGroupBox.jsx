import React, { useState } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";
import FormElements from './form-elements';
import ID from './UUID';

export const Dustbin = ({ title, props }) => {
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [childs, setChilds] = useState([]);

  const [{ isOver, isOverCurrent }, drop] = useDrop({
    
    accept: ItemTypes.CARD,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
      //del(item);
      let newState = childs.concat([item.data]);
      setChilds(newState);
      //store.dispatch('create', this.create(item));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const getElement = (item, index) => {
    //alert(item.key)
    const FormElement = FormElements[item.key];
    //return <FormElement id={item.id} seq={Math.random()} index={index} moveCard={moveCard} insertCard={insertCard} mutable={false} parent={this.props.parent} editModeOn={() => {}} isDraggable={true} key={item.id} sortData={item.id} data={item} _onDestroy={_onDestroy} />;
    return <FormElement id={item.id} seq={Math.random()} index={index} moveCard={moveCard} insertCard={insertCard} mutable={false} parent={drop} editModeOn={(e, data) => {props.editModeOn(e, data)}} isDraggable={true} key={item.id} sortData={item.id} data={item} _onDestroy={_onDestroy} />;
  }

  const moveCard = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragCard = data[dragIndex];
    this.saveData(dragCard, dragIndex, hoverIndex);
  }

  const insertCard = (item, hoverIndex) => {
    const { data } = this.state;
    data.splice(hoverIndex, 0, item);
    this.saveData(item, hoverIndex, hoverIndex);
  }

  const _onDestroy= (item) => {
    store.dispatch('delete', item);
  }

  const text = title ? "greedy" : "not greedy";
  let backgroundColor = "rgba(0, 0, 0, .5)";
  if (isOverCurrent || (isOver && title)) {
    backgroundColor = "darkgreen";
  }
  
  return (
    <div>
      <div className="card">
        <div className="card-header">Fields Group</div>
        <div className="card-body" ref={drop}>
          {isOver ? <h6>Drop Here</h6> : null}
          {childs.map((item, index) => getElement(item, index))}
        </div>
      </div>
      <br />
    </div>
  );
};