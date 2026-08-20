import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Contact & Capstone Feedback"
        description="Project correspondence and technical inquiry channel."
        badge="Correspondence"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-1 space-y-4">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2">
              <Mail className="w-5 h-5" />
            </div>
            <CardTitle>Inquiries</CardTitle>
            <CardDescription>
              Submit questions regarding architecture, ML pipeline design, or capstone evaluation.
            </CardDescription>
          </CardHeader>
          <div className="text-xs text-[#A1A1AA] space-y-2 pt-2 border-t border-[#27272A]">
            <p className="font-semibold text-[#F8FAFC]">Repository Notice</p>
            <p>Monorepo architecture configured for standalone and containerized deployment.</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Message Received</h3>
              <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
                Thank you for your feedback on the BizMind project foundation.
              </p>
              <Button size="sm" variant="outline" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. reviewer@university.edu"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Textarea
                label="Message / Feedback"
                rows={4}
                placeholder="Enter feedback regarding system architecture..."
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit" rightIcon={<Send className="w-4 h-4" />}>
                Submit Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
