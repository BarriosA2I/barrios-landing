/**
 * ScriptApproval - Script Review & Approval Interface
 *
 * Design: Tesla minimalism + cyberpunk aesthetic
 * Features:
 * - Script draft display with formatting
 * - Approve/Revise actions
 * - Revision notes input
 * - Scene-by-scene breakdown
 */

import React, { useState, useCallback } from 'react';

// Parse script into scenes
const parseScript = (scriptText) => {
  if (!scriptText) return [];

  // Try to split by common scene markers
  const scenePatterns = [
    /(?:SCENE|Scene)\s*(\d+)[:\s]*/g,
    /(?:INT\.|EXT\.)[^-]*-[^-\n]*/g,
    /\[(?:SCENE|Scene)\s*(\d+)\]/g,
  ];

  let scenes = [];
  let remaining = scriptText;

  // Simple split by double newlines if no scene markers
  if (!scriptText.match(/SCENE|INT\.|EXT\./i)) {
    const paragraphs = scriptText.split(/\n\n+/).filter(p => p.trim());
    return paragraphs.map((content, idx) => ({
      number: idx + 1,
      title: `Section ${idx + 1}`,
      content: content.trim(),
    }));
  }

  // Try to extract scenes
  const lines = scriptText.split('\n');
  let currentScene = null;
  let currentContent = [];

  lines.forEach(line => {
    const sceneMatch = line.match(/^(?:SCENE|Scene)\s*(\d+)[:\s]*(.*)/i) ||
                       line.match(/^(?:INT\.|EXT\.)\s*(.+)/i) ||
                       line.match(/^\[SCENE\s*(\d+)\](.*)$/i);

    if (sceneMatch) {
      if (currentScene) {
        scenes.push({
          ...currentScene,
          content: currentContent.join('\n').trim(),
        });
      }
      currentScene = {
        number: scenes.length + 1,
        title: line.trim(),
      };
      currentContent = [];
    } else if (currentScene) {
      currentContent.push(line);
    }
  });

  if (currentScene) {
    scenes.push({
      ...currentScene,
      content: currentContent.join('\n').trim(),
    });
  }

  if (scenes.length === 0) {
    return [{
      number: 1,
      title: 'Script Content',
      content: scriptText,
    }];
  }

  return scenes;
};

// Scene Card Component
const SceneCard = ({ scene, isExpanded, onToggle }) => (
  <div className="border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#00CED1]/30">
    {/* Scene Header */}
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded bg-[#00CED1]/20 flex items-center justify-center text-sm font-mono text-[#00CED1]">
          {scene.number}
        </span>
        <span className="text-sm font-medium text-white truncate">
          {scene.title}
        </span>
      </div>
      <svg
        className={`w-5 h-5 text-white/50 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Scene Content */}
    {isExpanded && (
      <div className="p-4 bg-black/30 border-t border-white/5">
        <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
          {scene.content}
        </pre>
      </div>
    )}
  </div>
);

// Main Script Approval Component
const ScriptApproval = ({
  jobId,
  scriptDraft,
  revisionCount = 0,
  onApprove,
  onRevise,
  onCancel,
  isLoading = false,
  className = '',
}) => {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [expandedScenes, setExpandedScenes] = useState(new Set([1]));

  const scenes = parseScript(scriptDraft);

  const toggleScene = useCallback((sceneNumber) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      if (next.has(sceneNumber)) {
        next.delete(sceneNumber);
      } else {
        next.add(sceneNumber);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedScenes(new Set(scenes.map(s => s.number)));
  }, [scenes]);

  const collapseAll = useCallback(() => {
    setExpandedScenes(new Set());
  }, []);

  const handleApprove = useCallback(() => {
    if (onApprove) {
      onApprove(jobId);
    }
  }, [jobId, onApprove]);

  const handleRevise = useCallback(() => {
    if (onRevise && revisionNotes.trim()) {
      onRevise(jobId, revisionNotes.trim());
      setShowRevisionForm(false);
      setRevisionNotes('');
    }
  }, [jobId, revisionNotes, onRevise]);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-1 text-xs font-mono bg-amber-500/20 text-amber-400 rounded">
            APPROVAL GATE
          </span>
          {revisionCount > 0 && (
            <span className="px-2 py-1 text-xs font-mono bg-[#8B5CF6]/20 text-[#8B5CF6] rounded">
              Revision #{revisionCount}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white">
          Script Ready for Review
        </h2>
        <p className="text-white/50 mt-1">
          Review the generated script below. Approve to continue production or request revisions.
        </p>
      </div>

      {/* Script Preview */}
      <div className="mb-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <span className="text-sm text-white/50 font-mono">
            {scenes.length} {scenes.length === 1 ? 'section' : 'sections'} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-2 py-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              Expand All
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={collapseAll}
              className="px-2 py-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Scenes */}
        <div className="space-y-3">
          {scenes.map((scene) => (
            <SceneCard
              key={scene.number}
              scene={scene}
              isExpanded={expandedScenes.has(scene.number)}
              onToggle={() => toggleScene(scene.number)}
            />
          ))}
        </div>
      </div>

      {/* Revision Form */}
      {showRevisionForm && (
        <div className="mb-6 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <h4 className="text-sm font-medium text-amber-400 mb-3">
            Revision Notes
          </h4>
          <textarea
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            placeholder="Describe what changes you'd like to see in the script..."
            className="w-full h-32 p-4 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => {
                setShowRevisionForm(false);
                setRevisionNotes('');
              }}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRevise}
              disabled={!revisionNotes.trim() || isLoading}
              className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-black rounded-lg transition-colors"
            >
              {isLoading ? 'Submitting...' : 'Submit Revision'}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showRevisionForm && (
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel Production
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRevisionForm(true)}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Request Revision
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium bg-[#00CED1] hover:bg-[#00CED1]/80 disabled:bg-[#00CED1]/50 disabled:cursor-not-allowed text-black rounded-lg transition-colors shadow-[0_0_20px_rgba(0,206,209,0.3)] hover:shadow-[0_0_30px_rgba(0,206,209,0.4)]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Approve & Continue'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
        <div className="flex items-start gap-3">
          <span className="text-[#00CED1]">💡</span>
          <div className="text-xs text-white/50">
            <p className="mb-1">
              <strong className="text-white/70">Script Approval Gate:</strong> This is a checkpoint to ensure the script aligns with your vision before GPU resources are used for visual generation.
            </p>
            <p>
              Once approved, production will continue through The Visualizer, Sound Designer, Assembler, QA, and Delivery agents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptApproval;
