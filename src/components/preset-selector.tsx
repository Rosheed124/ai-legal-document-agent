"use client";

// Import React hooks
import React, { useState } from "react";
// Import icons
import {
  FileText,
  Sparkles,
  ClipboardPaste,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
// Import presets list
import { PRESET_CONTRACTS } from "@/lib/presets";
// Import types
import { PresetContract } from "@/lib/types";

// Component props interface
interface PresetSelectorProps {
  // Current active contract text
  text: string;
  // Handler when contract text is edited or a preset is loaded
  onTextChange: (newText: string, presetName?: string) => void;
  // Handler when user triggers live AI analysis
  onRunAudit: () => void;
  // Whether an audit scanning process is currently running
  isScanning: boolean;
  // Active preset ID if any
  activePresetId: string | null;
  // Handler to set active preset ID
  setActivePresetId: (id: string | null) => void;
}

// Preset selector and contract text input component
export function PresetSelector({
  text,
  onTextChange,
  onRunAudit,
  isScanning,
  activePresetId,
  setActivePresetId,
}: PresetSelectorProps) {
  // State for paste notification feedback
  const [pastedNotice, setPastedNotice] = useState<boolean>(false);

  // Calculate live statistics
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  // Handle switching presets
  const handleSelectPreset = (preset: PresetContract) => {
    // Set active ID
    setActivePresetId(preset.id);
    // Update text in parent
    onTextChange(preset.text, preset.name);
  };

  // Handle clearing text to write a custom contract
  const handleClear = () => {
    setActivePresetId(null);
    onTextChange("", "Custom Contract");
  };

  // Handle reading from the system clipboard
  const handlePaste = async () => {
    try {
      // Read clipboard text
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setActivePresetId(null);
        onTextChange(clipboardText, "Pasted Custom Document");
        setPastedNotice(true);
        setTimeout(() => setPastedNotice(false), 2000);
      }
    } catch {
      // If browser clipboard permission fails, alert user gracefully
      alert("Please press Ctrl+V directly into the text box to paste your contract.");
    }
  };

  return (
    <div className="rounded-2xl border border-legal-border bg-legal-surface p-6 shadow-sm">
      {/* Header title & description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-legal-text flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Contract Document Input & Presets
          </h3>
          <p className="text-xs text-legal-muted mt-0.5">
            Select a real-world contract template or paste your own custom agreement text.
          </p>
        </div>

        {/* Live stats badge */}
        <div className="flex items-center gap-3 text-xs text-legal-muted">
          <span>
            <strong className="text-legal-text">{wordCount}</strong> words
          </span>
          <span>•</span>
          <span>
            <strong className="text-legal-text">{charCount}</strong> characters
          </span>
        </div>
      </div>

      {/* Preset template button pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
        {PRESET_CONTRACTS.map((preset) => {
          // Check if this preset is currently chosen
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`flex flex-col text-left p-3 rounded-xl border text-xs transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-500/10 text-legal-text shadow-sm"
                  : "border-legal-border bg-legal-subtle/50 text-legal-muted hover:border-legal-border/80 hover:text-legal-text"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold text-legal-text truncate">
                  {preset.name}
                </span>
                {isSelected && (
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-1" />
                )}
              </div>
              <p className="text-[11px] line-clamp-2 text-legal-muted leading-tight">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Contract textarea container */}
      <div className="relative rounded-xl border border-legal-border bg-legal-subtle/40 focus-within:border-blue-500 transition-colors">
        <textarea
          value={text}
          onChange={(e) => {
            setActivePresetId(null);
            onTextChange(e.target.value);
          }}
          placeholder="Paste or type contract text here (e.g., Master Services Agreement, NDA, IP Assignment, Consulting Contract)..."
          rows={7}
          className="w-full p-4 bg-transparent text-xs sm:text-sm text-legal-text placeholder:text-legal-muted/60 focus:outline-none resize-y font-mono leading-relaxed"
        />

        {/* Floating action buttons inside or below text area */}
        <div className="flex items-center justify-between p-3 border-t border-legal-border/60 bg-legal-surface/80 rounded-b-xl flex-wrap gap-2">
          {/* Left tools: Paste & Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-legal-border bg-legal-subtle text-xs font-medium text-legal-text hover:bg-legal-border/50 transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-legal-muted" />
              <span>{pastedNotice ? "Pasted!" : "Paste Text"}</span>
            </button>

            <button
              onClick={handleClear}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-legal-border bg-legal-subtle text-xs font-medium text-legal-muted hover:text-red-500 hover:border-red-500/30 disabled:opacity-40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Right tool: Run AI Audit trigger */}
          <button
            onClick={onRunAudit}
            disabled={!text.trim() || isScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Covenants & Risks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Autonomous AI Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
