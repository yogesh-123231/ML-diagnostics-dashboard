import React, { useState } from 'react';
import axios from 'axios';
import UploadForm from './components/UploadForm';
import MetricsChart from './components/MetricsChart';
import './App.css';
import API_BASE_URL from './config';

function App() {
  const [eda, setEda] = useState(null);
  const [trainingResults, setTrainingResults] = useState(null);
  const [modelType, setModelType] = useState('linear');
  const [maxDepth, setMaxDepth] = useState(3);
  const [training, setTraining] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const handleUploadSuccess = (edaData) => {
    setEda(edaData);
    setCleaned(false);
    setTrainingResults(null);
  };

  const handleClean = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/clean?method=mean`);
      alert('✅ Data cleaned successfully!');
      setCleaned(true);
      console.log(response.data);
    } catch (error) {
      console.error('Clean error:', error);
      alert('❌ Cleaning failed - check console');
    }
  };

  const handleTrain = async () => {
    if (!cleaned) {
      alert('⚠️ Please clean the data first!');
      return;
    }

    setTraining(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/train`, null, {
        params: {
          model_type: modelType,
          target_col: 'target',
          max_depth: maxDepth,
          min_samples_leaf: 1
        }
      });
      
      if (response.data.error) {
        alert('❌ Training failed: ' + response.data.error);
      } else {
        setTrainingResults(response.data);
        alert('✅ Training completed!');
      }
    } catch (error) {
      console.error('Training error:', error);
      alert('❌ Training failed - check console');
    }
    setTraining(false);
  };

  return (
    <div className="App" style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#2196F3',
        color: 'white',
        borderRadius: '8px'
      }}>
        <h1>🔬 ML Training Diagnostics Dashboard</h1>
        <p>Upload data → Clean → Train → Analyze</p>
        <small style={{ fontSize: '12px', opacity: 0.8 }}>
          API: {API_BASE_URL}
        </small>
      </div>
      
      <UploadForm onUploadSuccess={handleUploadSuccess} apiBaseUrl={API_BASE_URL} />
      
      {eda && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #2196F3'
        }}>
          <h3>📊 Step 2: Data Summary</h3>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Shape:</strong> {eda.shape[0]} rows × {eda.shape[1]} columns</p>
            <p><strong>Columns:</strong> {eda.columns.join(', ')}</p>
            <p><strong>Data Types:</strong></p>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(eda.dtypes, null, 2)}
            </pre>
            <p><strong>Missing Values:</strong></p>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(eda.missing_count, null, 2)}
            </pre>
          </div>
          
          <button 
            onClick={handleClean}
            disabled={cleaned}
            style={{
              padding: '10px 20px',
              backgroundColor: cleaned ? '#4CAF50' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: cleaned ? 'default' : 'pointer',
              marginTop: '15px',
              fontSize: '14px'
            }}
          >
            {cleaned ? '✅ Data Cleaned!' : '🧹 Clean Data (Fill Missing with Mean)'}
          </button>
        </div>
      )}
      
      {cleaned && (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #FF9800', 
          borderRadius: '8px', 
          marginBottom: '20px',
          backgroundColor: '#fff3e0'
        }}>
          <h3>⚙️ Step 3: Configure & Train Model</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
              Model Type:
            </label>
            <select 
              value={modelType} 
              onChange={(e) => setModelType(e.target.value)}
              style={{ 
                padding: '8px', 
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="linear">Linear Regression</option>
              <option value="tree">Decision Tree Regressor</option>
            </select>
          </div>
          
          {modelType === 'tree' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
                Max Depth:
              </label>
              <input 
                type="number" 
                value={maxDepth} 
                onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                min="1"
                max="20"
                style={{ 
                  padding: '8px', 
                  width: '80px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
              <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                (Higher = more complex model, may overfit)
              </span>
            </div>
          )}
          
          <button 
            onClick={handleTrain} 
            disabled={training}
            style={{
              padding: '12px 24px',
              backgroundColor: training ? '#ccc' : '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: training ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {training ? '⏳ Training Model...' : '🚀 Train Model'}
          </button>
        </div>
      )}
      
      {trainingResults && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e8f5e9', 
          borderRadius: '8px',
          border: '2px solid #4CAF50'
        }}>
          <h3>📈 Step 4: Training Results</h3>
          
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
            <h4>Model Information</h4>
            <p><strong>Model Type:</strong> {trainingResults.model_type === 'linear' ? 'Linear Regression' : 'Decision Tree'}</p>
            {trainingResults.hyperparameters.max_depth && (
              <p><strong>Max Depth:</strong> {trainingResults.hyperparameters.max_depth}</p>
            )}
            <p><strong>Timestamp:</strong> {new Date(trainingResults.timestamp).toLocaleString()}</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
            <h4>📊 Performance Metrics</h4>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
              MSE (Mean Squared Error) - Lower is better | R² Score - Higher is better (max 1.0)
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Dataset</th>
                  <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>MSE</th>
                  <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>R² Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>Training</td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {trainingResults.metrics.train_mse.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {trainingResults.metrics.train_r2.toFixed(4)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#fffde7' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>Validation</td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {trainingResults.metrics.val_mse.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {trainingResults.metrics.val_r2.toFixed(4)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>Test</td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {trainingResults.metrics.test_mse.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {trainingResults.metrics.test_r2.toFixed(4)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* NEW: Add Metrics Chart */}
          <MetricsChart trainingResults={trainingResults} />
          
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginTop: '15px' }}>
            <h4>🔍 Diagnostics & Recommendations</h4>
            {trainingResults.diagnostics.messages.map((msg, idx) => (
              <div key={idx} style={{ 
                padding: '12px', 
                backgroundColor: msg.includes('✅') ? '#e8f5e9' : msg.includes('⚠️') ? '#fff3e0' : '#ffebee',
                borderRadius: '4px',
                marginBottom: '10px',
                borderLeft: '4px solid ' + (msg.includes('✅') ? '#4CAF50' : msg.includes('⚠️') ? '#FF9800' : '#f44336')
              }}>
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!eda && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#999',
          border: '2px dashed #ccc',
          borderRadius: '8px'
        }}>
          <h3>👆 Start by uploading a CSV file</h3>
          <p>Your ML training diagnostics journey begins here!</p>
        </div>
      )}
    </div>
  );
}

export default App;