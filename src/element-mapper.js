export default function getElementName(type) {
    switch (type) {
        case 1:
            return "TextInput";
        case 2:
            return "NumberInput";
        case 3:
            return "DecimalInput";
        case 4:
            return "DatePicker";
        case 5:
            return "Dropdown";
        case 6:
            return "Checkboxes";
        case 7:
            return "TimePicker";
        case 8:
            return "Action";
        case 9:
            return "TextArea";
        case 10:
            return "Calculated";
        case 11:
            return "Counter";
        case 12:
            return "RadioButtons";
        case 13:
            return "Assignee";
        case 14:
            return "Signature";
        case 15:
            return "Autocomplete";
        case 16:
            return "Barcode";
        case 17:
            return "datetime";
        case 18:
            return "diagram";
        case 20:
            return "collapsible matrix";
        case 21:
            return "options matrix";
        case 30:
            return "StaticText";
        case 35:
            return "PlainText";
        case 100:
            return "immediate causes matrix";
        case 101:
            return "root causes matrix";
        case 102:
            return "corrective actions";
        case 103:
            return "risk calculation";
        default:
            return type;
    }
}