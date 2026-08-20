import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Feasibility Reports"
        description="Comprehensive analytical dossiers summarizing market size, financial feasibility, and ML success scores."
        badge="Part 8 Focus"
        actions={
          <Button size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
            Generate New Report
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Generated Feasibility Reports</CardTitle>
          <CardDescription>
            Downloadable reports and structured executive summaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<FileText className="w-6 h-6 text-[#FFBF24]" />}
            title="No Feasibility Reports Generated"
            description="The report generation and document compilation pipeline will be integrated in Part 8, allowing PDF and executive summary export."
            actionLabel="Generate Report"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};
