import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { Building2, MapPin, Users, Briefcase, FileText } from 'lucide-react';

export const BUSINESS_CATEGORIES = [
  'Food & Beverage',
  'Retail',
  'Grocery',
  'Clothing',
  'Electronics',
  'Education',
  'Healthcare',
  'Fitness',
  'Beauty & Salon',
  'Automotive',
  'Travel & Tourism',
  'Professional Services',
  'Technology',
  'Home Services',
  'Manufacturing',
  'Other',
];

export const BUSINESS_MODELS = [
  { value: 'B2C', label: 'B2C (Direct to Consumer)' },
  { value: 'B2B', label: 'B2B (Business to Business)' },
  { value: 'Subscription', label: 'Subscription / Recurring Pass' },
  { value: 'Service-based', label: 'Service-based / Hourly / Booking' },
  { value: 'Product-based', label: 'Product-based / Unit Sales' },
  { value: 'Marketplace', label: 'Marketplace / Platform Aggregator' },
  { value: 'Other', label: 'Other' },
];

export interface BusinessInfoFormData {
  businessName: string;
  category: string;
  location: string;
  targetCustomer: string;
  businessModel: string;
  description: string;
  executiveSummary: string;
}

interface Step1Props {
  data: BusinessInfoFormData;
  onChange: (field: keyof BusinessInfoFormData, value: string) => void;
  errors?: Partial<Record<keyof BusinessInfoFormData, string>>;
}

export const Step1BusinessInfo: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  return (
    <Card className="border-[#27272A] bg-[#111113]">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Business Concept & Categorization</CardTitle>
            <CardDescription>
              Define your business name, target demographic, industry category, and operational framework.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="planner-business-name"
            label="Proposed Business Name *"
            placeholder="e.g. Craft Roast Specialty Coffee"
            value={data.businessName}
            onChange={(e) => onChange('businessName', e.target.value)}
            error={errors?.businessName}
            helperText="The trade name or working title for this venture"
          />

          <Select
            id="planner-business-category"
            label="Industry Category *"
            value={data.category}
            onChange={(e) => onChange('category', e.target.value)}
            options={BUSINESS_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            helperText="Industry benchmark baseline"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>Target Location / City *</span>
            </label>
            <Input
              id="planner-business-location"
              placeholder="e.g. Indiranagar, Bengaluru"
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              error={errors?.location}
              helperText="City, neighborhood, or market trade area"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>Target Customer Profile</span>
            </label>
            <Input
              id="planner-target-customer"
              placeholder="e.g. Young professionals & college students"
              value={data.targetCustomer}
              onChange={(e) => onChange('targetCustomer', e.target.value)}
              helperText="Primary target demographic or customer segment"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>Business Model *</span>
            </label>
            <Select
              id="planner-business-model"
              value={data.businessModel}
              onChange={(e) => onChange('businessModel', e.target.value)}
              options={BUSINESS_MODELS}
              helperText="Primary revenue and distribution structure"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Textarea
            id="planner-business-description"
            label="Business Description & Offerings"
            rows={3}
            placeholder="Describe your core product or service, unique value proposition, and customer experience..."
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            helperText="Overview of products, services, and operational setup"
          />

          <Textarea
            id="planner-executive-summary"
            label="Executive Summary & Strategic Goals"
            rows={3}
            placeholder="Key competitive advantage, growth vision, and operational timeline targets..."
            value={data.executiveSummary}
            onChange={(e) => onChange('executiveSummary', e.target.value)}
            helperText="Strategic objectives and rationale for capital investment"
          />
        </div>
      </CardContent>
    </Card>
  );
};
