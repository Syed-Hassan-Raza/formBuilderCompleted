/**
  * <Toolbar />
  */

import React from 'react';
import ToolbarItem from './toolbar-draggable-item';
import ID from './UUID';
import store from './stores/store';
import { add } from 'date-fns';
import { element } from 'prop-types';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    const items = (this.props.items) ? this.props.items : this._defaultItems();
    this.state = {
      items,
    };
    store.subscribe(state => this.setState({ store: state }));
    this.create = this.create.bind(this);
  }

  static _defaultItemOptions(element) {
    let Checkboxes;
    let RadioButtons;
    switch (element) {
      
      case 'Dropdown':
        return [
          { value: 'place_holder_option_1', text: 'Place holder option 1', key: `dropdown_option_${ID.uuid()}` },
          { value: 'place_holder_option_2', text: 'Place holder option 2', key: `dropdown_option_${ID.uuid()}` },
          { value: 'place_holder_option_3', text: 'Place holder option 3', key: `dropdown_option_${ID.uuid()}` },
        ];

          case 'Autocomplete':
            return [
              { value: 'place_holder_option_1', text: 'Place holder option 1', key: `dropdown_option_${ID.uuid()}` },
              { value: 'place_holder_option_2', text: 'Place holder option 2', key: `dropdown_option_${ID.uuid()}` },
              { value: 'place_holder_option_3', text: 'Place holder option 3', key: `dropdown_option_${ID.uuid()}` },
            ];
      case 'Tags':
        return [
          { value: 'place_holder_tag_1', text: 'Place holder tag 1', key: `tags_option_${ID.uuid()}` },
          { value: 'place_holder_tag_2', text: 'Place holder tag 2', key: `tags_option_${ID.uuid()}` },
          { value: 'place_holder_tag_3', text: 'Place holder tag 3', key: `tags_option_${ID.uuid()}` },
        ];
      case 'Checkboxes':
        return  Checkboxes = { prop_place_holder_option_1: 'Place_holder_option_1',prop_place_holder_option_2: 'Place_holder_option_2'}
      case 'RadioButtons':
        return RadioButtons = { prop_place_holder_option_1: 'Place_holder_option_1',prop_place_holder_option_2: 'Place_holder_option_2'}
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
        key: 'FieldGroups',
        name: 'Fields Group',
        icon: 'fa fa-object-group',
        label: 'Placeholder Label',
        static: true,
        Type: null,
        Fields: [],
        FieldGroups: [],
      },

      {
        key: 'TextInput',
        name: 'Text Box',
        label: 'Placeholder Label',
        icon: 'fas fa-font',
        field_name: 'text_input_',
        Type: 1,   
      },
      {
        key: 'NumberInput',
        canHaveAnswer: true,
        name: 'Number Entry',
        label: 'Placeholder Label',
        icon: 'fas fa-plus',
        field_name: 'number_input_',
        Type: 2,
      },
      {
        key: 'DecimalInput',
        name: 'Decimal Entry',
        label: 'Placeholder Label',
        icon: 'fas fa-circle',
        field_name: 'Decimal',
        Type: 3,
      },

      {
        key: 'TextArea',
        canHaveAnswer: true,
        name: 'Multi-line Input',
        label: 'Placeholder Label',
        icon: 'fas fa-text-height',
        field_name: 'text_area_',
        Type: 9,
      },

      {
        key: 'Dropdown',
        canHaveAnswer: true,
        name: 'Select List',
        icon: 'far fa-caret-square-down',
        label: 'Placeholder Label',
        field_name: 'dropdown_',
        TypeDetail:null,
        Type: 5,
      },
      {
        key: 'Checkboxes',
        canHaveAnswer: true,
        name: 'Checkboxes',
        icon: 'far fa-check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        TypeDetail: [],
        canHaveTypeDetail:true,
        Type: 6,
      },
      {
        key: 'RadioButtons',
        canHaveAnswer: true,
        name: 'Multiple Choice',
        icon: 'far fa-dot-circle',
        label: 'Placeholder Label',
        field_name: 'radiobuttons_',
        TypeDetail: [],
        canHaveTypeDetail:true,
        Type: 12,
      },

      {
        key: 'DatePicker',
        canDefaultToday: true,
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'hh:mm aa',
        showTimeSelect: false,
        showTimeSelectOnly: false,
        name: 'Date',
        icon: 'far fa-calendar-alt',
        label: 'Placeholder Label',
        field_name: 'date_picker_',
        Type: 4,
      },
      {
        key: 'TimePicker',
        name: 'Time',
        label: 'Placeholder Label',
        icon: 'fas fa-clock',
        field_name: 'time_',
        Type: 7,
      },
      {
        key: 'Signature',
        name: 'Signature',
        icon: 'fas fa-pen-square',
        label: 'Signature',
        field_name: 'signature_',
        Type: 14,
      },

      {
        key: 'Barcode',
        canHaveAnswer: true,
        name: 'Barcode',
        label: 'Placeholder Label',
        icon: 'fas fa-barcode',
        field_name: 'barcode_',
        Type: 16,
      },

   
      {
        key: 'Assignee',
        name: 'Assignee',
        canHaveAnswer: true,
        label: 'Placeholder Label',
        icon: 'fas fa-plus-square',
        field_name: 'assignee_',
        TypeDetail: [],
        Type: 13,
      },

      {
        key: 'Autocomplete',
        name: 'Autocomplete',
        label: 'Placeholder Label',
        icon: 'fas fa-list-alt',
        field_name: 'autocomplete_',
        TypeDetail: [],
        Type: 15,
      },
      {
        key: 'StaticText',
        name: 'Static text',
        label: 'Placeholder Label',
        icon: 'fas fa-font',
        field_name: 'static_text_',
        Type: 30,
      },
      {
        key: 'Calculated',
        name: 'Calculated',
        label: 'Placeholder Label',
        icon: 'fas fa-square-root-alt',
        field_name: 'calculated_',
        Type: 10,
      },
      {
        key: 'Counter',
        name: 'Counter',
        label: 'Placeholder Label',
        icon: 'fa fa-calculator',
        field_name: 'counter_',
        Type: 11,
      },
      
    ];
  }

  create(item) {
    const elementOptions = {
     id: ID.uuid(),
     element: item.element || item.key,

      Name: item.name + ID.uuid(),
      Label: item.label,
      Type: item.Type,
      //Fields: item.Fields,
      //FieldGroups: item.FieldGroups
    };

    if(item.key!=='FieldGroups'){
     elementOptions.TypeDetail=null,
     elementOptions.DefaultValue=null,
     elementOptions.MaxWidth=null,
     elementOptions.MinWidth=null,
     elementOptions.ReadOnly= false,
     elementOptions.Mandatory=false,
     elementOptions.Visible=true,
     elementOptions.ControlWidthRatio=null,
     elementOptions.States=[],
     elementOptions.ExternalAutoFill=[]
    }

   // if(item.canHaveTypeDetail){
    //    elementOptions.TypeDetail=item.TypeDetail;
  //}
    //if (this.props.showDescription === true && !item.static) {  elementOptions.showDescription = true; }

    //if (item.static) { elementOptions.bold = false; elementOptions.italic = false;}

    //if (item.canReadOnly) { elementOptions.readOnly = false; }

    //if (item.canDefaultToday) { elementOptions.defaultToday = false; }

     //if (item.content) { elementOptions.Label = item.content; }

    //if (item.href) { elementOptions.href = item.href; }

   // elementOptions.canHavePageBreakBefore = item.canHavePageBreakBefore !== false;
   // elementOptions.canHaveAlternateForm = item.canHaveAlternateForm !== false;
   // elementOptions.canHaveDisplayHorizontal = item.canHaveDisplayHorizontal !== false;
   // elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect !== false;
   // elementOptions.canHaveOptionValue = item.canHaveOptionValue !== false;
   // elementOptions.canPopulateFromApi = item.canPopulateFromApi !== false;

  /*  if (item.key === 'Image') {
      elementOptions.src = item.src;
    }

    if (item.key === 'DatePicker') {
      elementOptions.dateFormat = item.dateFormat;
      elementOptions.timeFormat = item.timeFormat;
      elementOptions.showTimeSelect = item.showTimeSelect;
      elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
    }

    if (item.key === 'Download') {
      elementOptions._href = item._href;
      elementOptions.file_path = item.file_path;
    }

    if (item.key === 'Range') {
      elementOptions.step = item.step;
      elementOptions.default_value = item.default_value;
      elementOptions.min_value = item.min_value;
      elementOptions.max_value = item.max_value;
      elementOptions.min_label = item.min_label;
      elementOptions.max_label = item.max_label;
    }
    */

    //if (item.Name) { elementOptions.Name = item.Name + ID.uuid();}

    if (item.label) { elementOptions.Label = item.label; }
   
    if (item.key === 'DatePicker') {
      elementOptions.dateFormat = item.dateFormat;
      elementOptions.timeFormat = item.timeFormat;
      elementOptions.showTimeSelect = item.showTimeSelect;
      elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
    }

    if (item.TypeDetail) {
      if (item.TypeDetail.length > 0) {
        elementOptions.TypeDetail = item.TypeDetail;
      } else {
       let i=Toolbar._defaultItemOptions(elementOptions.element);
      
        elementOptions.TypeDetail = i;
      }
    }

    return elementOptions;
  }

  _onClick(item) {
    // ElementActions.createElement(this.create(item));
    store.dispatch('create', this.create(item));
  }

  render() {
    return (
      <div className="react-form-builder-toolbar float-right">
        <h4>Toolbox</h4>
        <ul>
          {
            this.state.items.map((item) => (<ToolbarItem data={item} key={item.key} onClick={this._onClick.bind(this, item)} onCreate={this.create} />))
          }
        </ul>
      </div>
    );
  }
}
