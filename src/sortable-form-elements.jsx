import SortableElement from './sortable-element';
import PlaceHolder from './form-place-holder';
import BaseFormElements from './form-elements';

const {
  Header, Paragraph, Label, LineBreak, TextInput, NumberInput, TextArea, Dropdown, Checkboxes,
  DatePicker, RadioButtons, Image, Rating, Tags, Signature, HyperLink, Download, Camera, Range,Barcode,
  DecimalInput,StaticText,
  Calculated,Counter,Assignee,Autocomplete,FieldsGroup,TimePicker
} = BaseFormElements;

const FormElements = {};

FormElements.Header = SortableElement(Header);
FormElements.Paragraph = SortableElement(Paragraph);
FormElements.Label = SortableElement(Label);
FormElements.LineBreak = SortableElement(LineBreak);
FormElements.TextInput = SortableElement(TextInput);
FormElements.NumberInput = SortableElement(NumberInput);
FormElements.TextArea = SortableElement(TextArea);
FormElements.Dropdown = SortableElement(Dropdown);
FormElements.Signature = SortableElement(Signature);
FormElements.Checkboxes = SortableElement(Checkboxes);
FormElements.DatePicker = SortableElement(DatePicker);
FormElements.RadioButtons = SortableElement(RadioButtons);
FormElements.Image = SortableElement(Image);
FormElements.Rating = SortableElement(Rating);
FormElements.Tags = SortableElement(Tags);
FormElements.HyperLink = SortableElement(HyperLink);
FormElements.Download = SortableElement(Download);
FormElements.Camera = SortableElement(Camera);
FormElements.Range = SortableElement(Range);
FormElements.PlaceHolder = SortableElement(PlaceHolder);
FormElements.Barcode = SortableElement(Barcode);
FormElements.DecimalInput = SortableElement(DecimalInput);
FormElements.StaticText = SortableElement(StaticText);
FormElements.Calculated = SortableElement(Calculated);
FormElements.Counter = SortableElement(Counter);
FormElements.Assignee = SortableElement(Assignee);
FormElements.Autocomplete = SortableElement(Autocomplete);
FormElements.FieldsGroup = SortableElement(FieldsGroup);
FormElements.TimePicker = SortableElement(TimePicker);

export default FormElements;
