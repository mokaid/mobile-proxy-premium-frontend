import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import apiCall from './ApiCall';
import countryList from './countries';

// Utility function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ApiRequests = ({ apiKey, style, poolNumber }) => {
  const [defaultCountry, setDefaultCountry] = useState('');
  const [defaultNumber, setDefaultNumber] = useState(1);
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [terminateRequests, setTerminateRequests] = useState(null); // Store AbortController
  const [instanceId, setInstanceId] = useState(uuidv4());

  // Function to reset the component to its original state
  const handleReset = () => {
    if (terminateRequests) {
      terminateRequests.abort(); // Abort any ongoing requests
      console.log('Requests aborted during reset.');
    }
    setDefaultCountry('');
    setDefaultNumber(1);
    setRows([]);
    setResults([]);
    setIsFetching(false);
    setTerminateRequests(null);
    setInstanceId(uuidv4());
  };

  const addRow = () =>
    setRows([...rows, { url: '', country: defaultCountry, number: defaultNumber, isValid: true }]);

  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const handleDefaultChange = (field, value) => {
    if (field === 'country') {
      setDefaultCountry(value);
      setRows(rows.map((row) => ({ ...row, country: value })));
    } else if (field === 'number') {
      setDefaultNumber(value);
      setRows(rows.map((row) => ({ ...row, number: value })));
    }
  };

  const validateRows = () => {
    let isValid = true;
    const updatedRows = rows.map((row) => {
      if (!row.url || !row.country || row.number <= 0) {
        isValid = false;
        return { ...row, isValid: false };
      }
      return { ...row, isValid: true };
    });
    setRows(updatedRows);
    return isValid;
  };

  const handleRequest = async () => {
    if (!apiKey) {
      alert('Please provide an API key.');
      return;
    }

    if (!validateRows()) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const abortController = new AbortController();
    setTerminateRequests(abortController);

    setIsFetching(true);
    setResults([]);
    const newResults = [];
    const currentInstanceId = uuidv4();
    setInstanceId(currentInstanceId);

    try {
      for (const row of rows) {
        if (abortController.signal.aborted) return;

        for (let i = 0; i < row.number; i++) {
          if (abortController.signal.aborted) return;

          try {
            const response = await apiCall(
              row.url,
              row.country || defaultCountry,
              currentInstanceId,
              apiKey,
              { signal: abortController.signal }
            );
            const timestamp = new Date().toLocaleTimeString();
            newResults.push({ ...response, timestamp });
            setResults([...newResults]);
            const randomDelay = Math.random() * (1000 - 500) + 500;
            await delay(randomDelay);
          } catch (error) {
            if (abortController.signal.aborted) {
              console.log('Request aborted.');
              return;
            }
            console.error('Error during API call:', error);
          }
        }
      }
    } finally {
      setIsFetching(false);
      setTerminateRequests(null);
    }
  };

  const handleTerminate = () => {
    if (terminateRequests) {
      terminateRequests.abort(); // Abort ongoing requests
      console.log('All requests terminated.');
    }
    setIsFetching(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const urls = text.split(/\r?\n/).filter((url) => url.trim() !== '');
      const newRows = urls.map((url) => ({
        url,
        country: defaultCountry,
        number: defaultNumber,
        isValid: true,
      }));
      setRows([...rows, ...newRows]);
  
      e.target.value = ''; // Reset the file input value
    };
    reader.readAsText(file);
  };
  

  return (
    <div
      style={{
        position: 'relative',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ textAlign: 'center' }}>Proxy Requests Pool {poolNumber}</h3>
        <label
          style={{
            cursor: 'pointer',
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select
          value={defaultCountry}
          onChange={(e) => handleDefaultChange('country', e.target.value)}
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
        >
          <option value="">Select Default Country</option>
          {Object.entries(countryList).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          placeholder="Default Number"
          type="number"
          value={defaultNumber}
          onChange={(e) => handleDefaultChange('number', Number(e.target.value))}
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
        />
        <button
          onClick={addRow}
          style={{
            cursor: 'pointer',
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Add URL
        </button>
      </div>
      {rows.map((row, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            placeholder="URL"
            value={row.url}
            onChange={(e) => {
              const updatedRows = [...rows];
              updatedRows[index].url = e.target.value;
              setRows(updatedRows);
            }}
            style={{ padding: '10px', border: row.isValid ? '1px solid #ddd' : '1px solid red', borderRadius: '4px', flex: 2 }}
          />
          <select
            value={row.country}
            onChange={(e) => {
              const updatedRows = [...rows];
              updatedRows[index].country = e.target.value;
              setRows(updatedRows);
            }}
            style={{ padding: '10px', border: row.isValid ? '1px solid #ddd' : '1px solid red', borderRadius: '4px', flex: 1 }}
          >
            <option value="">Select Country</option>
            {Object.entries(countryList).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            placeholder="Number"
            type="number"
            value={row.number}
            onChange={(e) => {
              const updatedRows = [...rows];
              updatedRows[index].number = Number(e.target.value);
              setRows(updatedRows);
            }}
            style={{ padding: '10px', border: row.isValid ? '1px solid #ddd' : '1px solid red', borderRadius: '4px', flex: 1 }}
          />
          <button
            onClick={() => removeRow(index)}
            style={{
              cursor: 'pointer',
              padding: '10px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button
          onClick={handleTerminate}
          disabled={!isFetching}
          style={{
            cursor: 'pointer',
            padding: '12px 24px',
            backgroundColor: isFetching ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Terminate
        </button>
        <button
          onClick={handleReset}
          style={{
            cursor: 'pointer',
            padding: '12px 24px',
            backgroundColor: '#fd7e14', // Dark orange color
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Reset
        </button>
        <button
          onClick={handleRequest}
          disabled={isFetching}
          style={{
            cursor: 'pointer',
            padding: '12px 24px',
            backgroundColor: isFetching ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {isFetching ? 'Fetching...' : 'Send Requests'}
        </button>
    
      </div>

      {results.length > 0  && (
        <table
          style={{
            fontSize: '12px',
            textAlign: 'left',
            marginTop: '20px',
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '150px',
                }}
              >
                URL
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '150px',
                }}
              >
                Provider
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '150px',
                }}
              >
                Status
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '150px',
                }}
              >
                Redirected To
              </th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: '150px',
                  }}
                >
                  {result.url}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: '150px',
                  }}
                >
                  {result.provider}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    color: result.status === 'cancelled' ? 'orange' : result.success ? 'green' : 'red',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: '150px',
                  }}
                >
                  {result.status === 'cancelled' ? 'Cancelled' : result.success ? 'Success' : 'Failed'}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: '150px',
                  }}
                >
                  {result.redirectedTo || 'N/A'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{result.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApiRequests;
