import React, { useState, useEffect } from "react";

const Embed = ({ selectedKeys, filePath }) => {
  const [progress, setProgress] = useState(0);
  const [isVectorDbExisting, setIsVectorDbExisting] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [avgVectorLength, setAvgVectorLength] = useState(0);
  const [dbList, setDbList] = useState([]);
  const [selectedDb, setSelectedDb] = useState(null);

  useEffect(() => {
    checkVectorDb();
    fetchAvailableDatabases();
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
    try {
      const response = await fetch('http://10.0.0.252:4000/create_vector_database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: filePath, selected_keys: selectedKeys }),
      });
      if (response.ok) {
        checkVectorDb();
      } else {
        console.error('Error creating vector database');
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
    // Load the selected database for querying
  };

  return (
    <section id="embed">
      <h2 style={{ textAlign: "center" }}>Create Embeddings</h2>
      {isVectorDbExisting ? (
        <div>
          <p>Manage your vector database and view statistics</p>
          <button className="button" onClick={backupDatabase}>Backup Database</button>
          <button className="button" onClick={deleteDatabase}>Delete Database</button>
          <h3>Database Statistics</h3>
          <p>Total Documents: <span id="total_documents">{totalDocuments}</span></p>
          <p>Average Vector Length: <span id="avg_vector_length">{avgVectorLength}</span></p>
          <button className="button" onClick={getDbStats}>Refresh Stats</button>
        </div>
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <button id="createVectorDb" className="button" onClick={createVectorDatabase}>Create Vector DB</button>
        </div>
      )}
      <div id="progressBarContainer" style={{ visibility: progress > 0 ? "visible" : "hidden" }}>
        <div className="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r="45"></circle>
            <circle className="progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: 314 - (314 * progress) / 100 }}></circle>
          </svg>
          <div className="percentage">{progress}%</div>
        </div>
      </div>
      <div id="logContainer"></div>
      <div id="dashboardContainer" className="dashboard">
        <h3>Select Database</h3>
        <div className="db-list">
          {dbList.map((db, index) => (
            <div key={index} className="db-item" onClick={() => handleDbSelect(db)}>
              <p>{db.name}</p>
              <p>{db.size} bytes</p>
              <p>Uploaded: {db.upload_date}</p>
            </div>
          ))}
        </div>
        {selectedDb && <p>Selected Database: {selectedDb.name}</p>}
        <button className="button" onClick={() => alert('Querying the selected database')}>Query Database</button>
      </div>
    </section>
  );
};

export default Embed;
