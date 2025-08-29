import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComplianceRule, SeverityLevel, RuleType } from '@/types/compliance';
import { SeverityBadge } from './SeverityBadge';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistEditorProps {
  open: boolean;
  onClose: () => void;
  rules: ComplianceRule[];
  onSave: (rules: ComplianceRule[]) => void;
}

interface EditingRule extends ComplianceRule {
  isNew?: boolean;
  isEditing?: boolean;
}

export function ChecklistEditor({ open, onClose, rules, onSave }: ChecklistEditorProps) {
  const [editingRules, setEditingRules] = useState<EditingRule[]>([]);
  const [editingRule, setEditingRule] = useState<EditingRule | null>(null);

  // Initialize editing rules when dialog opens
  useState(() => {
    if (open) {
      setEditingRules(rules.map(rule => ({ ...rule })));
    }
  });

  const handleSave = () => {
    const validRules = editingRules
      .filter(rule => !rule.isEditing) // Only save completed edits
      .map(({ isNew, isEditing, ...rule }) => rule); // Remove editing flags
    
    onSave(validRules);
    onClose();
  };

  const handleAddRule = () => {
    const newRule: EditingRule = {
      id: `rule-${Date.now()}`,
      title: '',
      category: '',
      severity: 'medium',
      type: 'keyword',
      keywords: [],
      pattern: '',
      explanation: '',
      suggestion: '',
      examples: [],
      enabled: true,
      isNew: true,
      isEditing: true
    };
    
    setEditingRule(newRule);
  };

  const handleEditRule = (rule: EditingRule) => {
    setEditingRule({ ...rule, isEditing: true });
  };

  const handleSaveRule = () => {
    if (!editingRule) return;

    if (editingRule.isNew) {
      setEditingRules([...editingRules, { ...editingRule, isNew: false, isEditing: false }]);
    } else {
      setEditingRules(editingRules.map(rule => 
        rule.id === editingRule.id 
          ? { ...editingRule, isEditing: false }
          : rule
      ));
    }
    
    setEditingRule(null);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const handleDeleteRule = (ruleId: string) => {
    setEditingRules(editingRules.filter(rule => rule.id !== ruleId));
  };

  const handleToggleEnabled = (ruleId: string, enabled: boolean) => {
    setEditingRules(editingRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
  };

  const updateEditingRule = (field: keyof EditingRule, value: any) => {
    if (!editingRule) return;
    setEditingRule({ ...editingRule, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Compliance Checklist</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handleAddRule} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Rule
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>

          {/* Rules Table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Enabled</TableHead>
                  <TableHead className="w-48">Title</TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  <TableHead className="w-24">Severity</TableHead>
                  <TableHead className="w-20">Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editingRules.map((rule) => (
                  <TableRow key={rule.id} className={cn(rule.isEditing && "bg-accent/30")}>
                    <TableCell>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => handleToggleEnabled(rule.id, enabled)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{rule.title}</TableCell>
                    <TableCell>{rule.category}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={rule.severity} />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted px-2 py-1 rounded capitalize">
                        {rule.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rule.explanation.substring(0, 100)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Edit Rule Modal */}
        {editingRule && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingRule.isNew ? 'Add New Rule' : 'Edit Rule'}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editingRule.title}
                        onChange={(e) => updateEditingRule('title', e.target.value)}
                        placeholder="Rule title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={editingRule.category}
                        onChange={(e) => updateEditingRule('category', e.target.value)}
                        placeholder="e.g., Privacy & Data Protection"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="severity">Severity</Label>
                      <Select
                        value={editingRule.severity}
                        onValueChange={(value: SeverityLevel) => updateEditingRule('severity', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={editingRule.type}
                        onValueChange={(value: RuleType) => updateEditingRule('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keyword">Keyword</SelectItem>
                          <SelectItem value="regex">Regex</SelectItem>
                          <SelectItem value="llm">LLM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {editingRule.type === 'keyword' && (
                    <div>
                      <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                      <Input
                        id="keywords"
                        value={editingRule.keywords?.join(', ') || ''}
                        onChange={(e) => updateEditingRule('keywords', e.target.value.split(',').map(k => k.trim()))}
                        placeholder="privacy policy, data protection, GDPR"
                      />
                    </div>
                  )}

                  {editingRule.type === 'regex' && (
                    <div>
                      <Label htmlFor="pattern">Regex Pattern</Label>
                      <Input
                        id="pattern"
                        value={editingRule.pattern || ''}
                        onChange={(e) => updateEditingRule('pattern', e.target.value)}
                        placeholder="(cross.?border|international.?transfer)"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={editingRule.explanation}
                      onChange={(e) => updateEditingRule('explanation', e.target.value)}
                      placeholder="Explain why this rule is important"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="suggestion">Suggestion</Label>
                    <Textarea
                      id="suggestion"
                      value={editingRule.suggestion}
                      onChange={(e) => updateEditingRule('suggestion', e.target.value)}
                      placeholder="Suggest how to address this compliance requirement"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="examples">Examples (comma-separated)</Label>
                    <Textarea
                      id="examples"
                      value={editingRule.examples?.join(', ') || ''}
                      onChange={(e) => updateEditingRule('examples', e.target.value.split(',').map(ex => ex.trim()))}
                      placeholder="Example clauses that satisfy this rule"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRule}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Rule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}