import React, { useState } from 'react';
import { Search, Play, Dumbbell, Hammer, Apple, Briefcase, Monitor, Activity, Leaf, Wrench, Home, User, ChevronRight, Calculator, Settings } from 'lucide-react';

const ViralMotionCreator = () => {
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [activeNicheTab, setActiveNicheTab] = useState('All');
  const [activeTemplateTab, setActiveTemplateTab] = useState('All');
  const [activeColorTab, setActiveColorTab] = useState('All');
  const [activeStyleTab, setActiveStyleTab] = useState('All');

  const nicheCategories = ['All', 'Fitness', 'Construction', 'Food', 'Business', 'Tech'];
  
  const niches = [
    { id: 'fitness', name: 'Fitness', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'nutrition', name: 'Nutrition', icon: <Apple className="w-4 h-4" /> },
    { id: 'bodybuilding', name: 'Bodybuilding', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'yoga', name: 'Yoga', icon: <User className="w-4 h-4" /> },
    { id: 'cardio', name: 'Cardio', icon: <Activity className="w-4 h-4" /> },
    { id: 'wellness', name: 'Wellness', icon: <Leaf className="w-4 h-4" /> },
    { id: 'supplements', name: 'Supplements', icon: <Apple className="w-4 h-4" /> },
    { id: 'construction', name: 'Construction', icon: <Hammer className="w-4 h-4" /> },
    { id: 'architecture', name: 'Architecture', icon: <Home className="w-4 h-4" /> },
    { id: 'realestate', name: 'Real Estate', icon: <Home className="w-4 h-4" /> }
  ];

  const templateTypes = ['All', 'Charts', 'Text', 'Motion', 'Visual'];
  
  const templates = [
    { id: 'bar-chart-3d', name: '3D Bar Chart', description: 'Elevated bars with depth and shadows', tag: 'PRO', preview: 'bar-chart-3d' },
    { id: 'pie-chart-animated', name: 'Animated Pie Chart', description: 'Segments animate in sequence', tag: 'PRO', preview: 'pie-chart-animated' },
    { id: 'donut-chart', name: 'Donut Chart', description: 'Hollow center pie chart with text', tag: 'PRO', preview: 'donut-chart' },
    { id: 'line-graph', name: 'Line Graph', description: 'Smooth animated line progression', tag: 'PRO', preview: 'line-graph' },
    { id: 'area-chart', name: 'Area Chart', description: 'Filled area under curve', tag: 'PRO', preview: 'area-chart' },
    { id: 'typewriter', name: 'Typewriter Effect', description: 'Text appears letter by letter', tag: 'PRO', preview: 'typewriter' },
    { id: 'glitch-text', name: 'Glitch Text', description: 'Digital distortion effect', tag: 'PRO', preview: 'glitch-text' },
    { id: 'neon-glow', name: 'Neon Glow', description: 'Glowing neon sign effect', tag: 'PRO', preview: 'neon-text' }
  ];

  const colorTypes = ['All', 'Viral', 'Business', 'Nature', 'Retro', 'Minimal'];
  
  const colorSchemes = [
    { id: 'corporate-blue', name: 'Corporate Blue', description: 'Professional blue tones', gradient: 'from-blue-600 to-blue-400', tag: 'PRO' },
    { id: 'finance-green', name: 'Finance Green', description: 'Money and growth', gradient: 'from-green-600 to-green-400', tag: 'PRO' },
    { id: 'forest-green', name: 'Forest Green', description: 'Natural woodland vibes', gradient: 'from-green-800 to-green-500', tag: 'PRO' },
    { id: 'ocean-blue', name: 'Ocean Blue', description: 'Deep sea colors', gradient: 'from-blue-800 to-blue-500', tag: 'PRO' },
    { id: 'retro-neon', name: 'Retro Neon', description: 'Synthwave vibes', gradient: 'from-pink-500 to-purple-500', tag: 'PRO' },
    { id: 'monochrome', name: 'Monochrome', description: 'Black and white only', gradient: 'from-gray-800 to-gray-400', tag: 'PRO' }
  ];

  const styleTypes = ['All', 'Classic', 'Energetic', 'Dramatic', 'Tech', 'Natural', 'Retro'];
  
  const animationStyles = [
    { id: 'smooth-flow', name: 'Smooth Flow', description: 'Elegant, fluid transitions', duration: '2000ms', tag: 'classic', color: 'gray' },
    { id: 'bouncy-pop', name: 'Bouncy Pop', description: 'Playful elastic animations', duration: '1500ms', tag: 'energetic', color: 'pink', highlighted: true },
    { id: 'lightning-fast', name: 'Lightning Fast', description: 'Quick, snappy transitions', duration: '800ms', tag: 'energetic', color: 'pink' },
    { id: 'cinematic-slow', name: 'Cinematic Slow', description: 'Dramatic, movie-like pacing', duration: '4000ms', tag: 'dramatic', color: 'purple' },
    { id: 'glitch-digital', name: 'Glitch Digital', description: 'Tech glitch and digital effects', duration: '1200ms', tag: 'tech', color: 'cyan' },
    { id: 'organic-wave', name: 'Organic Wave', description: 'Natural, flowing movements', duration: '3000ms', tag: 'natural', color: 'green' },
    { id: 'mechanical-precise', name: 'Mechanical Precise', description: 'Robot-like, exact movements', duration: '1800ms', tag: 'tech', color: 'cyan' },
    { id: 'explosive-burst', name: 'Explosive Burst', description: 'High-energy particle effects', duration: '1000ms', tag: 'dramatic', color: 'purple' }
  ];

  const toggleSelection = (id: string, selectedList: string[], setSelectedList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter((item: string) => item !== id));
    } else {
      setSelectedList([...selectedList, id]);
    }
  };

  const getMultiplier = (): number => {
    const niches = selectedNiches.length || 1;
    const templates = selectedTemplates.length || 1;
    const colors = selectedColors.length || 1;
    const styles = selectedStyles.length || 1;
    return niches * templates * colors * styles;
  };

  const totalVideos = getMultiplier() * 100;
  const estimatedTime = Math.max(50, totalVideos * 0.5);

  const formatDuration = (duration: string): string => {
    return duration;
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 text-left" 
      style={{ 
        maxWidth: 'none', 
        width: '100%', 
        margin: 0,
        padding: 0,
        textAlign: 'left',
        color: '#374151',
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4" style={{ backgroundColor: '#ffffff', color: '#374151' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-pink-600 mb-1">ViralMotion Creator</h1>
            <p className="text-gray-600 text-sm">Create viral TikTok-style animations with AI-powered content generation</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">Processing Status</span>
            </div>
            <span className="text-sm text-gray-500">No active processing jobs</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors">
              <Settings className="w-4 h-4" />
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Niche Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Your Niches</h2>
              <span className="text-sm text-gray-500">Choose your content focus</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Choose Your Niches</h3>
              <div className="flex gap-2 flex-wrap">
                {nicheCategories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => setActiveNicheTab(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeNicheTab === category 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {niches.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => toggleSelection(niche.id, selectedNiches, setSelectedNiches)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    selectedNiches.includes(niche.id)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {niche.icon}
                  <span className="font-medium text-gray-800">{niche.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animation Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Animation Templates</h2>
              <span className="text-sm text-gray-500">Select multiple templates</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Select multiple templates (0/50)</p>
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {templateTypes.map((type: string) => (
                  <button
                    key={type}
                    onClick={() => setActiveTemplateTab(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTemplateTab === type 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => toggleSelection(template.id, selectedTemplates, setSelectedTemplates)}
                  className={`cursor-pointer rounded-lg border-2 transition-all ${
                    selectedTemplates.includes(template.id)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="p-4">
                    <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">{template.preview}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                    <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded font-medium">
                      {template.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Color Schemes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Color Schemes</h2>
              <span className="text-sm text-gray-500">Select multiple color schemes</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Select multiple color schemes (0/10)</p>
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search color schemes..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {colorTypes.map((type: string) => (
                  <button
                    key={type}
                    onClick={() => setActiveColorTab(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeColorTab === type 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => toggleSelection(scheme.id, selectedColors, setSelectedColors)}
                  className={`cursor-pointer rounded-lg border-2 transition-all ${
                    selectedColors.includes(scheme.id)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="p-4">
                    <div className={`h-16 rounded-lg mb-3 bg-gradient-to-r ${scheme.gradient} relative overflow-hidden`}>
                      <div className="absolute top-2 left-2 flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                        <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                        <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">{scheme.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{scheme.description}</p>
                    <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded font-medium">
                      {scheme.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animation Styles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Animation Styles</h2>
              <span className="text-sm text-gray-500">Select multiple animation styles</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Select multiple animation styles (0/5)</p>
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search animation styles..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {styleTypes.map((type: string) => (
                  <button
                    key={type}
                    onClick={() => setActiveStyleTab(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeStyleTab === type 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {animationStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => toggleSelection(style.id, selectedStyles, setSelectedStyles)}
                  className={`cursor-pointer rounded-lg border-2 transition-all ${
                    selectedStyles.includes(style.id)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : style.highlighted 
                      ? 'border-cyan-400 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">{style.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{style.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        style.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                        style.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        style.color === 'cyan' ? 'bg-cyan-100 text-cyan-700' :
                        style.color === 'green' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {style.tag}
                      </span>
                      <span className="text-xs text-gray-500">{formatDuration(style.duration)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output Multiplier Calculator */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-blue-200 bg-blue-100">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-800">Output Multiplier Calculator</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Niches</span>
                  <span className="text-xs text-gray-500">Single</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{selectedNiches.length || 1}</div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Templates</span>
                  <span className="text-xs text-gray-500">Single</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{selectedTemplates.length || 1}</div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Colors</span>
                  <span className="text-xs text-gray-500">Single</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{selectedColors.length || 1}</div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Styles</span>
                  <span className="text-xs text-gray-500">Single</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{selectedStyles.length || 1}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="text-center">
                <span className="text-sm text-gray-600 font-medium">Total Calculation</span>
                <div className="text-lg text-gray-700 mt-2 font-medium">
                  {selectedNiches.length || 1} × {selectedTemplates.length || 1} × {selectedColors.length || 1} × {selectedStyles.length || 1} = 
                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold">
                    {getMultiplier()}×
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4" />
                  <span className="text-sm opacity-90 font-medium">Total Videos</span>
                </div>
                <div className="text-3xl font-bold">{totalVideos.toLocaleString()}</div>
                <div className="text-sm opacity-75">= 100 base videos</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm opacity-90 font-medium">Est. Time</span>
                </div>
                <div className="text-3xl font-bold">{Math.ceil(estimatedTime)}m</div>
                <div className="text-sm opacity-75">Processing time estimate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViralMotionCreator;