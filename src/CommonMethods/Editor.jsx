import React from "react";
import { mdToDraftjs, draftjsToMd } from "draftjs-md-converter";
import htmlToDraft from "html-to-draftjs";

import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import { convertToCode,encryptToBase64,decryptFromBase64 } from "./../constants";

import { Editor } from "react-draft-wysiwyg";

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: undefined,
      isReadOnly: props.isReadOnly,
      style: props.style,
      element: this.props.element,
    };
  }
  componentDidMount() {
    this.setState({
      editorState:
        this.loadEditState() ||
        EditorState.createWithContent(ContentState.createFromText("")),
    });
    if (!this.state.isReadOnly)
      this.props.state.editorState =
        this.loadEditState() ||
        EditorState.createWithContent(ContentState.createFromText(""));
  }
  onEditorStateChange(index, property, editorContent) {
    let code = convertToCode(editorContent, this.props.element.TypeDetail);
    // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
    const this_element = this.state.element;
    this_element[property] = code;
    (this.props.state.editorState = editorContent),
      this.setState({
        element: this_element,
        dirty: true,
        editorState: editorContent,
      });
  }

  updateElement() {
    const this_element = this.state.element;
    // to prevent ajax calls with no change
    if (this.state.dirty) {
      this.props.updateElement.call(this.props.preview, this_element);
      this.setState({ dirty: false });
    }
  }

  convertFromHTML(content) {
    const newContent = convertFromHTML(content);
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      // to prevent crash when no contents in editor
      return EditorState.createEmpty();
    }
    const blocksFromHtml = htmlToDraft(content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  }
  loadEditState() {
    let editorState;
    let element = this.state.element;
    if (element.TypeDetail === "html" || element.TypeDetail === "html64") {
      if (element.DefaultValue){
        let dataString=element.TypeDetail === "html"?element.DefaultValue:decryptFromBase64(element.DefaultValue);
        return this.convertFromHTML(dataString);
      }
    } else if (element.TypeDetail === "md" || element.TypeDetail === "md64") {
      if (element.DefaultValue) {
        const markdownString = element.TypeDetail === "md"?element.DefaultValue:decryptFromBase64(element.DefaultValue);
        const rawData = mdToDraftjs(markdownString);
        const contentState = convertFromRaw(rawData);
        const newEditorState = EditorState.createWithContent(contentState);
        return newEditorState;
      }
    }
    return null;
  }

  handlePastedText = (text, html) => {
    // if they try to paste something they shouldn't let's handle it
    if (text.indexOf("text that should not be pasted") != -1) {
      // we'll add a message for the offending user to the editor state
      const newContent = Modifier.insertText(
        this.state.editorState.getCurrentContent(),
        this.state.editorState.getSelection(),
        "nice try, chump!"
      );

      // update our state with the new editor content
      this.onChange(
        EditorState.push(
          this.state.editorState,
          newContent,
          "insert-characters"
        )
      );
      return true;
    } else {
      return false;
    }
  };

  render() {
    let editorState = this.loadEditState();
    let isReadOnly = this.state.isReadOnly;
    return (
      <>
        {isReadOnly && (
          <Editor
            editorStyle={this.state.style}
            editorState={editorState}
            toolbarHidden={true}
          />
        )}
        {!isReadOnly && (
          <Editor
            editorStyle={this.state.style}
            defaultEditorState={editorState}
            handlePastedText={this.handlePastedText}
            onBlur={this.updateElement.bind(this)}
            toolbarHidden={false}
            onEditorStateChange={this.onEditorStateChange.bind(
              this,
              0,
              "DefaultValue"
            )}
          />
        )}
      </>
    );
  }
}
