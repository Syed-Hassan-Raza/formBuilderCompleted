/**
 * <Toolbar />
 */

import React from "react";
import ToolbarItem from "./toolbar-draggable-item";
import ID from "./UUID";
import store from "./stores/store";
import { add } from "date-fns";
import { element } from "prop-types";

export default class Toolbar extends React.Component {
  isMounted = false;

  constructor(props) {
    super(props);
    const items = this.props.items ? this.props.items : this._defaultItems();

    this.state = {
      items,
      sortBy: false,
    };

    store.subscribe((state) => {
      if (this.isMounted) this.setState({ store: state });
    });

    this.create = this.create.bind(this);
  }

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  static _defaultItemOptions(element) {
    let Checkboxes;
    let values;
    switch (element) {
      // case 'Dropdown':
      //   return [
      //     { value: 'place_holder_option_1', text: 'Place holder option 1', key: `dropdown_option_${ID.uuid()}` },
      //     { value: 'place_holder_option_2', text: 'Place holder option 2', key: `dropdown_option_${ID.uuid()}` },
      //     { value: 'place_holder_option_3', text: 'Place holder option 3', key: `dropdown_option_${ID.uuid()}` },
      //   ];

      //     case 'Autocomplete':
      //       return [
      //         { value: 'place_holder_option_1', text: 'Place holder option 1', key: `dropdown_option_${ID.uuid()}` },
      //         { value: 'place_holder_option_2', text: 'Place holder option 2', key: `dropdown_option_${ID.uuid()}` },
      //         { value: 'place_holder_option_3', text: 'Place holder option 3', key: `dropdown_option_${ID.uuid()}` },
      //       ];
      // case 'Tags':
      //   return [
      //     { value: 'place_holder_tag_1', text: 'Place holder tag 1', key: `tags_option_${ID.uuid()}` },
      //     { value: 'place_holder_tag_2', text: 'Place holder tag 2', key: `tags_option_${ID.uuid()}` },
      //     { value: 'place_holder_tag_3', text: 'Place holder tag 3', key: `tags_option_${ID.uuid()}` },
      //   ];
      // case 'Checkboxes':
      //   return  Checkboxes = { prop_place_holder_option_1: ''}
      case "RadioButtons":
        return (values = {
          prop_place_holder_option_1: "Place_holder_option_1",
          prop_place_holder_option_2: "Place_holder_option_2",
        });
      case "Autocomplete":
        return (values = ["Place_holder_option_1", "Place_holder_option_2"]);
      case "Dropdown":
        return (values = ["Place_holder_option_1", "Place_holder_option_2"]);

      default:
        return [];
    }
  }

