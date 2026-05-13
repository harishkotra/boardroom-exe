'use client';

import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import { PRESETS } from '@/lib/constants';
import { Play, Square, RotateCcw, Settings, Key, ChevronDown, ChevronUp } from 'lucide-react';

export default function ControlPanel() {
  const {
    topic,
    setTopic,
    companyType,
    setCompanyType,
    chaosLevel,
    setChaosLevel,
    budgetPressure,
    setBudgetPressure,
    vcPressure,
    setVCPressure,
    aiHype,
    setAIHype,
    layoffsMode,
    setLayoffsMode,
    blockchainMode,
    setBlockchainMode,
    aiFirstMode,
    setAIFirstMode,
    isRunning,
    startMeeting,
    stopMeeting,
    loadPreset,
    reset,
  } = useMeetingStore();

  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');

  return (
    <div className="flex flex-col p-4 gap-6">
      {/* AI Inference Info Banner */}
      <div className="px-3 py-2 bg-gradient-to-r from-[#a855f7]/10 to-[#06b6d4]/10 border border-[#a855f7]/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#71717a] mb-0.5">Inference Mode</div>
            <div className="text-sm font-semibold text-[#e4e4e7]">Rule-Based Simulation</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#71717a]">No API key required</div>
            <div className="text-xs text-[#22c55e]">Local processing</div>
          </div>
        </div>
      </div>
      {/* Meeting Topic */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Meeting Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-md text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#06b6d4] font-mono"
          placeholder="What are we deciding?"
        />
      </div>

      {/* Company Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Company Type
        </label>
        <select
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-md text-sm text-[#e4e4e7] focus:outline-none focus:border-[#06b6d4]"
        >
          {PRESETS.map((preset) => (
            <option key={preset.id} value={preset.companyType}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-4">
        <Slider
          label="Chaos Level"
          value={chaosLevel}
          onChange={setChaosLevel}
          color="#ef4444"
        />
        <Slider
          label="Budget Pressure"
          value={budgetPressure}
          onChange={setBudgetPressure}
          color="#22c55e"
        />
        <Slider
          label="VC Pressure"
          value={vcPressure}
          onChange={setVCPressure}
          color="#f59e0b"
        />
        <Slider
          label="AI Hype"
          value={aiHype}
          onChange={setAIHype}
          color="#06b6d4"
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Special Modes
        </label>
        <Toggle
          label="Layoffs Mode"
          enabled={layoffsMode}
          onChange={setLayoffsMode}
        />
        <Toggle
          label="Pivot to Blockchain"
          enabled={blockchainMode}
          onChange={setBlockchainMode}
        />
        <Toggle
          label="AI-First Mandate"
          enabled={aiFirstMode}
          onChange={setAIFirstMode}
        />
      </div>

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.slice(0, 6).map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset.id)}
              className="px-2 py-1.5 text-xs bg-[#1a1a25] border border-[#2a2a3a] rounded text-[#a1a1aa] hover:bg-[#2a2a3a] hover:text-[#e4e4e7] transition-colors text-left truncate"
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#2a2a3a]">
        {!isRunning ? (
          <button
            onClick={startMeeting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0f] font-semibold rounded-md transition-colors"
          >
            <Play size={18} />
            Start Meeting
          </button>
        ) : (
          <button
            onClick={stopMeeting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-md transition-colors"
          >
            <Square size={18} />
            Stop Meeting
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a25] border border-[#2a2a3a] text-[#71717a] hover:text-[#e4e4e7] rounded-md transition-colors text-sm"
        >
          <RotateCcw size={14} />
          Reset Simulation
        </button>
      </div>

      {/* API Configuration Section */}
      <div className="border-t border-[#2a2a3a] pt-4">
        <button
          onClick={() => setApiConfigOpen(!apiConfigOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Key size={14} className="text-[#a855f7]" />
            <span className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">
              Custom AI Provider
            </span>
          </div>
          {apiConfigOpen ? (
            <ChevronUp size={14} className="text-[#71717a]" />
          ) : (
            <ChevronDown size={14} className="text-[#71717a]" />
          )}
        </button>

        {apiConfigOpen && (
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <label className="text-xs text-[#71717a] block mb-1">OpenAI-compatible Endpoint</label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-md text-xs text-[#e4e4e7] font-mono placeholder-[#71717a] focus:outline-none focus:border-[#a855f7]"
              />
            </div>
            <div>
              <label className="text-xs text-[#71717a] block mb-1">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-md text-xs text-[#e4e4e7] font-mono placeholder-[#71717a] focus:outline-none focus:border-[#a855f7]"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 text-xs bg-[#a855f7] hover:bg-[#9333ea] text-white rounded transition-colors">
                Save Config
              </button>
              <button
                onClick={() => { setApiKey(''); setApiEndpoint(''); }}
                className="px-3 py-1.5 text-xs bg-[#2a2a3a] hover:bg-[#3a3a4a] text-[#a1a1aa] rounded transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="text-xs text-[#71717a] leading-relaxed">
              Supports OpenAI, Anthropic, Groq, Together, and any OpenAI-compatible API.
            </div>
          </div>
        )}
      </div>

      {/* Version Info */}
      <div className="text-center pt-2">
        <span className="text-[10px] text-[#71717a] font-mono">v1.0.0 // DEV_BUILD</span>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs text-[#a1a1aa]">{label}</label>
        <span className="text-xs font-mono text-[#e4e4e7]" style={{ color }}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[#2a2a3a] rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #2a2a3a ${value}%, #2a2a3a 100%)`,
        }}
      />
    </div>
  );
}

function Toggle({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-[#a1a1aa] group-hover:text-[#e4e4e7] transition-colors">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          enabled ? 'bg-[#06b6d4]' : 'bg-[#2a2a3a]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}