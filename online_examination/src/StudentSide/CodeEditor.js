import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor = ({value,handleValue}) => {
  const handleEditorChange = (value) => {
    console.log("Code updated:", value);
  };

  return (
    <MonacoEditor
      height="500px"
      language="javascript"
      theme="vs-dark"
      value={value}
      onChange={handleValue}
    />
  );
};

export default CodeEditor;
