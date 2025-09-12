import React, { useState } from 'react';
import { Player } from '@remotion/player';
// import { TrendGraphRemotion, GraphProps, defaultGraphProps } from './TrendGraphRemotion';
import { TrendGraphRemotion, defaultGraphProps } from './t';
import type { GraphProps } from './t';


// Default configuration matching the component's default props
const defaultConfig: GraphProps = {
  ...defaultGraphProps
};

const GraphEditor: React.FC = () => {
  const [config, setConfig] = useState<GraphProps>(defaultConfig);
  const [activeTab, setActiveTab] = useState('data');

  // Type-safe update helper functions
  const updateConfig = (key: keyof GraphProps, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedConfig = <K extends keyof GraphProps>(parentKey: K, key: string, value: any) => {
    setConfig(prev => {
      const parent = prev[parentKey] as any;
      return {
        ...prev,
        [parentKey]: {
          ...parent,
          [key]: value
        }
      };
    });
  };

  const updateDataPoint = (index: number, field: string, value: any) => {
    const newData = [...config.data];
    newData[index] = { ...newData[index], [field]: value };
    updateConfig('data', newData);
  };

  const addDataPoint = () => {
    const newData = [...config.data, { label: `Point ${config.data.length + 1}`, value: 100 }];
    updateConfig('data', newData);
  };

  const removeDataPoint = (index: number) => {
    const newData = config.data.filter((_, i) => i !== index);
    updateConfig('data', newData);
  };

  // Player configuration
  const playerConfig = {
    durationInFrames: 300,
    compositionWidth: 1080,
    compositionHeight: 1280,
    fps: 30,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Control Panel */}
      <div style={{ width: '400px', padding: '20px', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
        <h1>Graph Template Editor</h1>
        
        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          {['data', 'timeline', 'theme', 'flags', 'advanced'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 15px',
                background: activeTab === tab ? '#3b82f6' : 'transparent',
                color: activeTab === tab ? 'white' : '#333',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Data Tab */}
        {activeTab === 'data' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label>Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateConfig('title', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Subtitle</label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Data Type</label>
              <select
                value={config.dataType}
                onChange={(e) => updateConfig('dataType', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">None</option>
                <option value="$">Currency ($)</option>
                <option value="%">Percentage (%)</option>
                <option value="#">Number (#)</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Symbol</label>
              <input
                type="text"
                value={config.symbol}
                onChange={(e) => updateConfig('symbol', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <h3>Data Points</h3>
            {config.data.map((point, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Point {index + 1}</span>
                  <button onClick={() => removeDataPoint(index)} style={{ color: 'red' }}>×</button>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <label>Label</label>
                  <input
                    type="text"
                    value={point.label.toString()}
                    onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <label>Value</label>
                  <input
                    type="number"
                    value={point.value}
                    onChange={(e) => updateDataPoint(index, 'value', Number(e.target.value))}
                    style={{ width: '100%', padding: '5px' }}
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={point.isHighlight || false}
                    onChange={(e) => updateDataPoint(index, 'isHighlight', e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  <label>Highlight</label>
                </div>
              </div>
            ))}
            
            <button onClick={addDataPoint} style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none' }}>
              Add Data Point
            </button>
          </div>
        )}
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label>Draw Duration (seconds)</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={config.timeline.drawSeconds}
                onChange={(e) => updateNestedConfig('timeline', 'drawSeconds', Number(e.target.value))}
                style={{ width: '100%', marginTop: '5px' }}
              />
              <span>{config.timeline.drawSeconds}s</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Ripple Duration (seconds)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={config.timeline.rippleSeconds}
                onChange={(e) => updateNestedConfig('timeline', 'rippleSeconds', Number(e.target.value))}
                style={{ width: '100%', marginTop: '5px' }}
              />
              <span>{config.timeline.rippleSeconds}s</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Reveal Window</label>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.01"
                value={config.revealWindow || 0.12}
                onChange={(e) => updateConfig('revealWindow', Number(e.target.value))}
                style={{ width: '100%', marginTop: '5px' }}
              />
              <span>{config.revealWindow}</span>
            </div>
          </div>
        )}
        
        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label>Background Gradient</label>
              <input
                type="text"
                value={config.theme.bgGradient}
                onChange={(e) => updateNestedConfig('theme', 'bgGradient', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Grid Color</label>
              <input
                type="color"
                value={config.theme.gridColor}
                onChange={(e) => updateNestedConfig('theme', 'gridColor', e.target.value)}
                style={{ width: '100%', height: '40px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Line Color 1</label>
              <input
                type="color"
                value={config.theme.lineStops[0]}
                onChange={(e) => {
                  const newStops = [...config.theme.lineStops];
                  newStops[0] = e.target.value;
                  updateNestedConfig('theme', 'lineStops', newStops);
                }}
                style={{ width: '100%', height: '40px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Dot Color</label>
              <input
                type="color"
                value={config.theme.dot}
                onChange={(e) => updateNestedConfig('theme', 'dot', e.target.value)}
                style={{ width: '100%', height: '40px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Highlight Dot Color</label>
              <input
                type="color"
                value={config.theme.highlightDot}
                onChange={(e) => updateNestedConfig('theme', 'highlightDot', e.target.value)}
                style={{ width: '100%', height: '40px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Text Color</label>
              <input
                type="color"
                value={config.theme.labelText}
                onChange={(e) => updateNestedConfig('theme', 'labelText', e.target.value)}
                style={{ width: '100%', height: '40px', marginTop: '5px' }}
              />
            </div>
          </div>
        )}
        
        {/* Flags Tab */}
        {activeTab === 'flags' && (
          <div>
            {Object.entries(config.flags).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => updateNestedConfig('flags', key, e.target.checked)}
                  style={{ marginRight: '10px' }}
                />
                <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
              </div>
            ))}
          </div>
        )}
        
        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label>Floating Symbols Count</label>
              <input
                type="number"
                value={config.floatingCount || 6}
                onChange={(e) => updateConfig('floatingCount', Number(e.target.value))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Floating Character</label>
              <input
                type="text"
                value={config.floatingChar || "📈"}
                onChange={(e) => updateConfig('floatingChar', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>X Axis Min</label>
              <input
                type="number"
                value={config.axis.xMin}
                onChange={(e) => updateNestedConfig('axis', 'xMin', Number(e.target.value))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>X Axis Max</label>
              <input
                type="number"
                value={config.axis.xMax}
                onChange={(e) => updateNestedConfig('axis', 'xMax', Number(e.target.value))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={() => {
                  const dataStr = JSON.stringify(config, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = 'graph-config.json';
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                style={{ width: '100%', padding: '10px', background: '#10b981', color: 'white', border: 'none', marginBottom: '10px' }}
              >
                Export Config
              </button>
              
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e: any) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                      try {
                        const newConfig = JSON.parse(e.target.result);
                        setConfig({ ...defaultGraphProps, ...newConfig });
                      } catch (error) {
                        alert('Error parsing JSON file');
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }}
                style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', marginBottom: '10px' }}
              >
                Import Config
              </button>
              
              <button 
                onClick={() => setConfig(defaultGraphProps)}
                style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none' }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
          <h2>Preview</h2>
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '50%', maxWidth: '900px', height: '500px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Player
              component={TrendGraphRemotion}
              inputProps={config}
              durationInFrames={playerConfig.durationInFrames}
              compositionWidth={playerConfig.compositionWidth}
              compositionHeight={playerConfig.compositionHeight}
              fps={playerConfig.fps}
              controls
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;