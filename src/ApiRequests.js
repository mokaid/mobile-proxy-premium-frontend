import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import apiCall from './ApiCall';

// Utility function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const countryList = {
  usa: "USA",
  canada: "Canada",
  "united kingdom": "United Kingdom",
  germany: "Germany",
  france: "France",
  spain: "Spain",
  italy: "Italy",
  sweden: "Sweden",
  greece: "Greece",
  portugal: "Portugal",
  netherlands: "Netherlands",
  belgium: "Belgium",
  russia: "Russia",
  ukraine: "Ukraine",
  poland: "Poland",
  israel: "Israel",
  turkey: "Turkey",
  australia: "Australia",
  malaysia: "Malaysia",
  thailand: "Thailand",
  "south korea": "South Korea",
  japan: "Japan",
  philippines: "Philippines",
  singapore: "Singapore",
  china: "China",
  "hong kong": "Hong Kong",
  taiwan: "Taiwan",
  india: "India",
  pakistan: "Pakistan",
  iran: "Iran",
  indonesia: "Indonesia",
  azerbaijan: "Azerbaijan",
  kazakhstan: "Kazakhstan",
  uae: "UAE",
  mexico: "Mexico",
  brazil: "Brazil",
  argentina: "Argentina",
  chile: "Chile",
  peru: "Peru",
  ecuador: "Ecuador",
  colombia: "Colombia",
  "south africa": "South Africa",
  egypt: "Egypt",
  "saudi arabia": "Saudi Arabia",
  denmark: "Denmark",
  angola: "Angola",
  cameroon: "Cameroon",
  "central african republic": "Central African Republic",
  chad: "Chad",
  benin: "Benin",
  ethiopia: "Ethiopia",
  djibouti: "Djibouti",
  gambia: "Gambia",
  ghana: "Ghana",
  "côte d'ivoire": "Côte d'Ivoire",
  kenya: "Kenya",
  liberia: "Liberia",
  madagascar: "Madagascar",
  mali: "Mali",
  mauritania: "Mauritania",
  mauritius: "Mauritius",
  morocco: "Morocco",
  mozambique: "Mozambique",
  nigeria: "Nigeria",
  senegal: "Senegal",
  seychelles: "Seychelles",
  zimbabwe: "Zimbabwe",
  "south sudan": "South Sudan",
  sudan: "Sudan",
  togo: "Togo",
  tunisia: "Tunisia",
  uganda: "Uganda",
  zambia: "Zambia",
  afghanistan: "Afghanistan",
  bahrain: "Bahrain",
  bangladesh: "Bangladesh",
  armenia: "Armenia",
  bhutan: "Bhutan",
  myanmar: "Myanmar",
  cambodia: "Cambodia",
  georgia: "Georgia",
  iraq: "Iraq",
  jordan: "Jordan",
  lebanon: "Lebanon",
  maldives: "Maldives",
  mongolia: "Mongolia",
  oman: "Oman",
  qatar: "Qatar",
  vietnam: "Vietnam",
  turkmenistan: "Turkmenistan",
  uzbekistan: "Uzbekistan",
  yemen: "Yemen",
  albania: "Albania",
  andorra: "Andorra",
  austria: "Austria",
  "bosnia and herzegovina": "Bosnia and Herzegovina",
  bulgaria: "Bulgaria",
  belarus: "Belarus",
  croatia: "Croatia",
  cyprus: "Cyprus",
  "czech republic": "Czech Republic",
  estonia: "Estonia",
  finland: "Finland",
  hungary: "Hungary",
  iceland: "Iceland",
  ireland: "Ireland",
  latvia: "Latvia",
  liechtenstein: "Liechtenstein",
  lithuania: "Lithuania",
  luxembourg: "Luxembourg",
  malta: "Malta",
  monaco: "Monaco",
  moldova: "Moldova",
  montenegro: "Montenegro",
  norway: "Norway",
  romania: "Romania",
  serbia: "Serbia",
  slovakia: "Slovakia",
  slovenia: "Slovenia",
  switzerland: "Switzerland",
  macedonia: "Macedonia",
  bahamas: "Bahamas",
  belize: "Belize",
  "british virgin islands": "British Virgin Islands",
  "costa rica": "Costa Rica",
  cuba: "Cuba",
  dominica: "Dominica",
  haiti: "Haiti",
  honduras: "Honduras",
  jamaica: "Jamaica",
  aruba: "Aruba",
  panama: "Panama",
  "puerto rico": "Puerto Rico",
  "trinidad and tobago": "Trinidad and Tobago",
  fiji: "Fiji",
  "new zealand": "New Zealand",
  bolivia: "Bolivia",
  paraguay: "Paraguay",
  uruguay: "Uruguay",
  venezuela: "Venezuela",
};


const ApiRequests = ({ apiKey , style }) => {
  const [defaultCountry, setDefaultCountry] = useState('');
  const [defaultNumber, setDefaultNumber] = useState(1);
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
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
    setResults([]);
    const newResults = [];
    const currentInstanceId = uuidv4();
    setInstanceId(currentInstanceId);

    for (const row of rows) {
      for (let i = 0; i < row.number; i++) {
        const response = await apiCall(row.url, row.country || defaultCountry, currentInstanceId, apiKey);
        const timestamp = new Date().toLocaleTimeString();
        newResults.push({ ...response, timestamp });
        setResults([...newResults]); // Update results dynamically

        // Add a random delay between 1 to 3 seconds
        const randomDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        await delay(randomDelay);
      }
    }
    setIsFetching(false);
  };

  return (
    <div style={{ top:'50px', border:'1px solid grey',  width: '45%', padding: '20px', margin: '20px', backgroundColor: 'white', borderRadius: '8px' , ...style }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>API Requests</h2>
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
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
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
