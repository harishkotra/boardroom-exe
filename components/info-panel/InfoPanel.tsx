'use client';

import { useState } from 'react';
import { useMeetingStore } from '@/lib/store';
import TranscriptTab from './TranscriptTab';
import InternalThoughtsTab from './InternalThoughtsTab';
import KpiDashboard from './KpiDashboard';
import BuzzwordTracker from './BuzzwordTracker';
import TimelineTab from './TimelineTab';
import InfluenceMap from './InfluenceMap';

type TabId = 'transcript' | 'thoughts' | 'kpis' | 'buzzwords' | 'timeline' | 'influence';

const TABS: { id: TabId; label: string }[] = [
  { id: 'transcript', label: 'Transcript' },
  { id: 'thoughts', label: 'Thoughts' },
  { id: 'kpis', label: 'KPIs' },
  { id: 'buzzwords', label: 'Buzzwords' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'influence', label: 'Influence' },
];

export default function InfoPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('transcript');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transcript':
        return <TranscriptTab />;
      case 'thoughts':
        return <InternalThoughtsTab />;
      case 'kpis':
        return <KpiDashboard />;
      case 'buzzwords':
        return <BuzzwordTracker />;
      case 'timeline':
        return <TimelineTab />;
      case 'influence':
        return <InfluenceMap />;
      default:
        return <TranscriptTab />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#2a2a3a] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-[#06b6d4] border-b-2 border-[#06b6d4]'
                : 'text-[#71717a] hover:text-[#a1a1aa]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}