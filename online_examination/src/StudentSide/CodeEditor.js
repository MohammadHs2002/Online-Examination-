import React,{useState} from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor = ({ value, handleValue, selectedIndex,setSelectedLanguage,selectedLanguage }) => {
  const handleEditorChange = (value) => {
    console.log("Code updated:", value);
    handleValue(selectedIndex, value); // Pass selectedIndex and the updated code value
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value); // Update the language when the user selects a different language
  };

  return (
    <div>
      {/* Language Selector Dropdown */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="language-selector">Select Language: </label>
        <select id="language-selector" onChange={handleLanguageChange} value={selectedLanguage}>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        height="300px"
        language={selectedLanguage} // Dynamically set the language based on the dropdown selection
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange} // Pass the editor change handler
      />
    </div>
  );
};


export default CodeEditor;
