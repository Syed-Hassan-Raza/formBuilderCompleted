/**
  * <ToolbarItem />
  */

import React from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import ID from './UUID';
import ReactTooltip from "react-tooltip";

const cardSource = {
  beginDrag(props) {
    return {
      id: ID.uuid(),
      index: -1,
      data: props.data,    
      onCreate: props.onCreate,
      toolbarItem: true
    };
  },
};

class ToolbarItem extends React.Component {
  
  render() {
    const { connectDragSource, data, onClick } = this.props;
    if (!connectDragSource) return null;
    return (
      connectDragSource(
        <li onClick={onClick}
        data-place="right"
        data-tip={data.tip}><i className={data.icon}></i>{data.name} <ReactTooltip /> </li>,
      )
    );
  }
}

export default DragSource(ItemTypes.CARD, cardSource, connect => ({
  connectDragSource: connect.dragSource(),
}))(ToolbarItem);
