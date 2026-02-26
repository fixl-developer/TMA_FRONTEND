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
import { securityManagementService, type SecurityIncident } from '@/shared/services/securityManagementService';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Users,
  Calendar,
  User,
  MessageSquare,
  Upload,
  ExternalLink,
  Shield
} from 'lucide-react';

export default function SecurityIncidentsPage() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await securityManagementService.getSecurityIncidents(filters);
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load security incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (incidentId: string, newStatus: string, notes?: string) => {
    try {
      await securityManagementService.updateIncidentStatus(incidentId, newStatus, notes);
      loadIncidents();
    } catch (error) {
      console.error('Failed to update incident status:', error);
    }
  };

  const handleAssignIncident = async (incidentId: string, assignee: string) => {
    try {
      await securityManagementService.assignIncident(incidentId, assignee);
      loadIncidents();
    } catch (error) {
      console.error('Failed to assign incident:', error);
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
      OPEN: 'red',
      INVESTIGATING: 'yellow',
      CONTAINED: 'blue',
      RESOLVED: 'green',
      CLOSED: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertTriangle className="w-4 h-4" />;
      case 'INVESTIGATING':
        return <Clock className="w-4 h-4" />;
      case 'CONTAINED':
        return <Shield className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      P0: 'red',
      P1: 'orange',
      P2: 'yellow',
      P3: 'blue'
    };
    return colors[priority] || 'gray';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      DATA_BREACH: 'red',
      UNAUTHORIZED_ACCESS: 'orange',
      MALWARE: 'purple',
      PHISHING: 'yellow',
      DDoS: 'blue',
      INSIDER_THREAT: 'indigo',
      API_ABUSE: 'green',
      SYSTEM_COMPROMISE: 'red'
    };
    return colors[type] || 'gray';
  };

  return (
    <PageLayout>
      <PageHeader
        title="Security Incidents"
        description="Manage and investigate security incidents"
        icon={AlertTriangle}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Incident
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search incidents..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="DATA_BREACH">Data Breach</SelectItem>
              <SelectItem value="UNAUTHORIZED_ACCESS">Unauthorized Access</SelectItem>
              <SelectItem value="MALWARE">Malware</SelectItem>
              <SelectItem value="PHISHING">Phishing</SelectItem>
              <SelectItem value="DDoS">DDoS</SelectItem>
              <SelectItem value="INSIDER_THREAT">Insider Threat</SelectItem>
              <SelectItem value="API_ABUSE">API Abuse</SelectItem>
              <SelectItem value="SYSTEM_COMPROMISE">System Compromise</SelectItem>
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
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="INVESTIGATING">Investigating</SelectItem>
              <SelectItem value="CONTAINED">Contained</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="P0">P0 - Critical</SelectItem>
              <SelectItem value="P1">P1 - High</SelectItem>
              <SelectItem value="P2">P2 - Medium</SelectItem>
              <SelectItem value="P3">P3 - Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ type: '', severity: '', status: '', priority: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Incidents List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security Incidents ({incidents.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <p>No security incidents found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{incident.title}</h4>
                        <Badge variant={getStatusColor(incident.status)} size="sm">
                          {getStatusIcon(incident.status)}
                          <span className="ml-1">{incident.status}</span>
                        </Badge>
                        <Badge variant={getSeverityColor(incident.severity)} size="sm">
                          {incident.severity}
                        </Badge>
                        <Badge variant={getPriorityColor(incident.priority)} size="sm">
                          {incident.priority}
                        </Badge>
                        <Badge variant={getTypeColor(incident.type)} size="sm">
                          {incident.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Detected
                          </p>
                          <p className="text-gray-600">{new Date(incident.detectedAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor((Date.now() - new Date(incident.detectedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Impact
                          </p>
                          <p className="text-gray-600">{incident.affectedUsers} users</p>
                          <p className="text-xs text-gray-500">{incident.affectedSystems.length} systems</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Assigned To
                          </p>
                          <p className="text-gray-600">{incident.assignedTo || 'Unassigned'}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Evidence
                          </p>
                          <p className="text-gray-600">{incident.evidence.length} files</p>
                        </div>
                      </div>

                      {/* Impact Summary */}
                      {(incident.impact.dataExposed || incident.impact.serviceDisruption || incident.impact.financialLoss > 0) && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="font-medium text-sm text-red-800">Impact Summary:</p>
                          <div className="flex gap-4 text-sm text-red-700 mt-1">
                            {incident.impact.dataExposed && <span>• Data Exposed</span>}
                            {incident.impact.serviceDisruption && <span>• Service Disruption</span>}
                            {incident.impact.financialLoss > 0 && <span>• Financial Loss: ${incident.impact.financialLoss}</span>}
                            {incident.impact.complianceImpact && <span>• Compliance Impact</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[800px] sm:w-[800px]">
                          <SheetHeader>
                            <SheetTitle>Incident Details</SheetTitle>
                          </SheetHeader>
                          {selectedIncident && (
                            <IncidentDetails 
                              incident={selectedIncident} 
                              onStatusChange={handleStatusChange}
                              onAssign={handleAssignIncident}
                            />
                          )}
                        </SheetContent>
                      </Sheet>
                      
                      {incident.status !== 'RESOLVED' && incident.status !== 'CLOSED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(incident.id, 'INVESTIGATING', 'Investigation started')}
                        >
                          Investigate
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

      {/* Create Incident Dialog */}
      {showCreateDialog && (
        <CreateIncidentDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadIncidents}
        />
      )}
    </PageLayout>
  );
}

function IncidentDetails({ 
  incident, 
  onStatusChange, 
  onAssign 
}: { 
  incident: SecurityIncident; 
  onStatusChange: (id: string, status: string, notes?: string) => void;
  onAssign: (id: string, assignee: string) => void;
}) {
  const [statusChangeNotes, setStatusChangeNotes] = useState('');
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleStatusChangeSubmit = () => {
    if (newStatus && statusChangeNotes) {
      onStatusChange(incident.id, newStatus, statusChangeNotes);
      setShowStatusChange(false);
      setStatusChangeNotes('');
      setNewStatus('');
    }
  };

  const handleAssignSubmit = () => {
    if (assignee) {
      onAssign(incident.id, assignee);
      setAssignee('');
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Incident Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Incident ID</p>
            <p className="font-medium">{incident.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <Badge variant={getTypeColor(incident.type)} size="sm">
              {incident.type.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Severity</p>
            <Badge variant={getSeverityColor(incident.severity)} size="sm">
              {incident.severity}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(incident.status)} size="sm">
              {incident.status}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Priority</p>
            <Badge variant={getPriorityColor(incident.priority)} size="sm">
              {incident.priority}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Assigned To</p>
            <p className="font-medium">{incident.assignedTo || 'Unassigned'}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-3">Description</h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{incident.description}</p>
      </div>

      {/* Impact Assessment */}
      <div>
        <h4 className="font-semibold mb-3">Impact Assessment</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Data Exposed</p>
            <p className="font-medium">{incident.impact.dataExposed ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-600">Service Disruption</p>
            <p className="font-medium">{incident.impact.serviceDisruption ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-600">Financial Loss</p>
            <p className="font-medium">${incident.impact.financialLoss}</p>
          </div>
          <div>
            <p className="text-gray-600">Reputation Risk</p>
            <Badge variant={getSeverityColor(incident.impact.reputationRisk)} size="sm">
              {incident.impact.reputationRisk}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600">Compliance Impact</p>
            <p className="font-medium">{incident.impact.complianceImpact ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-600">Affected Users</p>
            <p className="font-medium">{incident.affectedUsers}</p>
          </div>
        </div>
      </div>

      {/* Affected Systems */}
      <div>
        <h4 className="font-semibold mb-3">Affected Systems</h4>
        <div className="flex flex-wrap gap-2">
          {incident.affectedSystems.map((system, index) => (
            <Badge key={index} variant="outline" size="sm">
              {system}
            </Badge>
          ))}
        </div>
      </div>

      {/* Evidence */}
      <div>
        <h4 className="font-semibold mb-3">Evidence ({incident.evidence.length})</h4>
        {incident.evidence.length === 0 ? (
          <p className="text-sm text-gray-500">No evidence uploaded</p>
        ) : (
          <div className="space-y-2">
            {incident.evidence.map((evidence, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{evidence.filename}</p>
                    <p className="text-xs text-gray-500">
                      {evidence.type} • Uploaded by {evidence.uploadedBy} on {new Date(evidence.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <h4 className="font-semibold mb-3">Timeline</h4>
        <div className="space-y-3">
          {incident.timeline.map((event, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{event.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{event.details}</p>
                <p className="text-xs text-gray-500">by {event.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mitigation */}
      {incident.mitigation && (
        <div>
          <h4 className="font-semibold mb-3">Mitigation</h4>
          <div className="space-y-3">
            {incident.mitigation.actions.length > 0 && (
              <div>
                <p className="font-medium text-sm">Actions Taken:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {incident.mitigation.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            {incident.mitigation.preventiveMeasures.length > 0 && (
              <div>
                <p className="font-medium text-sm">Preventive Measures:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {incident.mitigation.preventiveMeasures.map((measure, index) => (
                    <li key={index}>{measure}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {incident.status !== 'RESOLVED' && incident.status !== 'CLOSED' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Actions</h4>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowStatusChange(true)}
            >
              Change Status
            </Button>
            <div className="flex gap-2">
              <Input
                placeholder="Assign to..."
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-48"
              />
              <Button size="sm" onClick={handleAssignSubmit}>
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Dialog */}
      {showStatusChange && (
        <Dialog open={showStatusChange} onOpenChange={setShowStatusChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Incident Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                    <SelectItem value="CONTAINED">Contained</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={statusChangeNotes}
                  onChange={(e) => setStatusChangeNotes(e.target.value)}
                  placeholder="Enter notes about the status change..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowStatusChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChangeSubmit}>
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CreateIncidentDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    severity: '',
    priority: '',
    description: '',
    affectedSystems: '',
    affectedUsers: '',
    reportedBy: 'admin@platform.com'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await securityManagementService.createSecurityIncident({
        ...formData,
        affectedSystems: formData.affectedSystems.split(',').map(s => s.trim()),
        affectedUsers: parseInt(formData.affectedUsers) || 0,
        affectedTenants: [],
        detectedAt: new Date().toISOString(),
        impact: {
          dataExposed: false,
          serviceDisruption: false,
          financialLoss: 0,
          reputationRisk: 'LOW',
          complianceImpact: false
        },
        evidence: [],
        mitigation: {
          actions: [],
          preventiveMeasures: [],
          lessonsLearned: []
        },
        notifications: {
          internal: false,
          external: false,
          regulatory: false,
          customers: false
        }
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create incident:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Security Incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DATA_BREACH">Data Breach</SelectItem>
                  <SelectItem value="UNAUTHORIZED_ACCESS">Unauthorized Access</SelectItem>
                  <SelectItem value="MALWARE">Malware</SelectItem>
                  <SelectItem value="PHISHING">Phishing</SelectItem>
                  <SelectItem value="DDoS">DDoS</SelectItem>
                  <SelectItem value="INSIDER_THREAT">Insider Threat</SelectItem>
                  <SelectItem value="API_ABUSE">API Abuse</SelectItem>
                  <SelectItem value="SYSTEM_COMPROMISE">System Compromise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Severity</label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P0">P0 - Critical</SelectItem>
                <SelectItem value="P1">P1 - High</SelectItem>
                <SelectItem value="P2">P2 - Medium</SelectItem>
                <SelectItem value="P3">P3 - Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Affected Systems (comma-separated)</label>
              <Input
                value={formData.affectedSystems}
                onChange={(e) => setFormData({ ...formData, affectedSystems: e.target.value })}
                placeholder="System 1, System 2, ..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Affected Users (count)</label>
              <Input
                type="number"
                value={formData.affectedUsers}
                onChange={(e) => setFormData({ ...formData, affectedUsers: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Incident
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
    OPEN: 'red',
    INVESTIGATING: 'yellow',
    CONTAINED: 'blue',
    RESOLVED: 'green',
    CLOSED: 'gray'
  };
  return colors[status] || 'gray';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    P0: 'red',
    P1: 'orange',
    P2: 'yellow',
    P3: 'blue'
  };
  return colors[priority] || 'gray';
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    DATA_BREACH: 'red',
    UNAUTHORIZED_ACCESS: 'orange',
    MALWARE: 'purple',
    PHISHING: 'yellow',
    DDoS: 'blue',
    INSIDER_THREAT: 'indigo',
    API_ABUSE: 'green',
    SYSTEM_COMPROMISE: 'red'
  };
  return colors[type] || 'gray';
}