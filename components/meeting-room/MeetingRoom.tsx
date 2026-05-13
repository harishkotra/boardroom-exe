'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMeetingStore } from '@/lib/store';
import { Agent, AgentRole } from '@/lib/types';

const ROLE_COLORS: Record<AgentRole, string> = {
  ceo: '#f59e0b',
  pm: '#06b6d4',
  engineering: '#8b5cf6',
  marketing: '#ec4899',
  finance: '#22c55e',
  legal: '#3b82f6',
  hr: '#f97316',
  ai_safety: '#ef4444',
  intern: '#84cc16',
};

export default function MeetingRoom() {
  const { agents, currentSpeaker, transcript, isRunning, phase, topic } = useMeetingStore();

  const nodePositions = useMemo(() => {
    const centerX = 400;
    const centerY = 300;
    const radius = 220;
    const totalAgents = agents.length;

    return agents.reduce((acc, agent, index) => {
      const angle = (2 * Math.PI * index) / totalAgents - Math.PI / 2;
      acc[agent.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);
  }, [agents]);

  const nodes: Node[] = useMemo(() => {
    return agents.map((agent) => {
      const isSpeaking = currentSpeaker === agent.id;
      const pos = nodePositions[agent.id];
      const influenceScale = 0.8 + (agent.influence / 100) * 0.4;

      return {
        id: agent.id,
        position: pos,
        data: {
          label: agent.name,
          role: agent.roleLabel,
          color: agent.color,
          isSpeaking,
          influence: agent.influence,
        },
        style: {
          width: 70 * influenceScale,
          height: 70 * influenceScale,
        },
        type: 'agentNode',
      };
    });
  }, [agents, currentSpeaker, nodePositions]);

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];

    agents.forEach((source, i) => {
      agents.forEach((target, j) => {
        if (i < j) {
          const hash = (source.id.charCodeAt(5) + target.id.charCodeAt(5)) % 10;
          if (hash < 2) {
            const isAlliance = hash === 0;
            result.push({
              id: `edge-${source.id}-${target.id}`,
              source: source.id,
              target: target.id,
              type: 'smoothstep',
              animated: isAlliance,
              style: {
                stroke: isAlliance ? '#22c55e' : '#ef4444',
                strokeWidth: 1,
                strokeDasharray: isAlliance ? '0' : '5,5',
                opacity: 0.4,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: isAlliance ? '#22c55e' : '#ef4444',
              },
            });
          }
        }
      });
    });

    return result;
  }, [agents]);

  const [nodesState, setNodesState, onNodesChange] = useNodesState(nodes);
  const [edgesEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Update nodes when agents change
  useMemo(() => {
    setNodesState(nodes);
  }, [nodes, setNodesState]);

  useMemo(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const latestMessage = transcript[transcript.length - 1];

  return (
    <div className="w-full h-full relative">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background opacity-50" />

      {/* Phase Indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="px-3 py-1.5 bg-[#12121a] border border-[#2a2a3a] rounded-md">
          <span className="text-xs font-mono text-[#71717a] uppercase">
            Phase: <span className="text-[#06b6d4]">{phase}</span>
          </span>
        </div>
      </div>

      {/* Latest Speech Bubble */}
      {latestMessage && (
        <div className="absolute top-4 right-4 z-10 max-w-xs speech-bubble">
          <div className="px-4 py-3 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: ROLE_COLORS[latestMessage.agentRole as AgentRole],
                  color: '#0a0a0f',
                }}
              >
                {latestMessage.agentName[0]}
              </div>
              <span className="text-sm font-medium text-[#e4e4e7]">
                {latestMessage.agentName}
              </span>
              <span className="text-xs text-[#71717a]">
                {latestMessage.agentRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              {latestMessage.content}
            </p>
          </div>
        </div>
      )}

      {/* Tension Meter */}
      <div className="absolute bottom-4 left-4 z-10 w-48">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#71717a]">Meeting Tension</span>
          <span className="text-xs font-mono text-[#ef4444]">
            {Math.min(100, Math.floor((agents.filter(a => a.emotionalState === 'angry' || a.emotionalState === 'frustrated').length / agents.length) * 100))}%
          </span>
        </div>
        <div className="h-1.5 bg-[#2a2a3a] rounded-full overflow-hidden">
          <div
            className="h-full tension-bar transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.floor((agents.filter(a => a.emotionalState === 'angry' || a.emotionalState === 'frustrated').length / agents.length) * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodesState}
        edges={edgesEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={agentNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#2a2a3a"
          gap={40}
          size={1}
        />
        <Controls
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>

      {/* Meeting Info Banner */}
      {isRunning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-[#12121a] border border-[#2a2a3a] rounded-lg">
          <div className="text-xs text-[#71717a] text-center mb-1 uppercase tracking-wider">Meeting Topic</div>
          <div className="text-sm font-semibold text-[#e4e4e7] text-center">{topic}</div>
        </div>
      )}

      {/* Empty State */}
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a25] border border-[#2a2a3a] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#71717a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#e4e4e7] mb-2">
              No Meeting in Progress
            </h3>
            <p className="text-sm text-[#71717a]">
              Configure settings and start a simulation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Agent Node Component
import { Handle, Position } from '@xyflow/react';

function AgentNode({ data }: { data: { label: string; role: string; color: string; isSpeaking: boolean; influence: number } }) {
  return (
    <div
      className="agent-node relative flex flex-col items-center"
      style={{
        transform: data.isSpeaking ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Speaking Ring */}
      {data.isSpeaking && (
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: `3px solid ${data.color}`,
            animationDuration: '1s',
          }}
        />
      )}

      {/* Main Circle */}
      <div
        className="w-full h-full rounded-full flex flex-col items-center justify-center border-2"
        style={{
          backgroundColor: '#12121a',
          borderColor: data.color,
          boxShadow: data.isSpeaking ? `0 0 25px ${data.color}60` : 'none',
        }}
      >
        <span
          className="text-xl font-bold"
          style={{ color: data.color }}
        >
          {data.label[0]}
        </span>
      </div>

      {/* Name */}
      <div className="mt-2 text-center">
        <span className="text-sm text-[#e4e4e7] font-medium block">{data.label}</span>
        <span
          className="text-xs px-2 py-0.5 rounded mt-1 inline-block"
          style={{
            backgroundColor: `${data.color}20`,
            color: data.color,
          }}
        >
          {data.role}
        </span>
      </div>
    </div>
  );
}

const agentNodeTypes = {
  agentNode: AgentNode,
};