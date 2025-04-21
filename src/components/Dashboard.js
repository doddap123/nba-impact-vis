import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaChartBar, FaUser, FaTh, FaLeaf, FaInfoCircle } from 'react-icons/fa';
import players from '../data/player_data.json';
import Dropdowns from './Dropdowns';
import ScatterPlot from './ScatterPlot';
import RankedTable from './RankedTable';
import RadarChart from './RadarChart';
import CorrelationMatrix from './CorrelationMatrix';

const labelMap = {
  combined: 'CRAFT',
  points: 'Points',
  rebounds: 'Rebounds',
  assists: 'Assists',
  fgPct: 'FG%',
  threePct: '3PT%',
  tsPct: 'TS%',
  contractValue: 'Contract Rank'
};

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState('combined');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [activeTab, setActiveTab] = useState('distribution');
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [brushMode, setBrushMode] = useState(false);
  const [brushedPlayers, setBrushedPlayers] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  const teamOptions = ['All', ...new Set(players.map(p => p.team))];
  const filteredPlayers = players.filter(p =>
    selectedTeam === 'All' || p.team === selectedTeam
  );
  const viewPlayers = brushedPlayers ?? filteredPlayers;

  useEffect(() => {
    if (!viewPlayers.find(p => p.name === selectedPlayer.name)) {
      setSelectedPlayer(viewPlayers[0] || players[0]);
    }
  }, [viewPlayers, selectedPlayer]);

  const handleBrushSelection = subset => {
    setBrushedPlayers(subset);
    setBrushMode(false);
  };

  const handleReset = () => {
    setBrushedPlayers(null);
    setBrushMode(false);
  };

  const metricLabel = labelMap[selectedMetric] || selectedMetric.toUpperCase();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Logo & Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        background: 'linear-gradient(90deg, #1f2937, #2d3a26)',
        padding: '16px 24px',
        borderRadius: '12px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#A3C586',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FaLeaf style={{ fontSize: '1.8rem' }} />
          CRAFT
        </h1>
        <button
          onClick={() => setShowAbout(true)}
          style={{
            background: 'transparent',
            border: '1px solid #A3C586',
            color: '#A3C586',
            padding: '6px 12px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FaInfoCircle style={{ marginRight: '6px' }} />
          About CRAFT
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: '#1f2937',
            color: '#f1f1f1',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '600px',
            textAlign: 'left',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#A3C586', marginBottom: '1rem' }}>
              What is CRAFT?
            </h2>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              <strong>CRAFT</strong> (Cost-Adjusted Ranking via Aggregated Forest Training) Cost-adjusted Ranking via Aggregated Forest Training) is a novel metric which uses Random Forest Regression Models to predict key box score statistics in addition to player salary in order to provide a more wholistic evaluation of a given player. After predicting the necessary season metrics for each player, we then use key insider knowledge to weight each value in the final calculation of CRAFT.
            </p>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              Unlike raw box score stats or generic advanced metrics, CRAFT takes into account how these features contribute to overall team value and adjusts them relative to estimated contract value.
            </p>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              This tool is designed for <strong>fans, analysts, and front offices</strong> to explore how efficient, underrated, or overvalued players are across the league.
            </p>
            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  backgroundColor: '#A3C586',
                  color: '#111827',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ backgroundColor: 'var(--panel)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <Dropdowns
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          teamOptions={teamOptions}
        />
      </div>

      {/* Brush toggle and reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A3C586' }}>
          <input
            type="checkbox"
            checked={brushMode}
            onChange={() => {
              setBrushMode(!brushMode);
              if (!brushMode) setBrushedPlayers(null);
            }}
            style={{
              width: '18px',
              height: '18px',
              accentColor: '#A3C586',
              backgroundColor: '#2F3E46',
              border: '1px solid #4A5A63'
            }}
          />
          Enable Brush Mode
        </label>
        <button onClick={handleReset}>Reset View</button>
      </div>

      {/* Tab nav */}
      <div style={{ borderBottom: '1px solid #4A5A63', marginBottom: '24px', display: 'flex', gap: '24px' }}>
        {[
          { key: 'distribution', label: <><FaChartBar /> Distribution</> },
          { key: 'profiles', label: <><FaUser /> Profiles</> },
          { key: 'correlations', label: <><FaTh /> Correlations</> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              paddingBottom: '6px',
              borderBottom: activeTab === tab.key ? '2px solid #A3C586' : 'none',
              color: activeTab === tab.key ? '#A3C586' : '#F1F1F1',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === 'distribution' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: 'var(--panel)', borderRadius: '12px', padding: '16px' }}>
            <ScatterPlot
              players={viewPlayers}
              selectedMetric={selectedMetric}
              selectedPlayer={selectedPlayer}
              brushMode={brushMode}
              onBrushSelection={handleBrushSelection}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>
          <RankedTable
            players={viewPlayers}
            selectedMetric={selectedMetric}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={setSelectedPlayer}
          />
        </div>
      )}

      {activeTab === 'profiles' && (
        <div style={{ backgroundColor: 'var(--panel)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#F1F1F1' }}>
            {selectedPlayer.name} — {selectedPlayer.team}
          </h2>
          <div style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Points: {selectedPlayer.points.toFixed(2)},&nbsp;
            Rebounds: {selectedPlayer.rebounds.toFixed(2)},&nbsp;
            Assists: {selectedPlayer.assists.toFixed(2)},&nbsp;
            TS%: {selectedPlayer.tsPct.toFixed(2)}
          </div>
          <RadarChart player={selectedPlayer} players={viewPlayers} />
        </div>
      )}

      {activeTab === 'correlations' && (
        <div style={{ backgroundColor: 'var(--panel)', borderRadius: '12px', padding: '24px' }}>
          <CorrelationMatrix players={viewPlayers} />
        </div>
      )}
    </div>
  );
}
