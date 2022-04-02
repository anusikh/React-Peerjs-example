import React from "react";

const TextEditor = (props) => {
  const { textEditor, setTextEditor, remotePeerIdValue, editor } = props;
  return (
    <div className="TextEditor__main">
      <p>Shared Text editor</p>
      <p>
        <textarea
          value={textEditor}
          onChange={(e) => {
            setTextEditor(e.target.value);
            editor(remotePeerIdValue, e.target.value);
          }}
        />
      </p>
    </div>
  );
};

export default TextEditor;
