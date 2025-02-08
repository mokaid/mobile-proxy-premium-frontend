import React, { useState } from "react";
import ApiRequests from "./ApiRequests";
import ChartsPage from "./Stats";
import ApiKeyValidation from "./ApiKeyValidation"; // Import the API key validation component

const App = () => {
  const [isValid, setIsValid] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  // const host = "http://localhost:3000"; // Update this for production
  // const host = 'http://localhost:3000';
  // const host = 'http://147.93.120.192:3000'
  const host = 'https://mobile-proxy-premium-backend-xx9m.onrender.com'
  // const host = 'https://alexproxypool.click';
  // host = '147.93.113.104'

  return (
    <>
      {/* Show API Key Validation First */}
      {!isValid ? (
        <ApiKeyValidation onValidate={setIsValid} host={host} />
      ) : (
        // Show the Dashboard UI After Successful Validation
        <div>
          <h1
            style={{
              position: "absolute",
              top: "10px",
              left: "20px",
              fontSize: "36px",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            <span style={{ color: "rgb(0, 123, 255)" }}>Alex</span>{" "}
            <span style={{ color: "rgb(40, 167, 69)" }}>Proxy Pool</span>{" "}
          </h1>

          {/* Toggle Button for API Requests & Charts */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setShowCharts(!showCharts)}
              style={{
                padding: "10px 15px",
                backgroundColor: showCharts ? "#007bff" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {showCharts ? "Show API Requests" : "Show Charts"}
            </button>
          </div>

          {/* Show API Requests or Charts Based on Toggle */}
          {!showCharts ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                justifyContent: "center",
                justifyItems: "center",
                backgroundColor: "#f5f5f5",
                padding: "20px",
                marginTop: "50px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((poolNumber) => (
                <div
                  key={poolNumber}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    width: "95%",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                >
                  <ApiRequests apiKey={isValid} host={host} poolNumber={poolNumber} />
                </div>
              ))}
            </div>
          ) : (
            <ChartsPage apiKey={isValid} host={host} />
          )}
        </div>
      )}
    </>
  );
};

export default App;
