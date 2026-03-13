import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function MetricsChart({ trainingResults }) {
  if (!trainingResults || !trainingResults.chart_data || !trainingResults.chart_data.metrics) {
    return null;
  }

  const data = trainingResults.chart_data.metrics;

  // Safe custom tooltip with null checks
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '0', color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      marginTop: '20px',
      border: '1px solid #ddd'
    }}>
      <h4 style={{ marginTop: 0 }}>📊 Performance Visualization</h4>
      
      {/* MSE Chart */}
      <div style={{ marginBottom: '30px' }}>
        <h5 style={{ color: '#666', fontSize: '14px' }}>Mean Squared Error (Lower is Better)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="MSE" fill="#FF5722" name="MSE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* R² Chart */}
      <div>
        <h5 style={{ color: '#666', fontSize: '14px' }}>R² Score (Higher is Better, Max 1.0)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="R2" fill="#4CAF50" name="R² Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '15px', 
        marginBottom: 0,
        fontStyle: 'italic'
      }}>
        📌 <strong>Note:</strong> Linear Regression and Decision Trees train in a single pass (no epochs). 
        This visualization shows final metrics across train/validation/test splits, 
        effectively demonstrating overfitting when validation/test metrics are significantly worse than training.
      </p>
    </div>
  );
}

export default MetricsChart;