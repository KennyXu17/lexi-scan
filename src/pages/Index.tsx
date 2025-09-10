// import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ComplianceRule, ScanResult } from '@/types/compliance';
import { ContractViewer } from '@/components/compliance/ContractViewer';
import { ChecklistPanel } from '@/components/compliance/ChecklistPanel';
import { ChecklistEditor } from '@/components/compliance/ChecklistEditor';
import { SeverityBadge } from '@/components/compliance/SeverityBadge';
import { mockScanner } from '@/services/mockScanner';
import { defaultComplianceRules } from '@/data/defaultRules';
import { sampleContractText } from '@/data/sampleContract';
import { 
  Search, 
  FileText, 
  Settings, 
  Play, 
  Download, 
  Trash2,
  BarChart3,
  Upload
} from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

// 引入后端API
import { scanContract as scanContractApi, fetchRules as fetchRulesApi, saveRules as saveRulesApi } from '@/services/api';

const Index = () => {
  const [contractText, setContractText] = useState<string>(sampleContractText);
  const [rules, setRules] = useState<ComplianceRule[]>(defaultComplianceRules);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [useMockBackend, setUseMockBackend] = useState(true);
  const [overallScore, setOverallScore] = useState<number>(0);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload PDF');
      const data = await res.json();
      setContractText(data.text || '');
      toast({
        title: 'PDF uploaded',
        description: 'PDF text extracted and loaded.',
      });
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Load rules from backend or localStorage on mount
  useEffect(() => {
    if (useMockBackend) {
      const savedRules = localStorage.getItem('compliance-rules');
      if (savedRules) {
        try {
          setRules(JSON.parse(savedRules));
        } catch (error) {
          console.error('Failed to load saved rules:', error);
        }
      }
    } else {
      fetchRulesApi()
        .then(setRules)
        .catch((error) => {
          toast({
            title: 'Failed to load rules',
            description: error.message,
            variant: 'destructive',
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMockBackend]);

  // Save rules to backend or localStorage
  const saveRules = (newRules: ComplianceRule[]) => {
    setRules(newRules);
    if (useMockBackend) {
      localStorage.setItem('compliance-rules', JSON.stringify(newRules));
      toast({
        title: 'Rules updated',
        description: 'Checklist rules have been saved successfully.',
      });
    } else {
      saveRulesApi(newRules)
        .then(() => {
          toast({
            title: 'Rules updated',
            description: 'Checklist rules have been saved to backend.',
          });
        })
        .catch((error) => {
          toast({
            title: 'Failed to save rules',
            description: error.message,
            variant: 'destructive',
          });
        });
    }
  };

  // Run compliance scan
  const handleScan = async () => {
    if (!contractText.trim()) {
      toast({
        title: 'No contract text',
        description: 'Please enter or upload contract text to scan.',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);
    try {
      if (useMockBackend) {
        const analysis = await mockScanner.scanContract(contractText, rules);
        setScanResults(analysis.results);
        setOverallScore(analysis.overallScore);

        toast({
          title: 'Scan completed',
          description: `Analysis complete. Overall compliance score: ${analysis.overallScore}%`,
        });
      } else {
        const analysis = await scanContractApi(contractText, rules);
        setScanResults(analysis.results);
        setOverallScore(analysis.overallScore);

        toast({
          title: 'Scan completed (backend)',
          description: `Analysis complete. Overall compliance score: ${analysis.overallScore}%`,
        });
      }
    } catch (error: any) {
      console.error('Scan failed:', error);
      toast({
        title: 'Scan failed',
        description: error.message || 'An error occurred during the compliance scan.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Clear results and contract text
  const handleClear = () => {
    setContractText('');
    setScanResults([]);
    setOverallScore(0);
    toast({
      title: 'Cleared',
      description: 'Contract text and scan results have been cleared.',
    });
  };

  // Export report
  const handleExportReport = () => {
    if (scanResults.length === 0) {
      toast({
        title: 'No results to export',
        description: 'Please run a scan first to generate a report.',
        variant: 'destructive',
      });
      return;
    }

    // Create mock report content
    const reportContent = `
# Contract Compliance Report
Generated: ${new Date().toLocaleDateString()}

## Overall Score: ${overallScore}%

## Summary
- Total Rules: ${rules.filter(r => r.enabled).length}
- Passed: ${scanResults.filter(r => r.status === 'pass').length}
- Flagged: ${scanResults.filter(r => r.status === 'flag').length}  
- Failed: ${scanResults.filter(r => r.status === 'fail').length}

## Detailed Results
${scanResults.map(result => {
  const rule = rules.find(r => r.id === result.ruleId);
  return `
### ${rule?.title || result.ruleId}
- Status: ${result.status.toUpperCase()}
- Matches: ${result.matches.length}
- Rationale: ${result.rationale}
${result.suggestions.length > 0 ? `- Suggestions:\n${result.suggestions.map(s => `  - ${s}`).join('\n')}` : ''}
`;
}).join('')}
    `;

    // Create and download blob
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Report exported',
      description: 'Compliance report has been downloaded as Markdown.',
    });
  };

  // Load sample contract
  const loadSampleContract = () => {
    setContractText(sampleContractText);
    toast({
      title: 'Sample loaded',
      description: 'Sample contract has been loaded for testing.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg">
                {/* <FileText className="w-5 h-5" /> */}
                <img src={`${import.meta.env.BASE_URL}favicon.ico`} alt="Lexi-Scan Logo" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Contract Compliance Diagnose</h1>
                <p className="text-sm text-muted-foreground">AI-powered compliance analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Label htmlFor="backend-toggle">Mock Mode</Label>
                <Switch
                  id="backend-toggle"
                  checked={useMockBackend}
                  onCheckedChange={setUseMockBackend}
                />
              </div>
              {/* {overallScore > 0 && (
                <Card className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Score: {overallScore}%</span>
                  </div>
                </Card>
              )} */}
            </div>
          </div>
        </div>

        <Menubar className="rounded-none border-t border-none px-2 lg:px-4">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleClear}>
                New Scan <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => fileInputRef.current?.click()}>
                Upload PDF... <MenubarShortcut>Ctrl+O</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={loadSampleContract}>
                Load Sample Contract
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleExportReport} disabled={scanResults.length === 0}>
                Export Report... <MenubarShortcut>Ctrl+E</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setShowEditor(true)}>
                Edit Checklist...
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
               <MenubarItem>Toggle Fullscreen</MenubarItem>
               <MenubarSeparator />
               <MenubarItem>Light Theme</MenubarItem>
               <MenubarItem>Dark Theme</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
           <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
               <MenubarItem>About Lexi-Scan</MenubarItem>
               <MenubarItem>View on GitHub</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Panel - Contract Viewer */}
          <ContractViewer
            contractText={contractText}
            onTextChange={setContractText}
            scanResults={scanResults}
            isScanning={isScanning}
            loadSampleContract={loadSampleContract}
            handlePdfUpload={handlePdfUpload}
            handleClear={handleClear}
            fileInputRef={fileInputRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleScan={handleScan}
          />

          {/* Right Panel - Checklist */}
          <ChecklistPanel
            rules={rules}
            scanResults={scanResults}
            overallScore={overallScore} // <-- 新增这一行
            onEditChecklist={() => setShowEditor(true)}
            onExportReport={handleExportReport}
          />
        </div>
      </div>

      {/* Checklist Editor Modal */}
      <ChecklistEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        rules={rules}
        onSave={saveRules}
      />
    </div>
  );
};

export default Index;