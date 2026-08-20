import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { GitCompare, Plus, Layers, ArrowLeftRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ComparisonPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Opportunity Comparison"
        description="Evaluate multiple business categories or different candidate locations in a side-by-side comparative matrix."
        badge="Part 7 Focus"
        actions={
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Opportunity to Compare
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Comparative Matrix</CardTitle>
          <CardDescription>
            Multi-dimensional trade-off analysis between investment requirements, risk indices, and break-even horizons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<GitCompare className="w-6 h-6 text-[#FFBF24]" />}
            title="No Opportunities Selected for Comparison"
            description="The multi-venture comparative decision matrix will be implemented in Part 7 once business plans and location analyses are generated."
            actionLabel="Select Opportunities"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};
