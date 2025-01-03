import React, { useState, useEffect } from 'react';

function PythonRunner() {
  const [pythonCode, setPythonCode] = useState('print("Hello, World!")');
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);

  // Load Pyodide when the component mounts
  useEffect(() => {
    const loadPyodideLibrary = async () => {
      try {
        // Dynamically load the Pyodide script from CDN
        const pyodideScript = document.createElement('script');
        pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.2/full/pyodide.js';
        pyodideScript.onload = async () => {
          try {
            // Wait for Pyodide to load
            const pyodideInstance = await window.loadPyodide();
            setPyodide(pyodideInstance);
          } catch (error) {
            console.error('Error loading Pyodide:', error);
            setOutput('Failed to load Pyodide');
          }
        };
        // Append script to body
        document.body.appendChild(pyodideScript);
      } catch (error) {
        console.error('Error loading the script:', error);
        setOutput('Failed to load the script');
      }
    };

    loadPyodideLibrary();
  }, []);

  const handleCodeChange = (event) => {
    setPythonCode(event.target.value);
  };

  const runPythonCode = async () => {
    if (pyodide) {
      try {
        // Redirect stdout to capture print output
        pyodide.globals.set('output', '');
        pyodide.globals.set('print', (text) => {
          pyodide.globals.set('output', pyodide.globals.get('output') + text + '\n');
        });
        // Use Pyodide's runPython method
        await pyodide.runPythonAsync(pythonCode);
        const result = pyodide.globals.get('output');
        console.log(result);
        setOutput(result);
      } catch (error) {
        setOutput('Error executing Python code: ' + error.message);
      }
    } else {
      setOutput('Pyodide is still loading...');
    }
  };

  return (
    <div>
      <h2>Python Code Runner</h2>
      <textarea
        value={pythonCode}
        onChange={handleCodeChange}
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={runPythonCode}>Run Python</button>
      <pre>{output}</pre>
    </div>
  );
}

export default PythonRunner;

