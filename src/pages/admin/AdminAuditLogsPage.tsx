/**
 * BizMind – Administrator Audit Logs & Security Trails Page
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import {
  ScrollText,
  Search,
  RefreshCw,
  Download,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Filter,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS'>('ALL');

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExportCSV = () => {
    const headers = ['ID', 'Action', 'User', 'Details', 'Severity', 'IP Address', 'Timestamp'];
    const rows = logs.map((l) => [
      l.id,
      `"${l.action}"`,
      `"${l.user}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.severity,
      l.ipAddress || '127.0.0.1',
      l.timestamp,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bizmind_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(q));

    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Security & System Audit Trails"
          description="Immutable record of administrative actions, authentication attempts, role modifications, and ML retrain jobs."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[#27272A] bg-[#111113]">
        <div className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search audit trail by actor, action description, or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1D] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FFBF24]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-[#1A1A1D] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO Only</option>
              <option value="SUCCESS">SUCCESS Only</option>
              <option value="WARNING">WARNING Only</option>
              <option value="ALERT">ALERT Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#FFBF24]" />
              <span>Audit Event Records ({filteredLogs.length})</span>
            </CardTitle>
            <Badge variant="outline" size="sm">
              Tamper Evident Log
            </Badge>
          </div>
          <CardDescription className="text-xs text-[#A1A1AA]">
            Captures real-time RBAC events and state modifications.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A1A1AA] uppercase border-b border-[#27272A] bg-[#1A1A1D]/60 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4 text-right">Source IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#71717A]">
                      Loading audit records...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#71717A]">
                      No audit events match the active search.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1A1A1D]/40 transition-colors">
                      <td className="py-3.5 px-4 text-[#71717A] font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.severity === 'ALERT'
                              ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                              : log.severity === 'WARNING'
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                              : log.severity === 'SUCCESS'
                              ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                              : 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#FFBF24]">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-[#F8FAFC]">
                        {log.user}
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1AA] max-w-md truncate">
                        {log.details}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#71717A] text-right">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
