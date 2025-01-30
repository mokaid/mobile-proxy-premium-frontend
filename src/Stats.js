import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChartsPage = ({ apiKey , host}) => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [successData, setSuccessData] = useState({ successRate: 0, failureRate: 0 });
    const [providerData, setProviderData] = useState([]);
    const [providerUsage, setProviderUsage] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!apiKey) return;
        
        try {
            const headers = { Authorization: `Bearer ${apiKey}` };
            
            const [successRes, providerRes, usageRes] = await Promise.all([
                axios.get(`${host}/api/stats/success-rate?startDate=${startDate}&endDate=${endDate}`, { headers }).catch(() => ({ data: { successRate: 0, failureRate: 0 } })),
                axios.get(`${host}/api/stats/providers?startDate=${startDate}&endDate=${endDate}`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${host}/api/stats/provider-usage?startDate=${startDate}&endDate=${endDate}`, { headers }).catch(() => ({ data: [] }))
            ]);
            
            setSuccessData(successRes.data || { successRate: 0, failureRate: 0 });
            setProviderData(providerRes.data || []);
            setProviderUsage(usageRes.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please check your API key and backend service.");
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [startDate, endDate, apiKey]);

    const tableContainer = {
        margin: '20px auto',
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '16px',
        textAlign: 'left'
    };

    const thTdStyle = {
        padding: '12px',
        border: '1px solid #ddd'
    };

    const headerStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px',
        textAlign: 'left'
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Statistics Dashboard</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>End Date:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div style={tableContainer}>
                <h2>Success vs Failure Rate</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr><th style={headerStyle}>Success Rate</th><th style={headerStyle}>Failure Rate</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={thTdStyle}>{successData.successRate}</td><td style={thTdStyle}>{successData.failureRate}</td></tr>
                    </tbody>
                </table>
            </div>

            <div style={tableContainer}>
                <h2>Provider Performance</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr><th style={headerStyle}>Provider</th><th style={headerStyle}>Total</th><th style={headerStyle}>Success Rate</th></tr>
                    </thead>
                    <tbody>
                        {providerData.map((p, index) => (
                            <tr key={index}><td style={thTdStyle}>{p.provider}</td><td style={thTdStyle}>{p.total}</td><td style={thTdStyle}>{(p.successRate).toFixed(2)}%</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={tableContainer}>
                <h2>Provider Usage</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr><th style={headerStyle}>Provider</th><th style={headerStyle}>Count</th></tr>
                    </thead>
                    <tbody>
                        {providerUsage.map((p, index) => (
                            <tr key={index}><td style={thTdStyle}>{p._id}</td><td style={thTdStyle}>{p.count}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChartsPage;
