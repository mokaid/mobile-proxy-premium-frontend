import React, { useState } from 'react';
import ApiRequests from './ApiRequests';

const App = () => {
  const [apiKey, setApiKey] = useState(''); // Initialize `apiKey` state with useState

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

      {/* API Key Input */}
      <div style={{ position: 'absolute', top: '10px', right: '20px'}}>
        <input
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)} // Ensure setApiKey is used here
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '300px',
          }}
        />
      </div>

      <div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Two columns
    gap: '20px', // Space between components
    justifyContent: 'center', // Centers the grid horizontally
    // alignItems: 'center', // Centers the grid vertically
    justifyItems: 'center', // Centers each grid item horizontally
    // height: '100vh', // Full viewport height to center vertically
    backgroundColor: '#f5f5f5', // Light background for the entire page
    padding: '20px', // Padding around the grid
    marginTop :'50px' 
  }}
>
  <div
    style={{
      backgroundColor: 'white',
      border: '1px solid #ccc', // Light grey border
      borderRadius: '8px', // Rounded corners
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
      padding: '20px', // Padding inside the component
      width: '95%',
      maxHeight: '600px', // Limit the height to 600px
      overflowY: 'auto', // Add vertical scrolling if content exceeds 600px
    }}
  >
    <ApiRequests apiKey={apiKey} poolNumber={1} />
  </div>
  <div
    style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '95%',
      maxHeight: '600px', // Limit the height to 600px
      overflowY: 'auto', // Add vertical scrolling if content exceeds 600px
    }}
  >
    <ApiRequests apiKey={apiKey} poolNumber={2}  />
  </div>
  <div
    style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '95%',
      maxHeight: '600px', // Limit the height to 600px
      overflowY: 'auto', // Add vertical scrolling if content exceeds 600px
    }}
  >
    <ApiRequests apiKey={apiKey} poolNumber={3} />
  </div>
  <div
    style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '95%',
      maxHeight: '600px', // Limit the height to 600px
      overflowY: 'auto', // Add vertical scrolling if content exceeds 600px
    }}
  >
    <ApiRequests apiKey={apiKey} poolNumber={4} />
  </div>

  <div
    style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '95%',
      maxHeight: '600px', // Limit the height to 600px
      overflowY: 'auto', // Add vertical scrolling if content exceeds 600px
    }}
  >
    <ApiRequests apiKey={apiKey} poolNumber={5} />
  </div>

  <div
    style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '95%',
      maxHeight: '600px', // Limit the height to 600px
      overflowY: 'auto', // Add vertical scrolling if content exceeds 600px
    }}
  >
    <ApiRequests apiKey={apiKey} poolNumber={6} />
  </div>
</div>



    </div>
  );
};

export default App;
