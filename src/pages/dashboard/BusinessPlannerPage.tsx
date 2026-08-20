import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { FileSpreadsheet, Plus, Sparkles, Layers, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const BusinessPlannerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Planner"
        description="Formulate, structure, and model new business concepts with capital benchmarks and feasibility criteria."
        badge="Part 2 Focus"
        actions={
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            New Business Plan
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Planner Workspace Shell */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Business Plans</CardTitle>
              <CardDescription>
                Stored business plans with target capital allocation and operational timelines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<FileSpreadsheet className="w-6 h-6 text-[#FFBF24]" />}
                title="No Business Plans Created Yet"
                description="The Business Planner module will be implemented in Part 2, including full form validation, category selection, and state persistence."
                actionLabel="Draft New Plan"
                onAction={() => {}}
              />
            </CardContent>
          </Card>
        </div>

        {/* Informational Guidelines Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFBF24]" />
                <span>Planned Capabilities</span>
              </CardTitle>
              <CardDescription>
                Features scheduled for Part 2 build.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-[#A1A1AA]">
              <div className="flex items-start gap-2.5 p-2 rounded bg-[#111113] border border-[#27272A]">
                <Layers className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F8FAFC]">Category Benchmarks:</span>
                  <p className="text-[11px] text-[#71717A] mt-0.5">Automated industry capital ranges and margin expectations.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded bg-[#111113] border border-[#27272A]">
                <DollarSign className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F8FAFC]">Capital Sizing:</span>
                  <p className="text-[11px] text-[#71717A] mt-0.5">Fixed asset investment vs. working capital reserve modeling.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded bg-[#111113] border border-[#27272A]">
                <Calendar className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F8FAFC]">Timeline Milestones:</span>
                  <p className="text-[11px] text-[#71717A] mt-0.5">Target launch date and operational ramp-up periods.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
