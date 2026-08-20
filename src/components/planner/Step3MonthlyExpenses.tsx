import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import {
  Wallet,
  Home,
  Users,
  Zap,
  Wifi,
  Wrench,
  Megaphone,
  Truck,
  ShieldCheck,
  Laptop,
  CreditCard,
  PlusCircle,
  TrendingDown,
} from 'lucide-react';

export interface MonthlyExpensesFormData {
  rent: number;
  salaries: number;
  utilities: number;
  internet: number;
  maintenance: number;
  marketing: number;
  transportation: number;
  insurance: number;
  software: number;
  loanEmi: number;
  otherExpenses: number;
}

interface Step3Props {
  data: MonthlyExpensesFormData;
  onChange: (field: keyof MonthlyExpensesFormData, value: number) => void;
}

interface ExpenseFieldDef {
  key: keyof MonthlyExpensesFormData;
  label: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
}

export const Step3MonthlyExpenses: React.FC<Step3Props> = ({ data = {} as MonthlyExpensesFormData, onChange }) => {
  const safeData = data || {} as MonthlyExpensesFormData;
  const fields: ExpenseFieldDef[] = [
    {
      key: 'rent',
      label: 'Monthly Commercial Rent',
      description: 'Physical lease cost for storefront, office, or facility',
      icon: <Home className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 50000',
    },
    {
      key: 'salaries',
      label: 'Staff Salaries & Wages',
      description: 'Monthly payroll for full-time & part-time employees and baristas/cooks',
      icon: <Users className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 60000',
    },
    {
      key: 'utilities',
      label: 'Electricity, Water & Gas',
      description: 'Commercial power, generator fuel, water and cooking gas',
      icon: <Zap className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 10000',
    },
    {
      key: 'internet',
      label: 'High-speed Internet & Phone',
      description: 'Broadband connection, landline, and customer Wi-Fi subscription',
      icon: <Wifi className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 3000',
    },
    {
      key: 'maintenance',
      label: 'Repairs & Facility Maintenance',
      description: 'Periodic equipment service, pest control, cleaning, deep maintenance',
      icon: <Wrench className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 5000',
    },
    {
      key: 'marketing',
      label: 'Ongoing Marketing & Ads',
      description: 'Monthly social ads, Google Maps optimization, local promos, flyers',
      icon: <Megaphone className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 8000',
    },
    {
      key: 'transportation',
      label: 'Logistics & Local Travel',
      description: 'Delivery runs, inventory transport, and staff commute allowances',
      icon: <Truck className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 4000',
    },
    {
      key: 'insurance',
      label: 'Business & Liability Insurance',
      description: 'Monthly amortized cost of fire, theft, and public liability cover',
      icon: <ShieldCheck className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 2000',
    },
    {
      key: 'software',
      label: 'SaaS, POS & Cloud Subscriptions',
      description: 'Accounting (Zoho/Tally), POS software, HR software subscriptions',
      icon: <Laptop className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 3000',
    },
    {
      key: 'loanEmi',
      label: 'Bank Loan Repayment / EMI',
      description: 'Monthly loan installment principal + interest (if funded by debt)',
      icon: <CreditCard className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 0',
    },
    {
      key: 'otherExpenses',
      label: 'Miscellaneous Admin Costs',
      description: 'Stationery, packaging buffers, legal compliance, accountant fees',
      icon: <PlusCircle className="w-4 h-4 text-[#FFBF24]" />,
      placeholder: 'e.g. 5000',
    },
  ];

  const totalFixedExpenses: number = (
    Number(safeData?.rent || 0) +
    Number(safeData?.salaries || 0) +
    Number(safeData?.utilities || 0) +
    Number(safeData?.internet || 0) +
    Number(safeData?.maintenance || 0) +
    Number(safeData?.marketing || 0) +
    Number(safeData?.transportation || 0) +
    Number(safeData?.insurance || 0) +
    Number(safeData?.software || 0) +
    Number(safeData?.loanEmi || 0) +
    Number(safeData?.otherExpenses || 0)
  );

  const handleNumberChange = (key: keyof MonthlyExpensesFormData, raw: string) => {
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
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Monthly Fixed Operating Expenses (OpEx)</CardTitle>
                <CardDescription>
                  Recurring overheads that must be paid every month regardless of sales volume.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1A1A1D] border border-[#FFBF24]/30 px-4 py-2 rounded-xl self-start sm:self-auto">
              <TrendingDown className="w-5 h-5 text-[#FFBF24]" />
              <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                  Total Monthly Fixed Costs
                </p>
                <p className="text-base font-bold text-[#FFBF24] font-mono">
                  {formatCurrency(totalFixedExpenses)}
                  <span className="text-xs font-normal text-[#A1A1AA]"> / mo</span>
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((f) => {
              const val = Number(safeData?.[f.key]) || 0;
              const pct = totalFixedExpenses > 0 ? ((val / totalFixedExpenses) * 100).toFixed(1) : '0';

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
                      id={`input-expense-${f.key}`}
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

          {/* Fixed Expense Summary Bar */}
          {totalFixedExpenses > 0 && (
            <div className="mt-4 pt-4 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Annualized Fixed Overheads Run-Rate:</span>
              <span className="font-mono text-[#F8FAFC] font-bold">
                {formatCurrency(totalFixedExpenses * 12)} / year
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
