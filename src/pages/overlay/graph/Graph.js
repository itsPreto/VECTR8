import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3-force';

const GraphPage = forwardRef(({ graphData, isFullscreen }, ref) => {
    const graphRef = useRef();
    const graphContainerRef = useRef();

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
            
            // Window resize listener
            window.addEventListener('resize', handleResize);

            return () => {
                resizeObserver.disconnect();
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [handleResize]);

    useEffect(() => {
        if (graphData && graphData.nodes && graphData.links) {
            const simulation = d3.forceSimulation(graphData.nodes)
                .force('link', d3.forceLink(graphData.links).id(d => d.id))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(0, 0))
                .force('repel', d3.forceManyBody().strength(d => (d.id === 'root' || d.parent === 'embedding-dimensionality') ? -300 : -100));

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

    const moveCameraToNode = (node) => {
        const graphNode = graphData.nodes.find(n => n.id === node.id);
        if (!graphNode) return;

        const { x, y } = graphNode;

        graphRef.current.zoom(1, 300);
        setTimeout(() => {
            graphRef.current.centerAt(x, y, 400);
            setTimeout(() => {
                graphRef.current.zoom(20, 800);
            }, 200);
        }, 1000);
    };

    useImperativeHandle(ref, () => ({
        focusOnNode(nodeId) {
            if (graphRef.current) {
                const graphNode = graphData.nodes.find(n => n.id === nodeId);
                if (!graphNode) return;
                moveCameraToNode(graphNode);
            }
        }
    }));

    return (
        <div
            ref={graphContainerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                maxHeight: isFullscreen ? 'none' : '50vh'
            }}
        >
            <ForceGraph2D
                ref={graphRef}
                nodeRelSize={5}
                linkWidth={5.5}
                width={window.innerWidth}
                linkDirectionalArrowLength={10}
                backgroundColor="#222222"
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
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 1.6);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color;

                    const words = label.split(' ');
                    let line = '';
                    const lines = [];
                    const lineHeight = fontSize * 1.2;
                    words.forEach(word => {
                        const testLine = line + word + ' ';
                        const testWidth = ctx.measureText(testLine).width;
                        if (testWidth > 100) {
                            lines.push(line);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    });
                    lines.push(line);

                    lines.forEach((line, i) => {
                        ctx.fillText(line, node.x, node.y - (lines.length - 1) * lineHeight / 2 + i * lineHeight);
                    });

                    node.__bckgDimensions = bckgDimensions;
                }}

                nodePointerAreaPaintExtend={6}
                nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                }}
                onNodeClick={node => {
                }}
            />
        </div>
    );
});

export default GraphPage;
