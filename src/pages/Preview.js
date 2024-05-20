import React, { useState, useEffect, useRef } from "react";
import FlipMove from "react-flip-move";
import { JSONTree } from "react-json-tree";
import ForceGraph3D from 'react-force-graph-2d';
import SpriteText from 'three-spritetext';
import screenfull from 'screenfull';

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

const mindmapData = [
  { id: 'root', label: 'Embeddings Dimensions', parent: null, color: '#00000000' },
  { id: 'search', label: 'SEARCH', parent: 'root', color: '#ffff00' },
  { id: 'search-detail1', label: 'High-dimensional embeddings improve search accuracy', parent: 'search', color: '#ffff66' },
  { id: 'search-detail2', label: 'Better relevance ranking for complex queries', parent: 'search', color: '#ffff66' },
  { id: 'search-example', label: 'Example: Google search engine optimizing results', parent: 'search', color: '#ffff66' },
  { id: 'clustering', label: 'CLUSTERING', parent: 'root', color: '#daccff' },
  { id: 'clustering-detail1', label: 'Enable finer distinctions between clusters', parent: 'clustering', color: '#51962e' },
  { id: 'clustering-detail2', label: 'Improved grouping of semantically similar texts', parent: 'clustering', color: '#2fd12f' },
  { id: 'clustering-example', label: 'Example: Organizing customer feedback into coherent topics', parent: 'clustering', color: '#6bcf6b' },
  { id: 'recommendations', label: 'RECOMMENDATIONS', parent: 'root', color: '#cc99ff' },
  { id: 'recommendations-detail1', label: 'Enhance systems by understanding user preferences better', parent: 'recommendations', color: '#cc99ff' },
  { id: 'recommendations-detail2', label: 'More accurate and personalized recommendations', parent: 'recommendations', color: '#cc99ff' },
  { id: 'recommendations-example', label: 'Example: Netflix recommending shows', parent: 'recommendations', color: '#cc99ff' },
  { id: 'anomaly-detection', label: 'ANOMALY DETECTION', parent: 'root', color: '#ff99ff' },
  { id: 'anomaly-detection-detail1', label: 'Improve detection of subtle anomalies', parent: 'anomaly-detection', color: '#ff99ff' },
  { id: 'anomaly-detection-detail2', label: 'Better identification of outliers', parent: 'anomaly-detection', color: '#ff99ff' },
  { id: 'anomaly-detection-example', label: 'Example: Fraud detection in financial transactions', parent: 'anomaly-detection', color: '#ff99ff' },
  { id: 'diversity-measurement', label: 'DIVERSITY MEASUREMENT', parent: 'root', color: '#ff6699' },
  { id: 'diversity-measurement-detail1', label: 'Provide a detailed measure of diversity', parent: 'diversity-measurement', color: '#ff6699' },
  { id: 'diversity-measurement-detail2', label: 'Better analysis of similarity distributions in datasets', parent: 'diversity-measurement', color: '#ff6699' },
  { id: 'diversity-measurement-example', label: 'Example: Assessing diversity in hiring practices', parent: 'diversity-measurement', color: '#ff6699' },
  { id: 'classification', label: 'CLASSIFICATION', parent: 'root', color: '#ff9966' },
  { id: 'classification-detail1', label: 'Lead to more accurate classification of text', parent: 'classification', color: '#ff9966' },
  { id: 'classification-detail2', label: 'Improved sentiment analysis', parent: 'classification', color: '#ff9966' },
  { id: 'classification-example', label: 'Example: Classifying customer reviews', parent: 'classification', color: '#ff9966' },
  { id: 'embedding-dimensionality', label: 'EMBEDDING DIMENSIONALITY', parent: 'root', color: '#ff9966' },
  { id: 'model-architecture', label: 'Model Architecture and Training Objectives', parent: 'embedding-dimensionality', color: '#ffcc99' },
  { id: 'model-architecture-detail1', label: 'Different models have unique designs that dictate dimensions', parent: 'model-architecture', color: '#ffcc99' },
  { id: 'model-architecture-example1', label: 'BERT (768 dimensions)', parent: 'model-architecture', color: '#ffcc99' },
  { id: 'model-architecture-example2', label: 'GPT-3 (2048 dimensions)', parent: 'model-architecture', color: '#ffcc99' },
  { id: 'task-specific-training', label: 'Task-Specific Training', parent: 'embedding-dimensionality', color: '#ffcc99' },
  { id: 'task-specific-training-detail1', label: 'Complex tasks often require higher dimensions for nuanced understanding', parent: 'task-specific-training', color: '#ffcc99' },
  { id: 'capacity-expressiveness', label: 'Capacity and Expressiveness', parent: 'embedding-dimensionality', color: '#ffcc99' },
  { id: 'higher-dimensionality', label: 'Higher Dimensionality', parent: 'capacity-expressiveness', color: '#ffcc99' },
  { id: 'higher-dimensionality-detail1', label: 'Captures more detailed information', parent: 'higher-dimensionality', color: '#ffcc99' },
  { id: 'higher-dimensionality-detail2', label: 'Essential for tasks requiring deep semantic understanding', parent: 'higher-dimensionality', color: '#ffcc99' },
  { id: 'lower-dimensionality', label: 'Lower Dimensionality', parent: 'capacity-expressiveness', color: '#ffcc99' },
  { id: 'lower-dimensionality-detail1', label: 'Sufficient for simpler tasks', parent: 'lower-dimensionality', color: '#ffcc99' },
  { id: 'lower-dimensionality-detail2', label: 'Reduces computational cost but may miss finer details', parent: 'lower-dimensionality', color: '#ffcc99' },
  { id: 'computational-efficiency', label: 'Computational Efficiency', parent: 'embedding-dimensionality', color: '#ffcc99' },
  { id: 'memory-storage', label: 'Memory and Storage', parent: 'computational-efficiency', color: '#ffcc99' },
  { id: 'memory-storage-detail1', label: 'Higher dimensions require more memory and storage', parent: 'memory-storage', color: '#ffcc99' },
  { id: 'memory-storage-detail2', label: 'Impacts scalability', parent: 'memory-storage', color: '#ffcc99' },
  { id: 'processing-time', label: 'Processing Time', parent: 'computational-efficiency', color: '#ffcc99' },
  { id: 'processing-time-detail1', label: 'Higher dimensions increase computational load', parent: 'processing-time', color: '#ffcc99' },
  { id: 'processing-time-detail2', label: 'Affects real-time application performance', parent: 'processing-time', color: '#ffcc99' }
];

