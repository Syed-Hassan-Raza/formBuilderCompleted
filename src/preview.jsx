/**
 * <Preview />
 */

import React from "react";
import update from "immutability-helper";
import store from "./stores/store";
import FormElementsEdit from "./form-elements-edit";
import SortableFormElements from "./sortable-form-elements";
import getElementName from "./element-mapper";

const { PlaceHolder } = SortableFormElements;

export default class Preview extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    const { onLoad, onPost } = props;
    store.setExternalHandler(onLoad, onPost);

    this.editForm = React.createRef();
    this.state = {
      data: [],
      answer_data: {}
    };
    this.seq = 0;

    const onUpdate = this._onChange.bind(this);
    store.subscribe((state) => {
      if (this.isMounted) onUpdate(state.data);
    });

    this.moveCard = this.moveCard.bind(this);
    this.insertCard = this.insertCard.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      store.dispatch("updateOrder", nextProps.data);
    }
  }

  componentDidMount() {
    this.isMounted = true;
    const { data, url, saveUrl } = this.props;
    store.dispatch("load", { loadUrl: url, saveUrl, data: data || [] });
    document.addEventListener("mousedown", this.editModeOff);
  }

  componentWillUnmount() {
    this.isMounted = false;
    document.removeEventListener("mousedown", this.editModeOff);
  }

  editModeOff = (e) => {
    if (this.editForm.current && !this.editForm.current.contains(e.target)) {
      this.manualEditModeOff();
    }
  };

  manualEditModeOff = () => {
    const { editElement } = this.props;

    if (editElement == null) return;

    if (editElement.Name || editElement.element === "FieldGroups") {
      if (editElement && editElement.dirty) {
        editElement.dirty = false;
        this.updateElement(editElement);
      }
      this.props.manualEditModeOff();
    } else {
      alert("Field Name is missing.");
    }
  };

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
  }

  updateElement(element) {
    const { data } = this.state;
    let updated = false;
    data.Fields.forEach((item, index, object) => {
      if (item.id == element.id) {
        data.Fields[index] = element;
        updated = true;
        return;
      }
    });

    if (!updated) this.updateChild(data.FieldGroups, element);

    this.seq = this.seq > 100000 ? 0 : this.seq + 1;
    store.dispatch("updateOrder", data);
  }

  updateChild(data, element) {
    let updated = false;
    data.forEach((pItem, pIndex, pObject) => {
      if (element.element == "FieldGroups") {
        if (pItem.id == element.id) {
          data[pIndex] = element;
          return;
        }
      } else {
        pItem.Fields.forEach((cItem, cIndex, cObject) => {
          if (cItem.id === element.id) {
            pItem.Fields[cIndex] = element;
            updated = true;
            return;
          }
        });
      }

      if (!updated && pItem.FieldGroups && pItem.FieldGroups.length >= 0)
        this.updateChild(pItem.FieldGroups, element);
    });
  }

  _onChange(data) {
    const answer_data = {};

    data.Fields.forEach((item) => {
      if (item && item.readOnly && this.props.variables[item.variableKey]) {
        answer_data[item.field_name] = this.props.variables[item.variableKey];
      }
    });

    this.setState({
      data,
      answer_data,
    });
  }

  _onDestroy(item) {
    store.dispatch("delete", item);
  }

  insertCard(item, hoverIndex) {
    //const { data } = this.state;
    //const { data } = store.state;
    //data.splice(hoverIndex, 0, item);
    //this.saveData(item, hoverIndex, hoverIndex);
    store.dispatch("create", item);
  }

  moveCard(dragIndex, hoverIndex) {
    const { data } = this.state;
    const dragCard = data[dragIndex];
    this.saveData(dragCard, dragIndex, hoverIndex);
  }

  // eslint-disable-next-line no-unused-vars
  cardPlaceHolder(dragIndex, hoverIndex) {
    // Dummy
  }

  saveData(dragCard, dragIndex, hoverIndex) {
    const newData = update(this.state, {
      data: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    });
    this.setState(newData);
    store.dispatch("updateOrder", newData.data);
  }

  getElement(item, index) {
    const elementName = getElementName(item.Type);
    item.element = elementName;
    const SortableFormElement = SortableFormElements[elementName];
    if (SortableFormElement) {
      return (
        <SortableFormElement
          id={item.id}
          seq={this.seq}
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
          _onDestroy={this._onDestroy}
          sortableFormElements={SortableFormElements}
        />
      );
    }
  }
  format() {
    store.dispatch("mapData");
  }
  render() {
    let classes = this.props.className;
    if (this.props.editMode) {
      classes += " is-editing";
    }
    const fields = this.state.data.Fields
      ? this.state.data.Fields.filter((x) => !!x)
      : [];
    const fieldGroups = this.state.data.FieldGroups
      ? this.state.data.FieldGroups.filter((x) => !!x)
      : [];
    fieldGroups.forEach((item) => {
      item.Type = "FieldGroups";
    });
    const data = [].concat(fields, fieldGroups);
    const items = data.map((item, index) => this.getElement(item, index));

    return (
      <div className={classes}>
        <div className="edit-form" ref={this.editForm}>
          {this.props.editElement !== null && (
            <FormElementsEdit
              showCorrectColumn={this.props.showCorrectColumn}
              files={this.props.files}
              manualEditModeOff={this.manualEditModeOff}
              preview={this}
              element={this.props.editElement}
              updateElement={this.updateElement}
            />
          )}
        </div>
        <div className="Sortable">{items}</div>
        <PlaceHolder
          id="form-place-holder"
          show={items.length === 0}
          index={items.length}
          moveCard={this.cardPlaceHolder}
          insertCard={this.insertCard}
        />
      </div>
    );
  }
}
Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: "react-form-builder-preview float-left",
};
