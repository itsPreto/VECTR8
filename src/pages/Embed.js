import React, { useState, useEffect, useCallback } from "react";

const Embed = () => {
  const [progress, setProgress] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);
  const [isVectorDbExisting, setIsVectorDbExisting] = useState(false);

  const checkVectorDbExistence = useCallback(async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/check_vector_db');
      if (response.ok) {
        setIsVectorDbExisting(true);
      } else {
        setIsVectorDbExisting(false);
      }
    } catch (error) {
      console.error('Error checking vector database existence:', error);
      setIsVectorDbExisting(false);
    }
  }, []);

  useEffect(() => {
    console.log("Checking vector database existence...");
    checkVectorDbExistence();
  }, [checkVectorDbExistence]);

  const createVectorDatabase = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/create_vector_database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: fileInfo, selected_keys: selectedKeys })
      });
      if (response.ok) {
        const progressBarContainer = document.getElementById('progressBarContainer');
        progressBarContainer.style.visibility = 'visible';
        const eventSource = new EventSource('http://10.0.0.252:4000/progress');
        eventSource.onmessage = event => {
          const progress = parseFloat(event.data);
          if (isNaN(progress)) {
            eventSource.close();
            alert('Embeddings created successfully!');
            setProgress(100);
          } else {
            setProgress(progress);
          }
        };
      } else {
        alert('Error starting embeddings creation.');
      }
    } catch (error) {
      console.error('Error creating embeddings:', error);
    }
  };

  const backupDatabase = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/backup_db', { method: 'POST' });
      if (response.ok) {
        alert('Database backed up successfully!');
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
        } else {
          alert('Error deleting database.');
        }
      } catch (error) {
        console.error('Error deleting database:', error);
      }
    }
  };

  const displayDashboard = () => (
    <div>
      <p>Manage your vector database and view statistics</p>
      <button className="button" onClick={backupDatabase}>Backup Database</button>
      <button className="button" onClick={deleteDatabase}>Delete Database</button>
      <h3>Database Statistics</h3>
      <p>Total Documents: <span id="total_documents">0</span></p>
      <p>Average Vector Length: <span id="avg_vector_length">0</span></p>
    </div>
  );

  const displayCreateEmbeddingsView = () => (
    <div style={{ width: "100%", textAlign: "center" }}>
      <button id="createVectorDb" className="button" onClick={createVectorDatabase}>Create Vector DB</button>
    </div>
  );

  return (
    <section id="embed">
      <h2 style={{ textAlign: "center" }}>Create Embeddings</h2>
      {isVectorDbExisting ? displayDashboard() : displayCreateEmbeddingsView()}
      <div id="progressBarContainer" style={{ visibility: "hidden" }}>
        <div className="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r="45"></circle>
            <circle className="progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: 314 - (314 * progress) / 100 }}></circle>
          </svg>
          <div className="percentage">{progress}%</div>
        </div>
      </div>
      <div id="logContainer"></div>
      <div id="dashboardContainer" className="dashboard"></div>
    </section>
  );
};

export default Embed;
