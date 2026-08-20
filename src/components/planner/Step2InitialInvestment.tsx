import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import {
  Coins,
  Building,
  Hammer,
  Cpu,
  Armchair,
  FileCheck2,
  Package,
  Megaphone,
  PlusCircle,
  PiggyBank,
} from 'lucide-react';

export interface InitialInvestmentFormData {
  propertyDeposit: number;
  interiorSetup: number;
  equipmentCost: number;
  furnitureCost: number;
  licenseCost: number;
  technologyCost: number;
  initialInventory: number;
  launchMarketing: number;
  otherInitialCost: number;
}

interface Step2Props {
  data: InitialInvestmentFormData;
  onChange: (field: keyof InitialInvestmentFormData, value: number) => void;
}

interface InvestmentFieldDef {
  key: keyof InitialInvestmentFormData;
  label: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
}

export const Step2InitialInvestment: React.FC<Step2Props> = ({ data = {} as InitialInvestmentFormData, onChange }) => {
  const safeData = data || {} as InitialInvestmentFormData;
  const fields: InvestmentFieldDef[] = [
    {
      key: 'propertyDeposit',
      label: 'Security / Rental Deposit',
      description: 'Advance deposit paid to property owner (often 3–6 months rent)',
      icon: <Building className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 200000',
    },
    {
      key: 'interiorSetup',
      label: 'Interior Fit-out & Renovation',
      description: 'Flooring, lighting, false ceiling, partitions, paint, plumbing',
      icon: <Hammer className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 250000',
    },
    {
      key: 'equipmentCost',
      label: 'Machinery & Primary Equipment',
      description: 'Kitchen appliances, specialized tools, coffee machines, POS units',
      icon: <Cpu className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 150000',
    },
    {
      key: 'furnitureCost',
      label: 'Furniture & Fixtures',
      description: 'Chairs, tables, display counters, reception desks, decor',
      icon: <Armchair className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 60000',
    },
    {
      key: 'licenseCost',
      label: 'Licenses, Permits & Registrations',
      description: 'FSSAI, Trade license, GST, Fire NOC, Trademark filing',
      icon: <FileCheck2 className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 25000',
    },
    {
      key: 'technologyCost',
      label: 'Tech Infrastructure & Hardware',
      description: 'Billing hardware, tablets, CCTV cameras, sound system, printers',
      icon: <Cpu className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 30000',
    },
    {
      key: 'initialInventory',
      label: 'Opening Raw Material / Inventory',
      description: 'Initial stock of consumables, packaging, ingredients, merchandise',
      icon: <Package className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 40000',
    },
    {
      key: 'launchMarketing',
      label: 'Pre-launch Branding & Marketing',
      description: 'Signage board, launch campaign, flyers, influencer collabs',
      icon: <Megaphone className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 25000',
    },
    {
      key: 'otherInitialCost',
      label: 'Contingency & Other Initial Costs',
      description: 'Working capital cushion and unforeseen setup expenditures',
      icon: <PlusCircle className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 20000',
    },
  ];

  const totalInvestment: number = (
    Number(safeData?.propertyDeposit || 0) +
    Number(safeData?.interiorSetup || 0) +
    Number(safeData?.equipmentCost || 0) +
    Number(safeData?.furnitureCost || 0) +
    Number(safeData?.licenseCost || 0) +
    Number(safeData?.technologyCost || 0) +
    Number(safeData?.initialInventory || 0) +
    Number(safeData?.launchMarketing || 0) +
    Number(safeData?.otherInitialCost || 0)
  );

  const handleNumberChange = (key: keyof InitialInvestmentFormData, raw: string) => {
    const clean = raw.replace(/[^0-9]/g, '');
    onChange(key, clean ? parseInt(clean, 10) : 0);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Initial Investment & Capital Sizing (CapEx)</CardTitle>
                <CardDescription>
                  Itemize all upfront capital expenditures required before opening the doors.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1A1A1D] border border-[#FFBF24]/30 px-4 py-2 rounded-xl self-start sm:self-auto">
              <PiggyBank className="w-5 h-5 text-[#FFBF24]" />
              <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                  Total Initial Capital
                </p>
                <p className="text-base font-bold text-[#FFBF24] font-mono">
                  {formatCurrency(totalInvestment)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((f) => {
              const val = Number(safeData?.[f.key]) || 0;
              const pct = totalInvestment > 0 ? ((val / totalInvestment) * 100).toFixed(1) : '0';

              return (
                <div
                  key={f.key}
                  className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A] hover:border-[#FFBF24]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                        {f.icon}
                        <span>{f.label}</span>
                      </label>
                      {val > 0 && (
                        <span className="text-[10px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 px-1.5 py-0.2 rounded">
                          {pct}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#71717A] mb-2.5 leading-snug">{f.description}</p>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A]">
                      ₹
                    </span>
                    <input
                      id={`input-${f.key}`}
                      type="text"
                      inputMode="numeric"
                      placeholder={f.placeholder}
                      value={val === 0 ? '' : val.toLocaleString('en-IN')}
                      onChange={(e) => handleNumberChange(f.key, e.target.value)}
                      className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-7 pr-3 py-2 text-xs text-[#F8FAFC] font-mono font-semibold focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Allocation Progress Bar */}
          {totalInvestment > 0 && (
            <div className="mt-4 pt-4 border-t border-[#27272A] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                <span>CapEx Allocation Breakdown</span>
                <span className="font-mono text-[#F8FAFC]">{formatCurrency(totalInvestment)}</span>
              </div>
              <div className="h-2 rounded-full bg-[#1A1A1D] flex overflow-hidden">
                {fields.map((f, i) => {
                  const val = Number(safeData?.[f.key]) || 0;
                  if (!val || totalInvestment === 0) return null;
                  const pct = (val / totalInvestment) * 100;
                  const colors = [
                    'bg-[#FFBF24]',
                    'bg-[#38BDF8]',
                    'bg-[#22C55E]',
                    'bg-[#F472B6]',
                    'bg-[#A78BFA]',
                    'bg-[#F97316]',
                    'bg-[#EAB308]',
                    'bg-[#06B6D4]',
                    'bg-[#84CC16]',
                  ];
                  return (
                    <div
                      key={f.key}
                      style={{ width: `${pct}%` }}
                      className={`${colors[i % colors.length]} transition-all`}
                      title={`${f.label}: ${pct.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
