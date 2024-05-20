import React, { useRef, useState, useCallback, useEffect } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import screenfull from 'screenfull';
import * as d3 from 'd3-force';
import { motion } from 'framer-motion';
import './Overlay.css';

const Overlay = ({ showOverlay, handleToggleOverlay }) => {
    const graphRef = useRef();
    const graphContainerRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [traversalOrder, setTraversalOrder] = useState([]);

    const mindmapData = [
        { id: 'root', label: 'Embeddings Dimensions', parent: null, color: '#ffffff' },
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

    useEffect(() => {
        if (screenfull.isEnabled) {
            screenfull.on('change', () => {
                handleResize();
            });
        }
        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change');
            }
        };
    }, []);

    const handleToggleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle(graphContainerRef.current);
        }
    };

    const traverseGraph = (nodeId, graph, visited) => {
        const node = graph.nodes.find(n => n.id === nodeId);
        if (!node || visited.includes(nodeId)) return;

        visited.push(nodeId);
        const children = graph.links.filter(link => link.source === nodeId).map(link => link.target);
        children.forEach(childId => traverseGraph(childId, graph, visited));
    };

    useEffect(() => {
        const graph = {
            nodes: mindmapData.map(node => ({ id: node.id, name: node.label, color: node.color })),
            links: mindmapData.filter(node => node.parent).map(node => ({ source: node.parent, target: node.id }))
        };

        const visited = [];
        traverseGraph('root', graph, visited);
        setTraversalOrder(visited);
    }, []);

    const navigateGraph = (direction) => {
        let newIndex = currentIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % traversalOrder.length;
        } else if (direction === 'prev') {
            newIndex = (currentIndex - 1 + traversalOrder.length) % traversalOrder.length;
        }

        const nodeKey = traversalOrder[newIndex];
        const node = mindmapData.find(n => n.id === nodeKey);

        console.log(node);

        if (node && graphRef.current) {
            moveCameraToNode(node);
            setCurrentIndex(newIndex);
        }
    };

    function moveCameraToNode(node) {
        const graphNode = graphData.nodes.find(n => n.id === node.id);
        if (!graphNode) return;

        const { x, y } = graphNode;

        graphRef.current.zoom(1, 1000);
        setTimeout(() => {
            graphRef.current.centerAt(x, y, 1000);
            setTimeout(() => {
                graphRef.current.zoom(7, 1000);
            }, 200);
        }, 1000);
    }

    const graphData = {
        nodes: mindmapData.map(node => ({ id: node.id, name: node.label, color: node.color })),
        links: mindmapData
            .filter(node => node.parent)
            .map(node => ({ source: node.parent, target: node.id }))
    };

    const handleResize = useCallback(() => {
        if (graphContainerRef.current && graphRef.current) {
            graphRef.current.width = graphContainerRef.current.clientWidth;
            graphRef.current.height = graphContainerRef.current.clientHeight;
        }
    }, []);

    useEffect(() => {
        if (graphContainerRef.current) {
            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(graphContainerRef.current);

            return () => resizeObserver.disconnect();
        }
    }, [handleResize]);

    useEffect(() => {
        if (graphData && graphData.nodes && graphData.links) {
            const simulation = d3.forceSimulation(graphData.nodes)
                .force('link', d3.forceLink(graphData.links).id(d => d.id))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(0, 0));

            simulation.on('tick', () => {
                if (graphRef.current) {
                    graphRef.current.d3Force('link').links(graphData.links);
                    graphRef.current.d3Force('charge').strength(-100);
                    graphRef.current.d3Force('center').x(0).y(0);
                }
            });

            return () => simulation.stop();
        }
    }, [graphData]);

    return (
        <div className={`overlay ${showOverlay ? 'active' : ''}`}>
            <div className={`overlayContent ${showOverlay ? 'active' : ''}`}>
                <button onClick={handleToggleOverlay} className="close-button">X</button>
                <h2>Woah, that's a lot of dimensions...</h2>
                <div className="featuresContainer">
                    {[
                        { title: "Search", description: "Perform semantic search using vector similarity", icon: "🔍" },
                        { title: "Clustering", description: "Group similar vectors based on their proximity in the embedding space", icon: "🔗" },
                        { title: "Recommendations", description: "Generate personalized recommendations using vector similarity", icon: "✨" },
                        { title: "Anomaly Detection", description: "Identify outlier vectors that deviate from the normal patterns", icon: "🚨" },
                        { title: "Diversity Measurement", description: "Quantify the diversity of vectors in the embedding space", icon: "📊" },
                        { title: "Classification", description: "Classify vectors into predefined categories based on their embeddings", icon: "🏷️" },
                    ].map((feature, index) => (
                        <div key={index} className="featureCard">
                            <div className="featureIcon">{feature.icon}</div>
                            <div className="featureTitle">{feature.title}</div>
                            <div className="featureDescription">{feature.description}</div>
                        </div>
                    ))}
                </div>
                <div className="graphContainer" ref={graphContainerRef}>
                    <div id="graph" className="graph">
                        <div className="navigationButtons">
                            <button onClick={() => navigateGraph('prev')} className="navButton">←</button>
                            <button onClick={() => navigateGraph('next')} className="navButton">→</button>
                            <button onClick={handleToggleFullScreen} className="fullScreenButton">⛶</button>
                        </div>
                        <ForceGraph2D
                            ref={graphRef}
                            nodeRelSize={5}
                            linkWidth={5.5}
                            linkDirectionalArrowLength={10}
                            graphData={graphData}
                            nodeAutoColorBy="color"
                            onNodeDragEnd={node => {
                                node.fx = node.x;
                                node.fy = node.y;
                                node.fz = node.z;
                            }}
                            linkColor={() => '#cccccc'}
                            linkDirectionalParticles="2"
                            linkDirectionalParticleSpeed={d => 2 * 0.001}
                            nodeLabel="label"
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                const label = node.name;
                                const fontSize = 12 / globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 1.6); // some padding

                                ctx.fillStyle = 'rgba(15, 15, 15, 0.80)';
                                ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = node.color;
                                ctx.fillText(label, node.x, node.y);

                                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                            }}
                            nodePointerAreaPaintExtend={6}
                            nodePointerAreaPaint={(node, color, ctx) => {
                                ctx.fillStyle = color;
                                const bckgDimensions = node.__bckgDimensions;
                                bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                            }}
                            onNodeClick={node => {
                                moveCameraToNode(node);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overlay;