import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import apiCall from './ApiCall';
import countryList from './countries';

// Utility function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ApiRequests = ({ apiKey, style, poolNumber, host }) => {
  const [defaultCountry, setDefaultCountry] = useState('');
  const [defaultNumber, setDefaultNumber] = useState(1);
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [terminateRequests, setTerminateRequests] = useState(null); // Store AbortController
  const [instanceId, setInstanceId] = useState(uuidv4());
  const [selectedImage, setSelectedImage] = useState(null); // For displaying enlarged image
  const [selectedMode, setSelectedMode] = useState('proxyAuthOxylabsMobile'); // Default mode

  const handleReset = () => {
    if (terminateRequests) {
      terminateRequests.abort();
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
              { signal: abortController.signal },
              host,
              selectedMode,  // Pass the selected proxy mode

            );
            
            const timestamp = new Date().toLocaleTimeString();
            newResults.push({ ...response, timestamp });
            setResults([...newResults]);
            const randomDelay = Math.random() * (1000 - 500) + 500;
            // await delay(randomDelay);
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
      terminateRequests.abort();
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
      <h4 style={{ textAlign: 'left' }}>Pool {poolNumber} Mode</h4>
<div style={{ padding: '15px', borderRadius: '5px' , marginLeft :'-160px' }}>
  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
    <label>
      <input
        type="radio"
        value="proxyAuthOxylabsMobile"
        checked={selectedMode === 'proxyAuthOxylabsMobile'}
        onChange={(e) => setSelectedMode(e.target.value)}
      />{' '}
      Mobile
    </label>
    <label>
      <input
        type="radio"
        value="proxyAuthOxylabsResidential"
        checked={selectedMode === 'proxyAuthOxylabsResidential'}
        onChange={(e) => setSelectedMode(e.target.value)}
      />{' '}
      Residential
    </label>
    <label>
      <input
        type="radio"
        value="Hybrid"
        checked={selectedMode === 'Hybrid'}
        onChange={(e) => setSelectedMode(e.target.value)}
      />{' '}
      Hybrid
    </label>
  </div>
</div>

    
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

      {results.length > 0 && (
        <>
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
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Time</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Screenshot</th>
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
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{result.timestamp}</td>
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    {result.screenshot ? (
                      <img
                        src={`data:image/jpeg;base64,${result.screenshot}`}
                        alt="Screenshot"
                        style={{
                          maxWidth: '50px',
                          maxHeight: '50px',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedImage(`data:image/jpeg;base64,${result.screenshot}`)}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for enlarged screenshot */}
          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              <img
                src={selectedImage}
                alt="Enlarged Screenshot"
                style={{ maxWidth: '90%', maxHeight: '90%' }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApiRequests;
