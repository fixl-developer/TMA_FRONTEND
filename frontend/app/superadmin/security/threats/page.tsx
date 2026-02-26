'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { PageSection } from '@/shared/components/layout/PageSection';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Progress } from '@/shared/components/ui/progress';
import { securityManagementService, type ThreatAlert } from '@/shared/services/securityManagementService';
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Shield,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Activity,
  Zap,
  Target,
  Globe,
  Server,
  User,
  Calendar,
  TrendingUp,
  Ban
} from 'lucide-react';

export default function ThreatMonitoringPage() {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<ThreatAlert | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [filters, setFilters] = useState({
    source: '',
    type: '',
    severity: '',
    status: '',
    riskScoreMin: '',
    riskScoreMax: '',
    search: ''
  });

  useEffect(() => {
    loadThreats();
  }, [filters]);

  const loadThreats = async () => {
    setLoading(true);
    try {
      const filterParams = {
        ...filters,
        riskScoreMin: filters.riskScoreMin ? parseInt(filters.riskScoreMin) : undefined,
        riskScoreMax: filters.riskScoreMax ? parseInt(filters.riskScoreMax) : undefined
      };
      const data = await securityManagementService.getThreatAlerts(filterParams);
      setThreats(data);
    } catch (error) {
      console.error('Failed to load threat alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (threatId: string, newStatus: string) => {
    try {
      await securityManagementService.updateThreatAlertStatus(threatId, newStatus);
      loadThreats();
    } catch (error) {
      console.error('Failed to update threat status:', error);
    }
  };

  const handleAssignThreat = async (threatId: string, investigator: string) => {
    try {
      await securityManagementService.assignThreatAlert(threatId, investigator);
      loadThreats();
    } catch (error) {
      console.error('Failed to assign threat:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'red',
      HIGH: 'orange',
      MEDIUM: 'yellow',
      LOW: 'blue'
    };
    return colors[severity] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'red',
      INVESTIGATING: 'yellow',
      CONFIRMED: 'orange',
      FALSE_POSITIVE: 'gray',
      RESOLVED: 'green'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <AlertTriangle className="w-4 h-4" />;
      case 'INVESTIGATING':
        return <Clock className="w-4 h-4" />;
      case 'CONFIRMED':
        return <Shield className="w-4 h-4" />;
      case 'FALSE_POSITIVE':
        return <XCircle className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      IDS: 'blue',
      FIREWALL: 'orange',
      ANTIVIRUS: 'green',
      SIEM: 'purple',
      MANUAL: 'gray',
      EXTERNAL_FEED: 'indigo',
      ML_DETECTION: 'pink'
    };
    return colors[source] || 'gray';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      MALWARE: 'red',
      SUSPICIOUS_LOGIN: 'orange',
      BRUTE_FORCE: 'yellow',
      SQL_INJECTION: 'purple',
      XSS: 'blue',
      ANOMALOUS_TRAFFIC: 'green',
      PRIVILEGE_ESCALATION: 'indigo',
      DATA_EXFILTRATION: 'red'
    };
    return colors[type] || 'gray';
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Threat Monitoring"
        description="Monitor and investigate security threats"
        icon={Eye}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={loadThreats}>
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Manual Alert
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search threats..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              <SelectItem value="IDS">IDS</SelectItem>
              <SelectItem value="FIREWALL">Firewall</SelectItem>
              <SelectItem value="ANTIVIRUS">Antivirus</SelectItem>
              <SelectItem value="SIEM">SIEM</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
              <SelectItem value="EXTERNAL_FEED">External Feed</SelectItem>
              <SelectItem value="ML_DETECTION">ML Detection</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="MALWARE">Malware</SelectItem>
              <SelectItem value="SUSPICIOUS_LOGIN">Suspicious Login</SelectItem>
              <SelectItem value="BRUTE_FORCE">Brute Force</SelectItem>
              <SelectItem value="SQL_INJECTION">SQL Injection</SelectItem>
              <SelectItem value="XSS">XSS</SelectItem>
              <SelectItem value="ANOMALOUS_TRAFFIC">Anomalous Traffic</SelectItem>
              <SelectItem value="PRIVILEGE_ESCALATION">Privilege Escalation</SelectItem>
              <SelectItem value="DATA_EXFILTRATION">Data Exfiltration</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="INVESTIGATING">Investigating</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="FALSE_POSITIVE">False Positive</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Min Risk"
              type="number"
              min="0"
              max="100"
              value={filters.riskScoreMin}
              onChange={(e) => setFilters({ ...filters, riskScoreMin: e.target.value })}
              className="w-20"
            />
            <Input
              placeholder="Max Risk"
              type="number"
              min="0"
              max="100"
              value={filters.riskScoreMax}
              onChange={(e) => setFilters({ ...filters, riskScoreMax: e.target.value })}
              className="w-20"
            />
          </div>
          <Button variant="outline" onClick={() => setFilters({ source: '', type: '', severity: '', status: '', riskScoreMin: '', riskScoreMax: '', search: '' })}>
            Clear
          </Button>
        </div>
      </Card>

      {/* Threats List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Threat Alerts ({threats.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : threats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <p>No threat alerts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{threat.title}</h4>
                        <Badge variant={getStatusColor(threat.status)} size="sm">
                          {getStatusIcon(threat.status)}
                          <span className="ml-1">{threat.status}</span>
                        </Badge>
                        <Badge variant={getSeverityColor(threat.severity)} size="sm">
                          {threat.severity}
                        </Badge>
                        <Badge variant={getSourceColor(threat.source)} size="sm">
                          {threat.source}
                        </Badge>
                        <Badge variant={getTypeColor(threat.type)} size="sm">
                          {threat.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Risk Score
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={threat.riskScore} className="flex-1 h-2" />
                            <span className={`font-medium ${getRiskScoreColor(threat.riskScore)}`}>
                              {threat.riskScore}/100
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            Confidence
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={threat.confidence} className="flex-1 h-2" />
                            <span className={`font-medium ${getConfidenceColor(threat.confidence)}`}>
                              {threat.confidence}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Detected
                          </p>
                          <p className="text-gray-600">{new Date(threat.detectedAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor((Date.now() - new Date(threat.detectedAt).getTime()) / (1000 * 60 * 60))}h ago
                          </p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            Occurrences
                          </p>
                          <p className="text-gray-600">{threat.occurrenceCount}</p>
                          <p className="text-xs text-gray-500">
                            Last: {new Date(threat.lastSeenAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Investigator
                          </p>
                          <p className="text-gray-600">{threat.investigatedBy || 'Unassigned'}</p>
                        </div>
                      </div>

                      {/* Indicators */}
                      {(threat.indicators.ips.length > 0 || threat.indicators.domains.length > 0) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-sm mb-2">Threat Indicators:</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {threat.indicators.ips.map((ip, index) => (
                              <Badge key={index} variant="outline" size="sm">
                                IP: {ip}
                              </Badge>
                            ))}
                            {threat.indicators.domains.map((domain, index) => (
                              <Badge key={index} variant="outline" size="sm">
                                Domain: {domain}
                              </Badge>
                            ))}
                            {threat.indicators.patterns.map((pattern, index) => (
                              <Badge key={index} variant="outline" size="sm">
                                {pattern.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Automated Actions */}
                      {(threat.automatedActions.blocked || threat.automatedActions.quarantined || threat.automatedActions.alertSent) && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-sm text-blue-800 mb-2">Automated Actions:</p>
                          <div className="flex gap-4 text-sm text-blue-700">
                            {threat.automatedActions.blocked && <span>• Blocked</span>}
                            {threat.automatedActions.quarantined && <span>• Quarantined</span>}
                            {threat.automatedActions.alertSent && <span>• Alert Sent</span>}
                            {threat.automatedActions.ticketCreated && <span>• Ticket Created</span>}
                          </div>
                        </div>
                      )}

                      {/* Resolution */}
                      {threat.resolution && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-sm text-green-800">Resolution:</p>
                          <p className="text-sm text-green-700">{threat.resolution.outcome}</p>
                          <p className="text-xs text-green-600 mt-1">
                            Resolved by {threat.resolution.resolvedBy} on {new Date(threat.resolution.resolvedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedThreat(threat)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[700px] sm:w-[700px]">
                          <SheetHeader>
                            <SheetTitle>Threat Alert Details</SheetTitle>
                          </SheetHeader>
                          {selectedThreat && (
                            <ThreatDetails 
                              threat={selectedThreat} 
                              onStatusChange={handleStatusChange}
                              onAssign={handleAssignThreat}
                              onResolve={() => setShowResolveDialog(true)}
                            />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      {threat.status === 'NEW' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(threat.id, 'INVESTIGATING')}
                        >
                          Investigate
                        </Button>
                      )}
                      
                      {threat.status !== 'RESOLVED' && threat.status !== 'FALSE_POSITIVE' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedThreat(threat);
                            setShowResolveDialog(true);
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Resolve Threat Dialog */}
      {showResolveDialog && selectedThreat && (
        <ResolveThreatDialog
          threat={selectedThreat}
          open={showResolveDialog}
          onOpenChange={setShowResolveDialog}
          onSuccess={loadThreats}
        />
      )}
    </PageLayout>
  );
}

function ThreatDetails({ 
  threat, 
  onStatusChange, 
  onAssign, 
  onResolve 
}: { 
  threat: ThreatAlert; 
  onStatusChange: (id: string, status: string) => void;
  onAssign: (id: string, investigator: string) => void;
  onResolve: () => void;
}) {
  const [investigator, setInvestigator] = useState('');

  const handleAssignSubmit = () => {
    if (investigator) {
      onAssign(threat.id, investigator);
      setInvestigator('');
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Threat Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Alert ID</p>
            <p className="font-medium">{threat.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Source</p>
            <Badge variant={getSourceColor(threat.source)} size="sm">
              {threat.source}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant={getTypeColor(threat.type)} size="sm">
              {threat.type.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Severity</p>
            <Badge variant={getSeverityColor(threat.severity)} size="sm">
              {threat.severity}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(threat.status)} size="sm">
              {threat.status}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Investigator</p>
            <p className="font-medium">{threat.investigatedBy || 'Unassigned'}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h4 className="font-semibold mb-3">Risk Assessment</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Risk Score</p>
            <div className="flex items-center gap-2">
              <Progress value={threat.riskScore} className="flex-1" />
              <span className={`font-medium ${getRiskScoreColor(threat.riskScore)}`}>
                {threat.riskScore}/100
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
            <div className="flex items-center gap-2">
              <Progress value={threat.confidence} className="flex-1" />
              <span className={`font-medium ${getConfidenceColor(threat.confidence)}`}>
                {threat.confidence}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{threat.description}</p>
      </div>

      {/* Threat Indicators */}
      <div>
        <h4 className="font-semibold mb-3">Threat Indicators</h4>
        <div className="space-y-3">
          {threat.indicators.ips.length > 0 && (
            <div>
              <p className="font-medium text-sm">IP Addresses:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {threat.indicators.ips.map((ip, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {ip}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {threat.indicators.domains.length > 0 && (
            <div>
              <p className="font-medium text-sm">Domains:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {threat.indicators.domains.map((domain, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {threat.indicators.patterns.length > 0 && (
            <div>
              <p className="font-medium text-sm">Attack Patterns:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {threat.indicators.patterns.map((pattern, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {pattern.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Affected Assets */}
      <div>
        <h4 className="font-semibold mb-3">Affected Assets</h4>
        <div className="flex flex-wrap gap-2">
          {threat.affectedAssets.map((asset, index) => (
            <Badge key={index} variant="outline" size="sm">
              {asset}
            </Badge>
          ))}
        </div>
      </div>

      {/* Automated Actions */}
      <div>
        <h4 className="font-semibold mb-3">Automated Actions</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${threat.automatedActions.blocked ? 'bg-red-500' : 'bg-gray-300'}`}></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${threat.automatedActions.quarantined ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <span>Quarantined</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${threat.automatedActions.alertSent ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span>Alert Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${threat.automatedActions.ticketCreated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>Ticket Created</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="font-semibold mb-3">Timeline</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">First Detected:</span>
            <span>{new Date(threat.detectedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Seen:</span>
            <span>{new Date(threat.lastSeenAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Occurrence Count:</span>
            <span>{threat.occurrenceCount}</span>
          </div>
        </div>
      </div>

      {/* Resolution */}
      {threat.resolution && (
        <div>
          <h4 className="font-semibold mb-3">Resolution</h4>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Outcome</p>
                <p className="font-medium">{threat.resolution.outcome}</p>
              </div>
              <div>
                <p className="text-gray-600">Resolved By</p>
                <p className="font-medium">{threat.resolution.resolvedBy}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-600 text-sm">Details</p>
              <p className="text-sm">{threat.resolution.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {threat.status !== 'RESOLVED' && threat.status !== 'FALSE_POSITIVE' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Actions</h4>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(threat.id, 'INVESTIGATING')}
            >
              Start Investigation
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(threat.id, 'CONFIRMED')}
            >
              Confirm Threat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(threat.id, 'FALSE_POSITIVE')}
            >
              Mark False Positive
            </Button>
            <Button 
              size="sm"
              onClick={onResolve}
            >
              Resolve Threat
            </Button>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Assign to investigator..."
              value={investigator}
              onChange={(e) => setInvestigator(e.target.value)}
              className="w-48"
            />
            <Button size="sm" onClick={handleAssignSubmit}>
              Assign
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResolveThreatDialog({ 
  threat, 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  threat: ThreatAlert;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [resolution, setResolution] = useState({
    outcome: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await securityManagementService.resolveThreatAlert(threat.id, resolution);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to resolve threat:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Threat Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Resolution Outcome</label>
            <Select value={resolution.outcome} onValueChange={(value) => setResolution({ ...resolution, outcome: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="MONITORED">Monitored</SelectItem>
                <SelectItem value="IGNORED">Ignored</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Resolution Details</label>
            <Textarea
              value={resolution.details}
              onChange={(e) => setResolution({ ...resolution, details: e.target.value })}
              placeholder="Explain the resolution..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Resolve Threat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getSeverityColor(severity: string) {
  const colors: Record<string, string> = {
    CRITICAL: 'red',
    HIGH: 'orange',
    MEDIUM: 'yellow',
    LOW: 'blue'
  };
  return colors[severity] || 'gray';
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    NEW: 'red',
    INVESTIGATING: 'yellow',
    CONFIRMED: 'orange',
    FALSE_POSITIVE: 'gray',
    RESOLVED: 'green'
  };
  return colors[status] || 'gray';
}

function getSourceColor(source: string) {
  const colors: Record<string, string> = {
    IDS: 'blue',
    FIREWALL: 'orange',
    ANTIVIRUS: 'green',
    SIEM: 'purple',
    MANUAL: 'gray',
    EXTERNAL_FEED: 'indigo',
    ML_DETECTION: 'pink'
  };
  return colors[source] || 'gray';
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    MALWARE: 'red',
    SUSPICIOUS_LOGIN: 'orange',
    BRUTE_FORCE: 'yellow',
    SQL_INJECTION: 'purple',
    XSS: 'blue',
    ANOMALOUS_TRAFFIC: 'green',
    PRIVILEGE_ESCALATION: 'indigo',
    DATA_EXFILTRATION: 'red'
  };
  return colors[type] || 'gray';
}