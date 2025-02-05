import React, { useState } from 'react';
import ApiRequests from './ApiRequests';
import ChartsPage from './Stats';

const App = () => {
  const [apiKey, setApiKey] = useState(''); // Initialize `apiKey` state with useState
  const [showCharts, setShowCharts] = useState(false); // State to toggle between API Requests and Charts
  // const host = 'http://localhost:3000';
  const host = 'https://147.93.120.192'

  return (
    <div>
      <h1
        style={{
          position: 'absolute',
          top: '10px',
          left: '20px',
          fontSize: '36px',
          fontWeight: 'bold',
          margin: '0',
        }}
      >
        <span style={{ color: 'rgb(0, 123, 255)' }}>Alex</span>{' '}
        <span style={{ color: 'rgb(40, 167, 69)' }}>Proxy Pools</span>{' '}
      </h1>

      {/* API Key Input and Toggle Button */}
      <div style={{ position: 'absolute', top: '10px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '250px',
          }}
        />
        <button
          onClick={() => setShowCharts(!showCharts)}
          style={{
            padding: '10px 15px',
            backgroundColor: showCharts ? '#007bff' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showCharts ? 'Show API Requests' : 'Show Charts'}
        </button>
      </div>

      {/* Conditional Rendering: Show Either API Requests or Charts Page */}
      {!showCharts ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            justifyContent: 'center',
            justifyItems: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            marginTop: '50px',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((poolNumber) => (
            <div
              key={poolNumber}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                width: '95%',
                maxHeight: '600px',
                overflowY: 'auto',
              }}
            >
              <ApiRequests apiKey={apiKey} host={host} poolNumber={poolNumber} />
            </div>
          ))}
        </div>
      ) : (
        <ChartsPage apiKey={apiKey} host={host} />
      )}
    </div>
  );
};

export default App;
