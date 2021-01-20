import { draftjsToMd } from "draftjs-md-converter";

import {
  convertToRaw,
} from "draft-js";


import draftToHtml from "draftjs-to-html";

export { mdDictonery, fieldNames,editorFormats,dateFormats,timeFormats,findElementName,hasWhiteSpace,convertToCode,createTypeDetails };

const mdDictonery = {
  BOLD: "**",
  STRIKETHROUGH: "~~",
  MONOSPACE: "``",
};
const fieldNames = [
  { name: null, typeDetail: "" },
  { name: "sm_asset_category", typeDetail: "" },
  { name: "sm_asset_child_site", typeDetail: "" },
  { name: "sm_asset_location", typeDetail: "" },
  { name: "sm_asset_machinehours", typeDetail: "" },
  { name: "sm_asset_make", typeDetail: "" },
  { name: "sm_asset_model", typeDetail: "" },
  { name: "sm_asset_name", typeDetail: "" },
  { name: "sm_asset_odometer", typeDetail: "" },
  { name: "sm_asset_odometerunit", typeDetail: 9 },
  { name: "sm_asset_operator", typeDetail: "" },
  { name: "sm_asset_operator_out", typeDetail: "" },
  { name: "sm_asset_serialnumber", typeDetail: "" },
  { name: "sm_asset_site_location", typeDetail: "" },
  { name: "sm_populate_best_cell_phone", typeDetail: "" },
  { name: "sm_populate_best_email", typeDetail: "" },
  { name: "sm_populate_client", typeDetail: 6 },
  { name: "sm_populate_date", typeDetail: "" },
  { name: "sm_populate_datetime", typeDetail: "" },
  { name: "sm_populate_department", typeDetail: 2 },
  { name: "sm_populate_division", typeDetail: 3 },
  { name: "sm_populate_job_classification", typeDetail: 1 },
  { name: "sm_populate_location", typeDetail: 4 },
  { name: "sm_populate_name", typeDetail: "" },
  { name: "sm_populate_personal_cell_phone", typeDetail: "" },
  { name: "sm_populate_personal_email", typeDetail: "" },
  { name: "sm_populate_priority", typeDetail: "" },
  { name: "sm_populate_subcontractor", typeDetail: 19 },
  { name: "sm_populate_time", typeDetail: "" },
  { name: "sm_populate_title", typeDetail: "" },
  { name: "sm_populate_update_date", typeDetail: "" },
  { name: "sm_populate_update_name", typeDetail: "" },
  { name: "sm_populate_work_cell_phone", typeDetail: "" },
  { name: "sm_populate_work_email", typeDetail: "" },
  { name: "sm_populate_latitude", typeDetail: "" },
  { name: "sm_populate_longitude", typeDetail: "" },
  { name: "sm_shapefile_hectare", typeDetail: "" },
  { name: "sm_shapefile_line", typeDetail: "" },
  { name: "sm_shapefile_name", typeDetail: "" },
  { name: "sm_shapefile_pline_id", typeDetail: "" },
  { name: "sm_shapefile_<name>", typeDetail: "" },
  { name: "sm_tag_identifier", typeDetail: 2 },
  { name: "sm_usershape_segment_end_lat", typeDetail: "" },
  { name: "sm_usershape_segment_end_lng", typeDetail: "" },
  { name: "sm_usershape_segment_start_lat", typeDetail: "" },
  { name: "sm_usershape_segment_start_lng", typeDetail: "" },
  { name: "sm_usershape_segmentlength", typeDetail: "" },
  { name: "sm_usershape_shapearea", typeDetail: "" },
  { name: "sm_usershape_shapelength", typeDetail: "" },
  { name: "sm_auto_formid", typeDetail: "" },
  { name: "sm_populate_subject", typeDetail: "" },
  { name: "sm_populate_assignee", typeDetail: 13 },
  { name: "sm_populate_attendee", typeDetail: "" },
];
const editorFormats = ["html", "html64", "md", "md64"];
const dateFormats = [
"yyyy-mm-dd",
"yyyy-MM-dd",
"dd-MMM-yy",
"YYYY-MM-DD",

"M/d/yyyy",
"M/d/yy",
"MM/dd/yy",
"MM/dd/yyyy",
"yyyy/MM/dd",
"yy/MM/dd",

"dd.mm.yyyy",
]
const timeFormats = [
"hh:mm:ss.sss",
"hh:mm:ss",
"hh:mm",
]

const findElementName=(data, element)=> {
  let found = false;
  if(element.Name)
  data.Fields.forEach((item, index, object) => {
    

    if (item.Name === element.Name && item.id !== element.id) {
      found = true;
      return;
    }
  });

  if (!found) return removeItem(data.FieldGroups, element);
  else return true;
}
const removeItem=(data, element)=> {
  let removed = false;
  data.forEach((pItem, pIndex, pObject) => {
    

    if (pItem.Name) {
      if (pItem.Name === element.Name && pItem.id !== element.id) {
        removed = true;
        return;
      }
    } 
      if (pItem.Fields) {
        pItem.Fields.forEach((cItem, cIndex, cObject) => {
          

          if (cItem.Name === element.Name && cItem.id !== element.id) {
            removed = true;
            return;
          }
        });
      }
    

    if (!removed && pItem.FieldGroups && pItem.FieldGroups.length >= 0)
      removeItem(pItem.FieldGroups, element);
  });
  if (removed) return true;
  else return false;
}
///draftjs to code
const convertToCode=(editorContent, TypeDetail)=> {
  let isHtml =
    TypeDetail === "html" || TypeDetail === "html64" ? true : false;
  if (isHtml) {
    return draftToHtml(convertToRaw(editorContent.getCurrentContent()));
  } else if (!isHtml) {
    return draftjsToMd(
      convertToRaw(editorContent.getCurrentContent()),
      mdDictonery
    );
  }
  return null;
}

const hasWhiteSpace=(str)=> {
  return /\s/g.test(str);
}

const createTypeDetails=(element)=> {
  if (element.Type === 15) {
    element.TypeDetail = JSON.stringify({ data: element.TypeDetail });
  } else if (element.Type === 12) {
    element.TypeDetail = JSON.stringify(element.TypeDetail);
  }
}