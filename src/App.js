import React, { useState } from 'react';
import ApiRequests from './ApiRequests';

const App = () => {
  const [apiKey, setApiKey] = useState(''); // Initialize `apiKey` state with useState

  return (
    <div>
      {/* API Key Input */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
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

      {/* Two instances of ApiRequests */}
      {/* <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}> */}
        <ApiRequests apiKey={apiKey} style={{ position: 'absolute', left: '0' , top:'50px' }} />
        <ApiRequests apiKey={apiKey} style={{ position: 'absolute', right: '0' , top:'50px',}}  />
   
      {/* </div> */}
    </div>
  );
};

export default App;
