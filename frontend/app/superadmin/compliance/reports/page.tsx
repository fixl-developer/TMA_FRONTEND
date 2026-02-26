'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { complianceManagementService, type ComplianceReport } from '@/shared/services/complianceManagementService';
import { 
  FileText, 
  Search, 
  Download, 
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Shield
} from 'lucide-react';

export default function ComplianceReportsPage() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [filters, setFilters] = useState({
    framework: '',
    reportType: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await complianceManagementService.getComplianceReports(filters);
      setReports(data);
    } catch (error) {
      console.error('Failed to load compliance reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      IN_PROGRESS: 'yellow',
      COMPLETED: 'green',
      SUBMITTED: 'blue',
      APPROVED: 'green',
      FAILED: 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />;
      case 'COMPLETED':
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'FAILED':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Compliance Reports"
        description="Manage compliance audits and certifications"
        icon={FileText}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.framework} onValueChange={(value) => setFilters({ ...filters, framework: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Frameworks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Frameworks</SelectItem>
              <SelectItem value="SOC2">SOC2</SelectItem>
              <SelectItem value="ISO27001">ISO27001</SelectItem>
              <SelectItem value="GDPR">GDPR</SelectItem>
              <SelectItem value="CCPA">CCPA</SelectItem>
              <SelectItem value="PCI_DSS">PCI DSS</SelectItem>
              <SelectItem value="HIPAA">HIPAA</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.reportType} onValueChange={(value) => setFilters({ ...filters, reportType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="AUDIT">Audit</SelectItem>
              <SelectItem value="ASSESSMENT">Assessment</SelectItem>
              <SelectItem value="CERTIFICATION">Certification</SelectItem>
              <SelectItem value="SELF_ASSESSMENT">Self Assessment</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setFilters({ framework: '', reportType: '', status: '', search: '' })}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Reports List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Reports ({reports.length})</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No compliance reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{report.framework} {report.reportType}</h4>
                        <Badge variant={getStatusColor(report.status)} size="sm">
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Period
                          </p>
                          <p className="text-gray-600">
                            {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Auditor
                          </p>
                          <p className="text-gray-600">{report.auditor || 'Internal'}</p>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Controls
                          </p>
                          <p className="text-gray-600">{report.controls.length} total</p>
                        </div>
                        <div>
                          <p className="font-medium">Compliance</p>
                          <p className="text-gray-600">
                            {Math.round((report.findings.compliant / (report.findings.compliant + report.findings.nonCompliant + report.findings.partiallyCompliant)) * 100)}%
                          </p>
                        </div>
                      </div>

                      {/* Findings Summary */}
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>{report.findings.compliant} Compliant</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span>{report.findings.nonCompliant} Non-Compliant</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>{report.findings.partiallyCompliant} Partially Compliant</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-400 rounded"></div>
                          <span>{report.findings.notApplicable} N/A</span>
                        </div>
                      </div>
                    </div>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[800px] sm:w-[800px] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Report Details</SheetTitle>
                        </SheetHeader>
                        {selectedReport && <ReportDetails report={selectedReport} />}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
}

function ReportDetails({ report }: { report: ComplianceReport }) {
  return (
    <div className="space-y-6 mt-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-semibold mb-3">Report Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Report ID</p>
            <p className="font-medium">{report.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Framework</p>
            <Badge variant="blue" size="sm">{report.framework}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <p className="font-medium">{report.reportType.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <Badge variant={getStatusColor(report.status)} size="sm">{report.status.replace('_', ' ')}</Badge>
          </div>
          <div>
            <p className="text-gray-600">Auditor</p>
            <p className="font-medium">{report.auditor || 'Internal Assessment'}</p>
          </div>
          <div>
            <p className="text-gray-600">Created By</p>
            <p className="font-medium">{report.createdBy}</p>
          </div>
        </div>
      </div>

      {/* Period */}
      <div>
        <h4 className="font-semibold mb-3">Audit Period</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Start Date</p>
            <p className="font-medium">{new Date(report.period.start).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">End Date</p>
            <p className="font-medium">{new Date(report.period.end).toLocaleDateString()}</p>
          </div>
          {report.nextAuditDate && (
            <div>
              <p className="text-gray-600">Next Audit</p>
              <p className="font-medium">{new Date(report.nextAuditDate).toLocaleDateString()}</p>
            </div>
          )}
          {report.certificationExpiry && (
            <div>
              <p className="text-gray-600">Certification Expiry</p>
              <p className="font-medium">{new Date(report.certificationExpiry).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Findings Summary */}
      <div>
        <h4 className="font-semibold mb-3">Findings Summary</h4>
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-green-50">
            <p className="text-2xl font-bold text-green-700">{report.findings.compliant}</p>
            <p className="text-sm text-green-600">Compliant</p>
          </Card>
          <Card className="p-4 bg-red-50">
            <p className="text-2xl font-bold text-red-700">{report.findings.nonCompliant}</p>
            <p className="text-sm text-red-600">Non-Compliant</p>
          </Card>
          <Card className="p-4 bg-yellow-50">
            <p className="text-2xl font-bold text-yellow-700">{report.findings.partiallyCompliant}</p>
            <p className="text-sm text-yellow-600">Partially Compliant</p>
          </Card>
          <Card className="p-4 bg-gray-50">
            <p className="text-2xl font-bold text-gray-700">{report.findings.notApplicable}</p>
            <p className="text-sm text-gray-600">Not Applicable</p>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div>
        <h4 className="font-semibold mb-3">Controls ({report.controls.length})</h4>
        <div className="space-y-3">
          {report.controls.map((control) => (
            <div key={control.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{control.id} - {control.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{control.notes}</p>
                </div>
                <Badge variant={getControlStatusColor(control.status)} size="sm">
                  {control.status.replace('_', ' ')}
                </Badge>
              </div>
              {control.evidence.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-600">Evidence:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {control.evidence.map((evidence, idx) => (
                      <Badge key={idx} variant="outline" size="sm">{evidence}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Recommendations</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            {report.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    IN_PROGRESS: 'yellow',
    COMPLETED: 'green',
    SUBMITTED: 'blue',
    APPROVED: 'green',
    FAILED: 'red'
  };
  return colors[status] || 'gray';
}

function getControlStatusColor(status: string) {
  const colors: Record<string, string> = {
    COMPLIANT: 'green',
    NON_COMPLIANT: 'red',
    PARTIALLY_COMPLIANT: 'yellow',
    NOT_APPLICABLE: 'gray'
  };
  return colors[status] || 'gray';
}
