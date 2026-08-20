import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, FolderPlus } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const SavedPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Opportunities & Bookmarks"
        description="Repository of bookmarked business ventures, candidate locations, and customized analysis dossiers."
        badge="Repository"
        actions={
          <Button size="sm" leftIcon={<FolderPlus className="w-3.5 h-3.5" />}>
            Create Opportunity Folder
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Bookmarked Opportunities</CardTitle>
          <CardDescription>
            Archived and in-progress business venture evaluations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Bookmark className="w-6 h-6 text-[#FFBF24]" />}
            title="No Saved Businesses Yet"
            description="As you evaluate business plans and locations across the platform, you can bookmark and annotate them here for subsequent review."
            actionLabel="Explore Planner"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};
