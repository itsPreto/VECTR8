import React, { useState, useEffect, useCallback } from "react";
import { JSONTree } from "react-json-tree";
import { motion } from 'framer-motion';
import { formatBytes, timeAgo } from '../../utils/FileInfo';
import Overlay from '../overlay/Overlay';
import Embed from '../embed/Embed';
import './Preview.css';

const customTheme = {
  scheme: 'material',
  author: 'Material Theme',
  base00: '#FFFFFF',
  base01: '#FAFAFA',
  base02: '#E0E0E0',
  base03: '#BDBDBD',
  base04: '#90A4AE',
  base05: '#212121',
  base06: '#757575',
  base07: '#263238',
  base08: '#FF5252',
  base09: '#FF9800',
  base0A: '#FFEB3B',
  base0B: '#8BC34A',
  base0C: '#00BCD4',
  base0D: '#2196F3',
  base0E: '#673AB7',
  base0F: '#E91E63',
};

const Preview = ({ previewData, filePath, fileSize }) => {
  const [selectedKeys, setSelectedKeys] = useState(() => {
    const savedKeys = localStorage.getItem('selectedKeys');
    return savedKeys ? JSON.parse(savedKeys) : (previewData.keys || []);
  });

  const [selectableKeys, setSelectableKeys] = useState([]);

  const [document, setDocument] = useState(() => {
    const savedDocument = localStorage.getItem('document');
    return savedDocument ? JSON.parse(savedDocument) : {};
  });

  const [embeddings, setEmbeddings] = useState(() => {
    const savedEmbeddings = localStorage.getItem('embeddings');
    return savedEmbeddings ? JSON.parse(savedEmbeddings) : null;
  });

  useEffect(() => {
    if (previewData) {
      const keys = Array.isArray(previewData) ? previewData : Object.keys(previewData || {});
      setSelectableKeys(keys);
    }
  }, [previewData]);

  useEffect(() => {
    localStorage.setItem('selectedKeys', JSON.stringify(selectedKeys));
  }, [selectedKeys]);

  const [ipAddress] = useState(() => localStorage.getItem("ipAddress") || "127.0.0.1");
  const [tokenCount, setTokenCount] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showEmbed] = useState(false);

  const updatePreviews = useCallback(async () => {
    if (!filePath) {
      console.error('File path is undefined');
      return;
    }
    try {
      const data = { file_path: filePath, selected_keys: selectedKeys };
      console.log('Sending data:', data);

      const response = await fetch(`http://${ipAddress}:4000/preview_document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Previewed document successfully.", result);
        const docObject = selectedKeys.reduce((acc, key) => {
          acc[key] = result.document[key];
          return acc;
        }, {});
        setDocument(docObject);
        setEmbeddings(result.embeddings);
        setTokenCount(result.token_count);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error previewing document:', error);
    }
  }, [filePath, ipAddress, selectedKeys]);

  useEffect(() => {
    if (selectedKeys.length > 0) {
      updatePreviews();
    }
  }, [selectedKeys, filePath, updatePreviews]);

  useEffect(() => {
    localStorage.setItem('selectedKeys', JSON.stringify(selectedKeys));
  }, [selectedKeys]);

  useEffect(() => {
    localStorage.setItem('document', JSON.stringify(document));
  }, [document]);

  useEffect(() => {
    localStorage.setItem('embeddings', JSON.stringify(embeddings));
  }, [embeddings]);

  useEffect(() => {
    if (previewData) {
      const keys = Array.isArray(previewData) ? previewData : Object.keys(previewData || {});
      setSelectableKeys(keys);
    }
  }, [previewData]);


  const handleKeySelection = (key) => {
    setSelectedKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const displayPreview = () => {
    if (!previewData || !Array.isArray(selectableKeys)) {
      return <p className="no-data-available-label">No preview data available</p>;
    }
    const filteredKeys = selectableKeys.filter((key) =>
      key.toLowerCase().includes(filterText.toLowerCase())
    );
    const selectedKeysSet = new Set(selectedKeys);
    const sortedKeys = [
      ...selectedKeys.filter((key) => filteredKeys.includes(key)),
      ...filteredKeys.filter((key) => !selectedKeysSet.has(key)),
    ];

    return sortedKeys.map((key) => (
      <motion.div
        key={key}
        layout
        className={`card ${selectedKeys.includes(key) ? 'selected' : ''}`}
        onClick={() => handleKeySelection(key)}
      >
        <p className="card-text">{key}</p>
      </motion.div>
    ));
  };

  const displayDocument = () => {
    return (
      <JSONTree data={document} hideRoot={true} theme={customTheme} />
    );
  };

  const displayEmbeddings = () => {
    return (
      <JSONTree data={embeddings} hideRoot={true} theme={customTheme} />
    );
  };

  const handleSelectAll = () => {
    setSelectedKeys(selectableKeys);
  };

  const handleDeselectAll = () => {
    setSelectedKeys([]);
    setDocument({});
    setEmbeddings(null);
  };

  const handleToggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <section id="preview" className="preview-section">
      <div className="file-details">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p><strong>File:</strong> {filePath} </p>
          <div style={{ margin: '0 10px', height: '20px', borderLeft: '1px solid black' }}></div>
          <p style={{ color: '#e8711a' }}>{formatBytes(fileSize)}</p>
          {tokenCount !== null && (
            <>
              <div style={{ margin: '0 10px', height: '20px', borderLeft: '1px solid black' }}></div>
              <p><strong>Tokens:</strong> {tokenCount}</p>
            </>
          )}
        </div>
        <div className="controls">
          <input
            type="text"
            placeholder="Filter keys"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
          <button className="button" onClick={handleSelectAll}>Select All</button>
          <button className="button" onClick={handleDeselectAll}>Deselect All</button>
          <button className="question-mark-button" onClick={handleToggleOverlay}>?</button>
        </div>
      </div>
      <div id="previewContainer" className="preview-container">
        <div className="preview-column">
          <h3 className="heading">Select Embedding Keys</h3>
          <div id="textKeys" className="cards-container">
            {displayPreview()}
          </div>
        </div>
        <div className="preview-column">
          <h3 className="heading">Generated Document</h3>
          <div id="documentPreview" className="document-preview">
            {document && displayDocument()}
          </div>
        </div>
        <div className="preview-column">
          <h3 className="heading">Generated Embedding</h3>
          <div id="vectorEmbeddings" className="vector-embeddings">
            {embeddings && displayEmbeddings()}
          </div>
        </div>
      </div>
      <Overlay showOverlay={showOverlay} handleToggleOverlay={handleToggleOverlay} />
      {showEmbed && <Embed selectedKeys={selectedKeys} filePath={filePath} />}
    </section>
  );
};

export default Preview;
