import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScanResult } from '@/types/compliance';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SeverityBadge } from './SeverityBadge';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContractViewerProps {
  contractText: string;
  onTextChange: (text: string) => void;
  scanResults?: ScanResult[];
  isScanning?: boolean;
}

interface HighlightMatch {
  startIndex: number;
  endIndex: number;
  ruleId: string;
  text: string;
  severity: string;
  rationale: string;
  status: string;
}

export function ContractViewer({ contractText, onTextChange, scanResults = [], isScanning = false }: ContractViewerProps) {
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const viewerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Process scan results into highlights
  useEffect(() => {
    if (!contractText || scanResults.length === 0) {
      setHighlightedText(contractText);
      return;
    }

    // Collect all matches with their metadata
    const highlights: HighlightMatch[] = [];
    
    scanResults.forEach(result => {
      result.matches.forEach(match => {
        highlights.push({
          startIndex: match.startIndex,
          endIndex: match.endIndex,
          ruleId: result.ruleId,
          text: match.text,
          severity: getSeverityFromRuleId(result.ruleId),
          rationale: result.rationale,
          status: result.status
        });
      });
    });

    // Sort by start index to process in order
    highlights.sort((a, b) => a.startIndex - b.startIndex);

    // Create highlighted text
    let processedText = '';
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
      // Add text before highlight
      processedText += escapeHtml(contractText.slice(lastIndex, highlight.startIndex));
      
      // Add highlighted text with tooltip
      const highlightClass = getHighlightClass(highlight.severity, highlight.status);
      processedText += `<span 
        class="${highlightClass}" 
        data-tooltip-id="highlight-${highlight.ruleId}-${index}"
        data-rationale="${escapeHtml(highlight.rationale)}"
        data-severity="${highlight.severity}"
        data-status="${highlight.status}"
      >${escapeHtml(highlight.text)}</span>`;
      
      lastIndex = highlight.endIndex;
    });

    // Add remaining text
    processedText += escapeHtml(contractText.slice(lastIndex));
    
    setHighlightedText(processedText);
  }, [contractText, scanResults]);

  const getSeverityFromRuleId = (ruleId: string): string => {
    // Extract severity from rule ID pattern or default mapping
    if (ruleId.includes('privacy') || ruleId.includes('indemnification')) return 'critical';
    if (ruleId.includes('ip') || ruleId.includes('liability')) return 'high';
    if (ruleId.includes('termination') || ruleId.includes('sla')) return 'medium';
    return 'low';
  };

  const getHighlightClass = (severity: string, status: string): string => {
    const baseClasses = 'px-1 py-0.5 rounded-sm cursor-help transition-all duration-200 hover:shadow-sm';
    
    if (status === 'fail') return `${baseClasses} bg-severity-critical-bg text-severity-critical border-b-2 border-severity-critical`;
    if (status === 'flag') return `${baseClasses} bg-severity-medium-bg text-severity-medium border-b-2 border-severity-medium`;
    
    // Pass status
    switch (severity) {
      case 'critical': return `${baseClasses} bg-severity-critical-bg text-severity-critical border-b-2 border-severity-critical-border`;
      case 'high': return `${baseClasses} bg-severity-high-bg text-severity-high border-b-2 border-severity-high-border`;
      case 'medium': return `${baseClasses} bg-severity-medium-bg text-severity-medium border-b-2 border-severity-medium-border`;
      case 'low': return `${baseClasses} bg-severity-low-bg text-severity-low border-b-2 border-severity-low-border`;
      default: return `${baseClasses} bg-severity-low-bg text-severity-low border-b-2 border-severity-low-border`;
    }
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const handleMouseOver = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.dataset.tooltipId) {
      // Handle tooltip display for highlighted text
      console.log('Highlight hovered:', target.dataset.rationale);
    }
  };

  // Handle PDF upload and text extraction
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      // Import pdf-parse dynamically since it's not available in browser environment
      // For now, we'll simulate PDF text extraction
      const text = await extractTextFromPDF(file);
      onTextChange(text);
      
      toast({
        title: 'PDF uploaded successfully',
        description: `Extracted text from ${file.name}`,
      });
    } catch (error) {
      console.error('PDF parsing failed:', error);
      toast({
        title: 'Failed to process PDF',
        description: 'Could not extract text from the PDF file.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Simulate PDF text extraction (replace with actual pdf-parse in production)
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For now, return a placeholder message
        // In production, you would use pdf-parse here
        resolve(`[PDF Content from ${file.name}]\n\nThis is a simulated PDF text extraction. In a real implementation, this would contain the actual text content extracted from the PDF file using a PDF parsing library.\n\nSample contract text would appear here after proper PDF parsing implementation.`);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setUploadedFileName('');
    onTextChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <TooltipProvider>
      <Card className="h-full p-4">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Contract Text</h2>
            <div className="flex items-center gap-2">
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  Processing PDF...
                </div>
              )}
              {isScanning && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  Scanning...
                </div>
              )}
            </div>
          </div>

          {/* File Upload Area */}
          {scanResults.length === 0 && (
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload PDF
                </Button>
                
                {uploadedFileName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
                    <FileText className="w-4 h-4" />
                    <span>{uploadedFileName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFile}
                      className="h-6 w-6 p-0 hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
          
          <div className="flex-1 relative">
            {scanResults.length > 0 ? (
              <div 
                ref={viewerRef}
                className="h-full overflow-auto p-4 bg-muted/30 rounded-lg border text-sm leading-relaxed font-mono"
                onMouseOver={handleMouseOver}
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            ) : (
              <Textarea
                value={contractText}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="Paste your contract text here or upload a document..."
                className="h-full resize-none text-sm font-mono leading-relaxed"
              />
            )}
          </div>
          
          {scanResults.length > 0 && (
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-severity-critical rounded-full"></div>
                Critical
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-severity-high rounded-full"></div>
                High
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-severity-medium rounded-full"></div>
                Medium
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-severity-low rounded-full"></div>
                Low
              </div>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}