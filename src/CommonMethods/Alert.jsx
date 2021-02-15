import React from 'react';
$("#EditModal").modal("show");
    $("#EditModal").appendTo("body");
function Alert(props) {
    return     <> 
    

    {props.title && (
    <div className="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                {props.title || ""}
            </div>
            <div className="modal-body">
               {props.messsage ||""}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <a className={props.buttonClass} onClick={props.buttonAction.bind()}>{props.buttonText}</a>
            </div>
        </div>
    </div>
</div>
    )}
    <a className="btn btn-default" data-href="/delete.php?id=54" data-toggle="modal" data-target="#confirm-delete">
   <i></i> Delete record #54
    </a>
</>;
  }
  
  export default Alert;