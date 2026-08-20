import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Sparkles, CheckCircle2, Lightbulb, Compass } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const RecommendationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Actionable Business Recommendations"
        description="Prescriptive guidance, risk mitigations, alternative locations, and capital adjustments derived from analysis."
        badge="Part 6 Focus"
      />

      <Card>
        <CardHeader>
          <CardTitle>Decision Support Recommendations</CardTitle>
          <CardDescription>
            Strategically ranked advice categorized across location, pricing, marketing, and capital sizing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Sparkles className="w-6 h-6 text-[#FFBF24]" />}
            title="No Recommendations Available"
            description="The recommendation generation engine is scheduled for Part 6, synthesizing insights from business planning, financial feasibility, and ML predictions."
            actionLabel="View Overview"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};