  _defaultItems() {
    return [
      // {
      //   key: 'Header',
      //   name: 'Section Header',
      //   icon: 'fas fa-heading',
      //   static: true,
      //   label: 'Placeholder Text...',
      // },

      {
        key: "FieldGroups",
        name: "Fields Group",
        icon: "fa fa-object-group",
        label: "Label",
        static: true,
        Type: 22,
        Fields: [],
        FieldGroups: [],
        tip:
          "A fields group enables you to arrange the fields in your form in sections, and thereby provide your users a visual grouping of fields.",
      },

      {
        key: "TextInput",
        name: "Text Box",
        label: "Label",
        icon: "fas fa-font",
        field_name: "text_input_",
        Type: 1,
        tip:
          "A standard text box control, A text box is a rectangular area on the screen where you can enter text ie username, addresses, email",
      },
      {
        key: "NumberInput",
        canHaveAnswer: true,
        name: "Number Entry",
        label: "Label",
        icon: "fas fa-plus",
        field_name: "number_input_",
        Type: 2,
        tip:
          "An input control restricting entry to integer values e.g 0,1,2,3",
      },
      {
        key: "DecimalInput",
        name: "Decimal Entry",
        label: "Label",
        icon: "fas fa-circle",
        field_name: "decimal_",
        Type: 3,
        tip:
          "An input control restricting to floating point values e.g 0.1, 7.5",
      },

      {
        key: "TextArea",
        canHaveAnswer: true,
        name: "Multi-line Input",
        label: "Label",
        icon: "fas fa-text-height",
        field_name: "text_area_",
        Type: 9,
        tip:
          "A multiline text box. if you want to write a paragraph you can use it",
      },

      {
        key: "Dropdown",
        canHaveAnswer: true,
        name: "Select List",
        icon: "far fa-caret-square-down",
        label: "Label",
        field_name: "dropdown_",
        TypeDetail: [],
        Type: 5,
        tip: "A dropdown list that consists of multiple options ",
      },
      {
        key: "Checkboxes",
        canHaveAnswer: true,
        name: "Checkboxes",
        icon: "far fa-check-square",
        label: "Label",
        field_name: "checkboxes_",
        Type: 6,
        tip:
          "A checkbox control may consist of the checked or unchecked option ",
      },
      {
        key: "RadioButtons",
        canHaveAnswer: true,
        name: "Multiple Choice",
        icon: "far fa-dot-circle",
        label: "Label",
        field_name: "radiobuttons_",
        TypeDetail: [],
        canHaveTypeDetail: true,
        Type: 12,
        tip:
          "A group of radio buttons, You can add multiple radio buttons in this group, Only one option from the list can be chosen",
      },

      {
        key: "DatePicker",
        name: "Date",
        icon: "far fa-calendar-alt",
        label: "Label",
        field_name: "date_picker_",
        TypeDetail: "yyyy/MM/dd",
        Type: 4,
        tip:
          "A date picker control, if you want to put date-time values you can use it.",
      },
      {
        key: "TimePicker",
        name: "Time",
        label: "Label",
        icon: "fas fa-clock",
        field_name: "time_",
        TypeDetail: "hh:mm:ss",
        Type: 7,
        tip:
          "A time picker control, if you want to put only time values you can use it.",
      },
      {
        key: "Signature",
        name: "Signature",
        icon: "fas fa-pen-square",
        label: "Signature",
        field_name: "signature_",
        Type: 14,
        tip: "This Control provides a facility to draw signature in the form.",
      },

      {
        key: "Barcode",
        canHaveAnswer: true,
        name: "Barcode",
        label: "Label",
        icon: "fas fa-barcode",
        field_name: "barcode_",
        Type: 16,
        tip:
          "If a barcode scanner is available display it to the user and populates the field with the results of the scan.  Otherwise, allow the field to be filled in manually as a text field.  Users should be able to explicitly choose the manual population of the field if they want.",
      },

      {
        key: "Assignee",
        name: "Assignee",
        canHaveAnswer: true,
        label: "Label",
        icon: "fas fa-plus-square",
        field_name: "assignee_",
        Type: 13,
        tip:
          "A select list of users and teams that can be ‘assigned’ to the form. When assignees are selected and the form submitted. Assignments will be created and the user/team will be notified that some action is required of them.",
      },

      {
        key: "Autocomplete",
        name: "Autocomplete",
        label: "Label",
        icon: "fas fa-list-alt",
        field_name: "autocomplete_",
        TypeDetail: [],
        Type: 15,
        tip:
          "A list of choices that the user can pick from.  Optionally the user can be provided with a text box that they can type the name of a choice into.",
      },
      {
        key: "Action",
        name: "Action",
        label: "Label",
        icon: "fa fa-bolt",
        field_name: "action_",
        Type: 8,
        tip: "The field that defines an action",
      },
      {
        key: "StaticText",
        name: "Static text",
        label: "Label",
        icon: "fas fa-font",
        field_name: "static_text_",
        Type: 30,
        TypeDetail:"html",
        tip: "Non-input static information presented to the user",
      },
      {
        key: "Calculated",
        name: "Calculated",
        label: "Label",
        icon: "fas fa-plus",
        field_name: "calculated_",
        Type: 10,
        tip: "A control that contains calculated values",
      },
      {
        key: "Counter",
        name: "Counter",
        label: "Label",
        icon: "fa fa-calculator",
        field_name: "counter_",
        Type: 11,
        tip:
          "Auto increasing (changing) document identifier. this should not be editable as the value will come from the server",
      },
    ];
  }

  create(item) {
    const elementOptions = {
      id: ID.uuid(),
      element: item.element || item.key,
      Name: "",
      Label: item.label,
      Type: item.Type,
      //Fields: item.Fields,
      //FieldGroups: item.FieldGroups
    };

    if (item.key !== "FieldGroups") {
      (elementOptions.TypeDetail = ""),
        // elementOptions.DefaultValue='',
        (elementOptions.MaxWidth = null),
        (elementOptions.MinWidth = null),
        (elementOptions.ReadOnly = false),
        (elementOptions.Mandatory = false),
        (elementOptions.Visible = true),
        (elementOptions.ControlWidthRatio = null),
        (elementOptions.States = {}),
        (elementOptions.ExternalAutoFill = []),
        (elementOptions.ConditionalFlow = '{ "entries": [] }')
    }

    if (item.key === "FieldGroups") {
      (elementOptions.Fields = []), (elementOptions.FieldGroups = []);
    }

    if (item.Type === 7 || item.Type === 4) {
      elementOptions.DefaultValue = "NOW";
    }

    //if (item.Name) { elementOptions.Name = item.Name + ID.uuid();}

    if (item.label) {
      elementOptions.Label = item.label;
    }

    if (item.TypeDetail) {
      if (item.TypeDetail.length > 0) {
        elementOptions.TypeDetail = item.TypeDetail;
      } else {
        let typeDetail = Toolbar._defaultItemOptions(elementOptions.element);

        elementOptions.TypeDetail = typeDetail;
      }
    }
    return elementOptions;
  }

  _onClick(item) {
    // ElementActions.createElement(this.create(item));
    store.dispatch("create", this.create(item));
  }

  compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  sortBy(key) {
    let arrayCopy = this.state.items;
    if (this.state.sortBy == true) {
      arrayCopy.sort(this.compareValues(key, "asc"));
      this.setState({ items: arrayCopy, sortBy: false });
    } else {
      arrayCopy.sort(this.compareValues(key, "desc"));
      this.setState({ items: arrayCopy, sortBy: true });
    }
  }

  render() {
    return (
      <div className="react-form-builder-toolbar" style={{position: 'sticky', top: '0', height: '30px', justifySelf: 'flex-start'}}>
        {/* <h4>Toolbox</h4> */}
        <ul>
          {this.state.items.map((item) => (
            <ToolbarItem
              data={item}
              key={item.key}
              onClick={this._onClick.bind(this, item)}
              onCreate={this.create}
            />
          ))} 
        </ul>
      </div>
    );
  }
}
