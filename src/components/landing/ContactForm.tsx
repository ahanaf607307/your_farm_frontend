'use client';

import React, { useState } from 'react';
import { Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/providers/LanguageProvider';

export default function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(locale === 'bn' ? 'সবগুলো ফিল্ড পূরণ করুন।' : 'Please fill in all required fields.');
      return;
    }
    
    // Simulate API call
    toast.success(t('contact.success'));
    setName('');
    setEmail('');
    setMessage('');
    setSubject('General');
  };

  const locale = useLanguage().locale;

  return (
    <section id="contact" className="py-20 border-t bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <Card className="border bg-card lg:col-span-7 orange-glow">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">{t('contact.name')}</Label>
                    <Input
                      id="contact-name"
                      placeholder={t('contact.namePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">{t('contact.email')}</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">{t('contact.subject')}</Label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="General">{t('contact.subjectGeneral')}</option>
                    <option value="Support">{t('contact.subjectSupport')}</option>
                    <option value="Sales">{t('contact.subjectSales')}</option>
                    <option value="Enterprise">{t('contact.subjectEnterprise')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">{t('contact.message')}</Label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder={locale === 'bn' ? 'আপনার বার্তা এখানে লিখুন...' : 'Write your message details here...'}
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center gap-2 py-5 rounded-xl shadow-md">
                  <Send className="h-4 w-4" /> {t('contact.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border bg-card overflow-hidden">
              <CardHeader className="bg-muted/30 p-5 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Mail className="h-4.5 w-4.5 text-primary" /> {t('contact.infoTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start space-x-3 text-xs">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">{t('contact.directEmail')}</div>
                    <a href="mailto:support@farmly.com" className="text-primary hover:underline">
                      support@farmly.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">{t('contact.hours')}</div>
                    <div className="text-muted-foreground">{t('contact.hoursVal')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <a
              href="mailto:support@farmly.com"
              className="block w-full"
            >
              <Button
                variant="outline"
                className="w-full py-6 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-orange-500/5 hover:text-primary transition-all duration-300"
              >
                <Mail className="h-4 w-4" /> {t('contact.emailSysOwner')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
