import React, { useState, useRef, useEffect } from 'react';
import { Upload, Info, Mountain, Compass, Clock, Database, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const TerrainAnalyzer = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [hoveredPixel, setHoveredPixel] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  // Simulated analysis results for demonstration
  const generateSampleData = () => {
    const width = 200;
    const height = 100;
    const totalPixels = width * height;
    
    // Generate synthetic slope and aspect data
    const slopeData = new Float32Array(totalPixels);
    const aspectData = new Float32Array(totalPixels);
    
    let minSlope = Infinity;
    let maxSlope = -Infinity;
    let sumSlope = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        
        // Create varied terrain
        const distFromCenter = Math.sqrt(
          Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2)
        );
        const slope = Math.min(45, (distFromCenter / 5) + Math.random() * 10);
        const aspect = ((x / width) * 360 + Math.random() * 30) % 360;
        
        slopeData[idx] = slope;
        aspectData[idx] = aspect;
        
        minSlope = Math.min(minSlope, slope);
        maxSlope = Math.max(maxSlope, slope);
        sumSlope += slope;
      }
    }
    
    return {
      slope: slopeData,
      aspect: aspectData,
      width,
      height,
      stats: {
        execution_time: 0.023456,
        memory_usage: 12.34,
        min_slope: minSlope,
        max_slope: maxSlope,
        mean_slope: sumSlope / totalPixels
      }
    };
  };

  const getAspectDirection = (degrees) => {
    if (degrees < 0) return "Flat";
    if (degrees >= 337.5 || degrees < 22.5) return "N";
    if (degrees >= 22.5 && degrees < 67.5) return "NE";
    if (degrees >= 67.5 && degrees < 112.5) return "E";
    if (degrees >= 112.5 && degrees < 157.5) return "SE";
    if (degrees >= 157.5 && degrees < 202.5) return "S";
    if (degrees >= 202.5 && degrees < 247.5) return "SW";
    if (degrees >= 247.5 && degrees < 292.5) return "W";
    if (degrees >= 292.5 && degrees < 337.5) return "NW";
    return "N/A";
  };

  const createVisualization = (data) => {
    const { slope, aspect, width, height } = data;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    
    for (let i = 0; i < slope.length; i++) {
      const s = slope[i];
      const a = aspect[i];
      const pixelIndex = i * 4;
      
      // Base grayscale from slope
      const gray = Math.min(255, (s / 45) * 255);
      
      // Color coding for suitability
      const lowSlope = s < 5;
      const southFacing = a >= 112.5 && a <= 247.5;
      
      if (lowSlope && southFacing) {
        // Green tint for optimal areas
        imageData.data[pixelIndex] = gray * 0.3;
        imageData.data[pixelIndex + 1] = Math.min(255, gray * 0.7 + 100);
        imageData.data[pixelIndex + 2] = gray * 0.3;
      } else if (lowSlope) {
        // Yellow tint for suboptimal areas
        imageData.data[pixelIndex] = Math.min(255, gray * 0.9 + 100);
        imageData.data[pixelIndex + 1] = Math.min(255, gray * 0.8 + 100);
        imageData.data[pixelIndex + 2] = gray * 0.3;
      } else {
        // Normal grayscale for steep areas
        imageData.data[pixelIndex] = gray;
        imageData.data[pixelIndex + 1] = gray;
        imageData.data[pixelIndex + 2] = gray;
      }
      
      imageData.data[pixelIndex + 3] = 255; // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  const handleLoadSample = () => {
    const data = generateSampleData();
    setAnalysisData(data);
    const imgUrl = createVisualization(data);
    setImageData(imgUrl);
  };

  const handleCanvasHover = (e) => {
    if (!analysisData || !canvasRef.current || isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    // Account for zoom and pan
    const imageX = (mouseX - pan.x) / zoom;
    const imageY = (mouseY - pan.y) / zoom;
    
    // Convert to pixel coordinates
    const x = Math.floor((imageX / containerRect.width) * analysisData.width);
    const y = Math.floor((imageY / containerRect.height) * analysisData.height);
    
    if (x >= 0 && x < analysisData.width && y >= 0 && y < analysisData.height) {
      const index = y * analysisData.width + x;
      setHoveredPixel({
        x, y,
        slope: analysisData.slope[index].toFixed(2),
        aspect: analysisData.aspect[index].toFixed(1),
        direction: getAspectDirection(analysisData.aspect[index])
      });
    } else {
      setHoveredPixel(null);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1));
    if (zoom <= 1.5) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      handleCanvasHover(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    handleLoadSample();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mountain className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold">Terrain Slope & Aspect Analyzer</h1>
          </div>
          <p className="text-slate-400">Horn's method for DEM analysis with suitability mapping</p>
        </div>

        <div className="space-y-6">
          {/* Main Visualization */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Slope & Aspect Map</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                    className="p-2 hover:bg-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-mono">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 5}
                    className="p-2 hover:bg-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleLoadSample}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Generate New Sample
                </button>
              </div>
            </div>
            
            {imageData ? (
              <div 
                ref={containerRef}
                className="overflow-hidden border border-slate-600 bg-slate-900"
                style={{ 
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
                  maxHeight: '70vh',
                  height: 'auto'
                }}
                onWheel={handleWheel}
              >
                <img
                  ref={canvasRef}
                  src={imageData}
                  alt="Terrain visualization"
                  className="w-full h-auto"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: '0 0',
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    imageRendering: zoom > 2 ? 'pixelated' : 'auto',
                    display: 'block',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => {
                    setHoveredPixel(null);
                    handleMouseUp();
                  }}
                  draggable={false}
                />
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600">
                <div className="text-center">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">Loading visualization...</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Row - Pixel Info, Performance, Slope Stats, and Legend */}
          <div className="grid grid-cols-4 gap-6">
            {/* Pixel Info */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                Pixel Info
              </h3>
              {hoveredPixel ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Position:</span>
                    <span className="font-mono text-emerald-400">
                      ({hoveredPixel.x}, {hoveredPixel.y})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Slope:</span>
                    <span className="font-mono text-emerald-400">
                      {hoveredPixel.slope}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Aspect:</span>
                    <span className="font-mono text-emerald-400">
                      {hoveredPixel.aspect}° ({hoveredPixel.direction})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">
                  Hover over map
                </div>
              )}
            </div>

            {/* Performance Stats */}
            {analysisData && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Performance Metrics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Time:</span>
                    <span className="font-mono text-blue-400">
                      {(analysisData.stats.execution_time * 1000).toFixed(2)} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Memory Usage:</span>
                    <span className="font-mono text-blue-400">
                      {analysisData.stats.memory_usage.toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DEM Size:</span>
                    <span className="font-mono text-blue-400">
                      {analysisData.width} × {analysisData.height}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Slope Statistics */}
            {analysisData && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  Slope Statistics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Minimum:</span>
                    <span className="font-mono text-purple-400">
                      {analysisData.stats.min_slope.toFixed(2)}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Maximum:</span>
                    <span className="font-mono text-purple-400">
                      {analysisData.stats.max_slope.toFixed(2)}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mean:</span>
                    <span className="font-mono text-purple-400">
                      {analysisData.stats.mean_slope.toFixed(2)}°
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" />
                Suitability Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-green-600 to-green-800 border border-green-500"></div>
                  <div className="text-sm">
                    <div className="font-semibold text-green-400">Optimal</div>
                    <div className="text-slate-400">Low slope (&lt;5°) + South-facing</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-600 to-yellow-800 border border-yellow-500"></div>
                  <div className="text-sm">
                    <div className="font-semibold text-yellow-400">Suboptimal</div>
                    <div className="text-slate-400">Low slope (&lt;5°) + Other aspects</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-400 to-gray-600 border border-gray-500"></div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-400">Unsuitable</div>
                    <div className="text-slate-400">Steep slope (≥5°)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Compass */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-red-400" />
                Aspect Reference
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-900/50 rounded">NW<br/>315°</div>
                <div className="p-2 bg-slate-900/50 rounded font-semibold text-blue-400">N<br/>0°</div>
                <div className="p-2 bg-slate-900/50 rounded">NE<br/>45°</div>
                <div className="p-2 bg-slate-900/50 rounded">W<br/>270°</div>
                <div className="p-2 bg-slate-700 rounded"></div>
                <div className="p-2 bg-slate-900/50 rounded">E<br/>90°</div>
                <div className="p-2 bg-slate-900/50 rounded">SW<br/>225°</div>
                <div className="p-2 bg-slate-900/50 rounded font-semibold text-green-400">S<br/>180°</div>
                <div className="p-2 bg-slate-900/50 rounded">SE<br/>135°</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default TerrainAnalyzer;