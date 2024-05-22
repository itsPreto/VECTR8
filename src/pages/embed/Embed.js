import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatBytes, timeAgo } from '../../utils/FileInfo';

import './Embed.css';

const Embed = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [filePath, setFilePath] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isVectorDbExisting, setIsVectorDbExisting] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [avgVectorLength, setAvgVectorLength] = useState(0);
  const [dbList, setDbList] = useState([]);
  const [selectedDb, setSelectedDb] = useState(null);

  useEffect(() => {
    const storedSelectedKeys = localStorage.getItem('selectedKeys');
    const storedFilePath = localStorage.getItem('fileInfo');
    const storedSelectedDb = localStorage.getItem('selectedDb');

    if (storedSelectedKeys) {
      try {
        setSelectedKeys(JSON.parse(storedSelectedKeys));
      } catch (error) {
        console.error('Error parsing selectedKeys from localStorage', error);
      }
    }

    if (storedFilePath) {
      setFilePath(storedFilePath);
    }

    if (storedSelectedDb) {
      try {
        setSelectedDb(JSON.parse(storedSelectedDb));
      } catch (error) {
        console.error('Error parsing selectedDb from localStorage', error);
      }
    }

    if (storedSelectedKeys && storedFilePath) {
      checkVectorDb();
      fetchAvailableDatabases();
    }
  }, []);

  const fetchAvailableDatabases = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/list_vector_dbs');
      if (response.ok) {
        const data = await response.json();
        setDbList(data);
      } else {
        console.error('Error fetching database list');
      }
    } catch (error) {
      console.error('Error fetching database list:', error);
    }
  };

  const checkVectorDb = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/check_vector_db');
      if (response.ok) {
        setIsVectorDbExisting(true);
      } else {
        setIsVectorDbExisting(false);
      }
    } catch (error) {
      setIsVectorDbExisting(false);
    }
  };

  const createVectorDatabase = async () => {
    if (!filePath || !selectedKeys.length) {
      console.error('File path or selected keys are missing');
      return;
    }
    console.log("selected_keys:", selectedKeys);
    console.log("file_path:", filePath);

    try {
      const response = await fetch('http://10.0.0.252:4000/create_vector_database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: filePath, selected_keys: selectedKeys }),
      });

      if (response.ok) {
        console.log("Vector database created successfully");

        // Listen for progress updates via EventSource
        const eventSource = new EventSource('http://10.0.0.252:4000/progress');

        eventSource.onmessage = (event) => {
          const newProgress = parseFloat(event.data);
          if (!isNaN(newProgress)) {
            setProgress(newProgress);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Error with EventSource:', error);
          eventSource.close();
        };
      } else {
        console.error('Error creating vector database', response);
      }
    } catch (error) {
      console.error('Error creating vector database:', error);
    }
  };

  const backupDatabase = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/backup_db', { method: 'POST' });
      if (response.ok) {
        alert('Database backup created successfully');
      } else {
        alert('Error backing up database.');
      }
    } catch (error) {
      console.error('Error backing up database:', error);
    }
  };

  const deleteDatabase = async () => {
    if (window.confirm('Are you sure you want to delete the vector database?')) {
      try {
        const response = await fetch('http://10.0.0.252:4000/delete_db', { method: 'POST' });
        if (response.ok) {
          alert('Database deleted successfully!');
          setIsVectorDbExisting(false);
          fetchAvailableDatabases(); // Refresh the list of available databases
        } else {
          alert('Error deleting database.');
        }
      } catch (error) {
        console.error('Error deleting database:', error);
      }
    }
  };

  const getDbStats = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/db_stats');
      if (response.ok) {
        const data = await response.json();
        setTotalDocuments(data.total_documents);
        setAvgVectorLength(data.avg_vector_length);
      } else {
        console.error('Error fetching database stats');
      }
    } catch (error) {
      console.error('Error fetching database stats:', error);
    }
  };

  const handleDbSelect = (db) => {
    setSelectedDb(db);
    localStorage.setItem('selectedDb', JSON.stringify(db));
    navigate('/query'); // Navigate to the Preview page
  };

  return (
    <section id="embed" className="embed-section">
      <h2 className="embed-title">Create Embeddings</h2>
      {isVectorDbExisting ? (
        <div className="embed-container">
          <p>Manage your vector database and view statistics</p>
          <div className="button-group">
            <button className="button" onClick={backupDatabase}>Backup Database</button>
            <button className="button" onClick={deleteDatabase}>Delete Database</button>
          </div>
          <h3 className="stats-title">Database Statistics</h3>
          <p>Total Documents: <span id="total_documents">{totalDocuments}</span></p>
          <p>Average Vector Length: <span id="avg_vector_length">{avgVectorLength}</span></p>
          <button className="button" onClick={getDbStats}>Refresh Stats</button>
        </div>
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <button id="createVectorDb" className="button" onClick={createVectorDatabase}>Create Vector DB</button>
        </div>
      )}
      <div id="progressBarContainer" className={`progress-bar-container ${progress > 0 ? 'visible' : ''}`}>
        <div className="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r="45"></circle>
            <circle className="progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: 314 - (314 * progress) / 100 }}></circle>
          </svg>
          <div className="percentage">{progress.toFixed(2)}%</div>
        </div>
      </div>
      <div id="logContainer"></div>
      <div id="dashboardContainer" className="dashboard">
        <h3>Select Database</h3>
        <div className="db-list">
          {dbList.map((db, index) => (
            <div 
              key={index} 
              className={`db-item ${selectedDb && selectedDb.name === db.name ? 'active' : ''} ${selectedDb && selectedDb.name === db.name ? 'pulse' : ''}`} 
              onClick={() => handleDbSelect(db)}
            >
              <p>{db.name}</p>
              <p>{formatBytes(db.size)}</p>
              <p>Uploaded: {timeAgo(db.upload_date)}</p>
              {selectedDb && selectedDb.name === db.name && <span className="active-indicator"></span>}
            </div>
          ))}
        </div>
        {selectedDb && <p>Selected Database: {selectedDb.name}</p>}
      </div>
    </section>
  );
};

export default Embed;
