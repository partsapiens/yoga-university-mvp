import React from 'react';
import { Download, Share2, Link2, FileText } from 'lucide-react';

interface ExportFlowProps {
  flow: any[];
  flowName: string;
  totalDuration: number;
  onExportPDF: () => void;
  onGenerateShareLink: () => void;
  onSaveAsJSON: () => void;
}

export function ExportFlow({ 
  flow, 
  flowName, 
  totalDuration, 
  onExportPDF, 
  onGenerateShareLink, 
  onSaveAsJSON 
}: ExportFlowProps) {
  if (flow.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Share2 size={20} />
        Export & Share
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* PDF Export */}
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <FileText size={18} className="text-red-500" />
          <div className="text-left">
            <div className="font-medium text-sm">Export PDF</div>
            <div className="text-xs text-muted-foreground">Sequence with images</div>
          </div>
        </button>

        {/* Shareable Link */}
        <button
          onClick={onGenerateShareLink}
          className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Link2 size={18} className="text-blue-500" />
          <div className="text-left">
            <div className="font-medium text-sm">Share Link</div>
            <div className="text-xs text-muted-foreground">Public view mode</div>
          </div>
        </button>

        {/* Save as JSON */}
        <button
          onClick={onSaveAsJSON}
          className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Download size={18} className="text-green-500" />
          <div className="text-left">
            <div className="font-medium text-sm">Save to Device</div>
            <div className="text-xs text-muted-foreground">JSON format</div>
          </div>
        </button>
      </div>

      {/* Flow Summary */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="text-sm font-medium mb-2">Flow Summary</div>
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Name:</span> {flowName || 'Untitled Flow'}
          </div>
          <div>
            <span className="font-medium">Poses:</span> {flow.length}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {Math.round(totalDuration / 60)} minutes
          </div>
          <div>
            <span className="font-medium">Created:</span> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}