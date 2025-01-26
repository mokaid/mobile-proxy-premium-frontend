import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import apiCall from './ApiCall';
import countryList from './countries';
// Utility function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ApiRequests = ({ apiKey, style }) => {
  const [defaultCountry, setDefaultCountry] = useState('');
  const [defaultNumber, setDefaultNumber] = useState(1);
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [terminateRequests, setTerminateRequests] = useState(false);
  const [instanceId, setInstanceId] = useState(uuidv4());

  const addRow = () => setRows([...rows, { url: '', country: defaultCountry, number: defaultNumber, isValid: true }]);
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
    setIsFetching(true);
    setTerminateRequests(false);
    setResults([]);
    const newResults = [];
    const currentInstanceId = uuidv4();
    setInstanceId(currentInstanceId);

    for (const row of rows) {
      if (terminateRequests) break;
      for (let i = 0; i < row.number; i++) {
        if (terminateRequests) break;
        const response = await apiCall(row.url, row.country || defaultCountry, currentInstanceId, apiKey);
        const timestamp = new Date().toLocaleTimeString();
        newResults.push({ ...response, timestamp });
        setResults([...newResults]); // Update results dynamically

        // Add a random delay between 1 to 3 seconds
        const randomDelay = Math.random() * (10000 - 1000) + 1000;
        await delay(randomDelay);
      }
    }
    setIsFetching(false);
  };

  const handleTerminate = () => {
    setTerminateRequests(true);
    setIsFetching(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const urls = text.split(/\r?\n/).filter((url) => url.trim() !== '');
      const newRows = urls.map((url) => ({ url, country: defaultCountry, number: defaultNumber, isValid: true }));
      setRows([...rows, ...newRows]);
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        border: '1px solid grey',
        width: '45%',
        padding: '20px',
        margin: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>API Requests</h2>
        <label style={{ cursor: 'pointer', padding: '10px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
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
          style={{ padding: '10px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
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
            style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
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
          onClick={handleRequest}
          disabled={isFetching}
          style={{
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
      {results.length > 0 && (
        <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>URL</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Provider</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Redirected To</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Instance</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{result.url}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{result.provider}</td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    color: result.success ? 'green' : 'red',
                  }}
                >
                  {result.success ? 'Success' : 'Failed'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  {result.redirectedTo || 'N/A'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{result.instance.slice(0, 5)}</td>
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
