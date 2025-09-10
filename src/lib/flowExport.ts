// Flow export utilities

export interface FlowExportData {
  id?: string;
  name: string;
  description?: string;
  poses: {
    pose_id: string;
    order_index: number;
    duration: number;
    pose?: {
      name: string;
      sanskrit_name: string;
      category: string;
      image_url?: string;
      description: string;
    };
  }[];
  totalDuration: number;
  difficulty: string;
  focus_areas: string[];
  created_at: string;
}

// Generate PDF content as HTML (to be converted to PDF)
export function generateFlowPDFContent(flowData: FlowExportData): string {
  const { name, poses, totalDuration, difficulty, focus_areas, created_at } = flowData;
  
  const posesList = poses.map((pose, index) => {
    const poseName = pose.pose?.name || `Pose ${index + 1}`;
    const sanskritName = pose.pose?.sanskrit_name || '';
    const duration = pose.duration;
    const instructions = pose.pose?.description || '';
    
    return `
      <div class="pose-item">
        <div class="pose-header">
          <h3>${index + 1}. ${poseName}</h3>
          ${sanskritName ? `<p class="sanskrit">${sanskritName}</p>` : ''}
          <p class="duration">${duration} seconds</p>
        </div>
        ${instructions ? `<p class="instructions">${instructions}</p>` : ''}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${name} - Yoga Flow</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .flow-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        .flow-meta {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
          font-size: 14px;
          color: #64748b;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .poses-container {
          display: grid;
          gap: 20px;
        }
        .pose-item {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
        }
        .pose-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .pose-header h3 {
          margin: 0;
          font-size: 18px;
          color: #1e293b;
        }
        .sanskrit {
          font-style: italic;
          color: #64748b;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .duration {
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          margin: 0;
        }
        .instructions {
          color: #4b5563;
          font-size: 14px;
          margin: 10px 0 0 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        @media print {
          body { padding: 10px; }
          .pose-item { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="flow-title">${name}</h1>
        <div class="flow-meta">
          <div class="meta-item">
            <strong>Duration:</strong> ${Math.round(totalDuration / 60)} minutes
          </div>
          <div class="meta-item">
            <strong>Poses:</strong> ${poses.length}
          </div>
          <div class="meta-item">
            <strong>Difficulty:</strong> ${difficulty}
          </div>
          ${focus_areas.length > 0 ? `
            <div class="meta-item">
              <strong>Focus:</strong> ${focus_areas.join(', ')}
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="poses-container">
        ${posesList}
      </div>
      
      <div class="footer">
        <p>Generated on ${new Date(created_at).toLocaleDateString()} | Yoga Flow University</p>
        <p>Practice mindfully and listen to your body. Modify poses as needed.</p>
      </div>
    </body>
    </html>
  `;
}

// Generate shareable flow data
export function generateShareableFlowData(flowData: FlowExportData): string {
  // Create a shareable version with minimal data
  const shareableData = {
    name: flowData.name,
    poses: flowData.poses.map(pose => ({
      pose_id: pose.pose_id,
      order_index: pose.order_index,
      duration: pose.duration,
      name: pose.pose?.name,
      sanskrit_name: pose.pose?.sanskrit_name,
      category: pose.pose?.category
    })),
    totalDuration: flowData.totalDuration,
    difficulty: flowData.difficulty,
    focus_areas: flowData.focus_areas,
    created_at: flowData.created_at
  };
  
  // Use encodeURIComponent to handle special characters properly
  return btoa(encodeURIComponent(JSON.stringify(shareableData)));
}

// Export flow as JSON file for download
export function downloadFlowAsJSON(flowData: FlowExportData): void {
  const dataStr = JSON.stringify(flowData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${flowData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flow.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate PDF using the browser's print functionality
export function printFlowAsPDF(flowData: FlowExportData): void {
  const htmlContent = generateFlowPDFContent(flowData);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close window after printing (user can cancel)
        printWindow.onafterprint = () => printWindow.close();
      }, 500);
    };
  }
}

// Generate shareable URL
export function generateShareableURL(flowData: FlowExportData, baseURL: string = ''): string {
  const shareableData = generateShareableFlowData(flowData);
  const currentBaseURL = baseURL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${currentBaseURL}/flow/shared?data=${encodeURIComponent(shareableData)}`;
}

// Parse shared flow data from URL
export function parseSharedFlowData(encodedData: string): FlowExportData | null {
  try {
    const decodedData = decodeURIComponent(atob(encodedData));
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Error parsing shared flow data:', error);
    return null;
  }
}