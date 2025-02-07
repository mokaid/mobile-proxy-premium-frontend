import React, { useState } from "react";

const ApiKeyValidation = ({ onValidate , host }) => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to validate API key
  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setError("API Key cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${host}/api/validate-key`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        onValidate(apiKey);
      } else {
        setError("Invalid API Key. Please try again.");
      }
    } catch (error) {
      console.error("Validation Error:", error);
      setError("Error validating API Key. Check your connection.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa", // Matching inner dashboard background
      }}
    >
      <div
        style={{
          background: "#ffffff", // White container like the inner page
          borderRadius: "8px",
          padding: "30px",
          width: "400px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          border: "1px solid #ddd", // Light border for clean UI
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          <span style={{ color: "#007bff" }}>Alex</span>{" "}
          <span style={{ color: "#28a745" }}>Proxy Pool</span>
        </h1>

        {/* Input Field */}
        <input
          type="password" // Shows asterisks
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold", // Bold text
            borderRadius: "4px",
            border: "1px solid #ced4da",
            outline: "none",
            backgroundColor: "#ffffff",
            color: "#495057", // Darker text for readability
            textAlign: "center",
            marginBottom: "15px",
          }}
        />

        {error && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "14px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}

        {/* Validate Button */}
        <button
          onClick={validateApiKey}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "#fff",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          {loading ? "Validating..." : "Validate API Key"}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyValidation;