const Preview = ({ previewData, filePath, fileName, fileSize }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [document, setDocument] = useState({});
  const [embeddings, setEmbeddings] = useState(null);
  const [tokenCount, setTokenCount] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const graphRef = useRef();
  const graphContainerRef = useRef();

  useEffect(() => {
    if (selectedKeys.length > 0) {
      updatePreviews();
    }
  }, [selectedKeys]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && screenfull.isFullscreen) {
        screenfull.exit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        if (screenfull.isFullscreen) {
          graphRef.current.width = window.innerWidth;
          graphRef.current.height = window.innerHeight;
        } else {
          graphRef.current.width = graphContainerRef.current.clientWidth;
          graphRef.current.height = graphContainerRef.current.clientHeight;
        }
      });
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change');
      }
    };
  }, []);

  const openFullscreen = () => {
    var elem = document.getElementById("graph");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    elem.style.width = '100%';
    elem.style.height = '100%';
  };

  const handleKeySelection = (key) => {
    setSelectedKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const updatePreviews = async () => {
    if (!filePath) {
      console.error('File path is undefined');
      return;
    }
    try {
      const data = { file_path: filePath, selected_keys: selectedKeys };
      console.log('Sending data:', data);

      const response = await fetch('http://10.0.0.252:4000/preview_document', {
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
  };

  const displayPreview = () => {
    if (!previewData) {
      return <p>No preview data available</p>;
    }
    const keys = Array.isArray(previewData) ? previewData : Object.keys(previewData);
    const filteredKeys = keys.filter((key) =>
      key.toLowerCase().includes(filterText.toLowerCase())
    );
    const selectedKeysSet = new Set(selectedKeys);
    const sortedKeys = [
      ...selectedKeys.filter((key) => filteredKeys.includes(key)),
      ...filteredKeys.filter((key) => !selectedKeysSet.has(key)),
    ];

    return sortedKeys.map((key) => (
      <div
        key={key}
        style={{
          ...styles.card,
          backgroundColor: selectedKeys.includes(key) ? '#f0c239' : '#ffffff',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          ...(selectedKeys.includes(key) && { transform: 'scale(1.05)' }),
        }}
        onClick={() => handleKeySelection(key)}
      >
        <p style={styles.cardText}>{key}</p>
      </div>
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
    const keys = Array.isArray(previewData) ? previewData : Object.keys(previewData);
    setSelectedKeys(keys);
  };

  const handleDeselectAll = () => {
    setSelectedKeys([]);
    setDocument({});
    setEmbeddings(null);
  };

  const handleToggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const handleToggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(graphContainerRef.current);
    }
  };

  const nodes = Object.keys(document);

  const navigateGraph = (direction) => {
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % nodes.length;
    } else if (direction === 'prev') {
      newIndex = (currentIndex - 1 + nodes.length) % nodes.length;
    }

    const nodeKey = nodes[newIndex];
    const nodeElement = document.getElementById(nodeKey);

    if (nodeElement && graphRef.current) {
      graphRef.current.zoomOut();
      setTimeout(() => {
        const { left, top, width, height } = nodeElement.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;

        graphRef.current.setTransform(x, y, 1);
        graphRef.current.zoomIn();
        setCurrentIndex(newIndex);
      }, 500);
    }
  };

  const graphData = {
    nodes: mindmapData.map(node => ({ id: node.id, name: node.label, color: node.color })),
    links: mindmapData
      .filter(node => node.parent)
      .map(node => ({ source: node.parent, target: node.id }))
  };

  return (
    <section id="preview" style={styles.previewSection}>
      <div style={styles.fileDetails}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p><strong>File:</strong> {filePath} </p>
          <div style={{ margin: '0 10px', height: '20px', borderLeft: '1px solid black' }}></div>
          <p><strong>Size:</strong> {fileSize} bytes</p>
        </div>
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Filter keys"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={styles.filterInput}
          />
          <button onClick={handleSelectAll} style={styles.button}>Select All</button>
          <button onClick={handleDeselectAll} style={styles.button}>Deselect All</button>
          <button onClick={handleToggleOverlay} style={styles.questionMarkButton}>?</button>
        </div>
      </div>
      <div id="previewContainer" style={styles.previewContainer}>
        <div className="preview-column" style={styles.previewColumn}>
          <h3 style={styles.heading}>Select Embedding Keys</h3>
          <FlipMove id="textKeys" style={styles.cardsContainer}>
            {displayPreview()}
          </FlipMove>
        </div>
        <div className="preview-column" style={styles.previewColumn}>
          <h3 style={styles.heading}>Generated Document</h3>
          <div id="documentPreview" style={styles.documentPreview}>
            {document && displayDocument()}
          </div>
        </div>
        <div className="preview-column" style={styles.previewColumn}>
          <h3 style={styles.heading}>Generated Embedding</h3>
          <div id="vectorEmbeddings" style={styles.vectorEmbeddings}>
            {embeddings && displayEmbeddings()}
          </div>
        </div>
      </div>
      {showOverlay && (
        <div style={{ ...styles.overlay, transition: 'opacity 0.5s ease' }}>
          <div style={{ ...styles.overlayContent, transition: 'transform 0.5s ease, opacity 0.5s ease' }}>
            <button onClick={handleToggleOverlay} style={styles.closeButton}>X</button>
            <h2 style={{ transition: 'opacity 0.5s ease' }}>Woah, that's a lot of dimensions...</h2>
            <div style={{ display: 'flex', flexFlow: 'row nowrap', textAlign: '-webkit-center', alignItems: 'flex-start', gap: '2rem', padding: '20px', transition: 'opacity 0.5s ease' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'opacity 0.5s ease' }}>
                <div>Search</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Perform semantic search using vector similarity</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'opacity 0.5s ease' }}>
                <div>Clustering</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Group similar vectors based on their proximity in the embedding space</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'opacity 0.5s ease' }}>
                <div>Recommendations</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Generate personalized recommendations using vector similarity</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'opacity 0.5s ease' }}>
                <div>Anomaly Detection</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Identify outlier vectors that deviate from the normal patterns</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'opacity 0.5s ease' }}>
                <div>Diversity Measurement</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Quantify the diversity of vectors in the embedding space</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'opacity 0.5s ease' }}>
                <div>Classification</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Classify vectors into predefined categories based on their embeddings</div>
              </div>
            </div>
            <div style={{ background: "radial-gradient(#32473387, rgb(38 18 225 / 47%))", maxHeight: "50vh", borderRadius: "10px", padding: "20px", width: "77vw", boxShadow: "0px 0px 10px #0000008f", transition: 'opacity 0.5s ease' }} ref={graphContainerRef}>
              <div id="graph" style={{ width: "100%", height: "100%", transition: 'opacity 0.5s ease' }}>
                <div style={styles.navigationButtons}>
                  <button onClick={() => navigateGraph('prev')} style={styles.navButton}>←</button>
                  <button onClick={() => navigateGraph('next')} style={styles.navButton}>→</button>
                  <button onClick={handleToggleFullScreen} style={styles.fullScreenButton}>⛶</button>
                </div>

                <ForceGraph3D
                  ref={graphRef}
                  nodeRelSize={5}
                  linkWidth={1.5}
                  width={graphRef.current ? graphRef.current.clientWidth : 1000}
                  height={graphRef.current ? graphRef.current.clientHeight : 300}
                  graphData={graphData}
                  nodeAutoColorBy="color"
                  linkColor={() => '#cccccc'}
                  linkDirectionalParticles={4}
                  linkDirectionalParticleSpeed={d => d.value * 0.001}
                  nodeLabel="name"
                  nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color;
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                  }}
                  nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                  }}
                  nodeThreeObject={node => {
                    const sprite = new SpriteText(node.name);
                    sprite.color = node.color;
                    sprite.textHeight = 8;
                    return sprite;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const styles = {
  previewSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    transition: 'background-color 0.3s ease',
  },
  fileDetails: {
    textAlign: "center",
    padding: "16px",
    background: "#cce5ff",
    width: "400px",
    borderRadius: "8px",
    transition: 'background-color 0.3s ease',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0',
  },
  filterInput: {
    padding: '8px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    transition: 'border-color 0.3s ease',
  },
  button: {
    padding: '8px 16px',
    margin: '0 5px',
    borderRadius: '4px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
  },
  questionMarkButton: {
    padding: '8px 12px',
    margin: '0 5px',
    borderRadius: '50%',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: '18px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
  },
  fullScreenButton: {
    padding: '8px 12px',
    margin: '0 5px',
    borderRadius: '50%',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: '18px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: "40vh",
    width: "100%",
  },
  previewColumn: {
    flex: '0 0 30%',
    margin: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    overflow: 'hidden',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  heading: {
    marginBottom: '20px',
    color: '#333333',
    fontFamily: 'Roboto, sans-serif',
    transition: 'color 0.3s ease',
  },
  documentPreview: {
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: 'transparent',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
  },
  documentRow: {
    marginBottom: '10px',
    transition: 'margin-bottom 0.3s ease',
  },
  vectorEmbeddings: {
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    maxHeight: '67vh',
    backgroundColor: '#f5f5f5',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
  },
  pre: {
    margin: 0,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: 'Courier New, Courier, monospace',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
    gap: '10px',
    flexDirection: 'column',
    alignItems: "center",
    transition: 'gap 0.3s ease',
  },
  card: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '6px',
    marginRight: '6px',
    width: '80px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#f0f0f0',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  },
  cardText: {
    margin: 0,
    fontFamily: 'Roboto, sans-serif',
    color: '#555',
    transition: 'color 0.3s ease',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    transition: 'opacity 0.5s ease',
  },
  overlayContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ff5e5e',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#d9534f',
      transform: 'scale(1.1)',
    },
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -12,
    marginBottom: 19,
  },
  navButton: {
    padding: '10px',
    margin: '0 10px',
    borderRadius: '4px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'scale(1.05)',
    },
  },
};

export default Preview;
