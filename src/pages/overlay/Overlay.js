import React, { useRef, useState, useCallback, useEffect } from "react";
import screenfull from 'screenfull';
import GraphPage from './graph/Graph';
import './Overlay.css';
import mindmapData from '../../utils/mindmapData';

const Overlay = ({ showOverlay, handleToggleOverlay }) => {
    const graphRef = useRef();
    const graphContainerRef = useRef();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const graphData = {
        nodes: mindmapData.map(node => ({ id: node.id, name: node.label, color: node.color })),
        links: mindmapData
            .filter(node => node.parent)
            .map(node => ({ source: node.parent, target: node.id }))
    };

    useEffect(() => {
        if (screenfull.isEnabled) {
            screenfull.on('change', () => {
                setIsFullscreen(screenfull.isFullscreen);
                handleResize();
            });
        }
        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change');
            }
        };
    }, []);

    useEffect(() => {
        let bgTimeout;
        if (showOverlay) {
            bgTimeout = setTimeout(() => {
                document.querySelector('.overlay').classList.add('delayed-bg');
            }, 500);
        } else {
            document.querySelector('.overlay').classList.remove('delayed-bg');
        }

        return () => clearTimeout(bgTimeout);
    }, [showOverlay]);

    const handleToggleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle(graphContainerRef.current);
        }
    };

    const handleResize = useCallback(() => {
        if (graphContainerRef.current && graphRef.current) {
            graphRef.current.width = graphContainerRef.current.clientWidth;
            graphRef.current.height = graphContainerRef.current.clientHeight;
        }
    }, []);

    const handleFeatureClick = (nodeId) => {
        if (graphRef.current) {
            graphRef.current.focusOnNode(nodeId);
        }
    };

    return (
        <div className={`overlay ${showOverlay ? 'active' : ''}`}>
            <div className={`overlayContent ${showOverlay ? 'active' : ''}`}>
                <div className="navigationButtons">
                    <button onClick={handleToggleFullScreen} className="fullScreenButton">⛶</button>
                    <button onClick={handleToggleOverlay} className="closeButton">X</button>
                </div>
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
                        <div key={index} className="featureCard" onClick={() => handleFeatureClick(feature.title.toLowerCase().replace(' ', '-'))}>
                            <div className="featureIcon">{feature.icon}</div>
                            <div className="featureTitle">{feature.title}</div>
                            <div className="featureDescription">{feature.description}</div>
                        </div>
                    ))}
                </div>
                <div className="graphContainer" ref={graphContainerRef}>
                    <GraphPage ref={graphRef} graphData={graphData} isFullscreen={isFullscreen} />
                </div>
            </div>
        </div>
    );
};

export default Overlay;
