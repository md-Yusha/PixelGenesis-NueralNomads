import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';

interface JsonViewerProps {
  data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };

  return (
    <div className="bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b-4 border-[#2a2a2a]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:text-[#4F46E5] transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#888]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#888]" />
          )}
          <span className="pixel-text text-[10px] text-[#888]">
            {isExpanded ? 'COLLAPSE' : 'EXPAND'} JSON
          </span>
        </button>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-[#1a1a1a] pixel-corners"
        >
          <Copy className="w-4 h-4 text-[#888]" />
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 overflow-x-auto">
          <pre className="pixel-text text-[8px] text-[#10B981] leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
