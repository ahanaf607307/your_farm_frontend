'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'bn';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.roles': 'Roles',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.systemReview': 'System Review',
    'nav.signIn': 'Sign In',
    'nav.register': 'Register Business',

    // Hero Section
    'hero.award': 'Best Farm Management Software of 2026',
    'hero.title': 'Enterprise Farm Management',
    'hero.titleAccent': 'Simplified & Unified',
    'hero.subtitle': 'A comprehensive multi-tenant SaaS built for modern agriculture. Streamline feed schedules, livestock weight, veterinary operations, inventory, and staff tasks across multiple businesses in one real-time panel.',
    'hero.getStarted': 'Get Started Free',
    'hero.explore': 'Explore Features',

    // Features Section
    'features.title': 'Designed for Every Agricultural Operation',
    'features.subtitle': 'Whether you run a single chicken coop or coordinate several high-intensity aquaculture lagoons and dairy stables, Farmly adapts to your requirements.',
    'features.poultry': 'Poultry Farm',
    'features.poultryDesc': 'Broilers & Layers health, feed tracking & egg counts.',
    'features.dairy': 'Dairy Farm',
    'features.dairyDesc': 'Milk yield tracking, cow schedules & quarantine logs.',
    'features.goat': 'Goat Farm',
    'features.goatDesc': 'Category breeding records, weight & medicine schedules.',
    'features.fish': 'Fish Farm',
    'features.fishDesc': 'Pond aeration levels, stocking history & feed daily usage.',
    'features.duck': 'Duck Farm',
    'features.duckDesc': 'Brooding schedules, vaccination logs & water health.',
    'features.bird': 'Bird Farm',
    'features.birdDesc': 'Aviary climate details, diet plans & species catalog.',
    'features.cattle': 'Cattle Farm',
    'features.cattleDesc': 'Herd breeding, feeding ratios & weight tracking.',
    'features.sheep': 'Sheep Farm',
    'features.sheepDesc': 'Wool yields tracking, grazing records & vaccines.',

    // Roles Section
    'roles.title': 'Granular Role-Based Access Control',
    'roles.subtitle': 'Separate tasks and limit views automatically to match your workflow. Three distinct dashboards ready out of the box.',
    'roles.bizOwner': 'Business Owner',
    'roles.bizOwnerDesc': 'Company management. Creates farms, assigns managers and employees, tracks financial statements, and reviews company expenses and profits.',
    'roles.manager': 'Farm Manager',
    'roles.managerDesc': 'Operational controls. Organizes categories, livestock lists, food/medicine schedules, monitors stock alerts, and assigns daily staff tasks.',
    'roles.employee': 'Farm Employee',
    'roles.employeeDesc': 'Mobile action items. Receives dynamic work cards (feeding, vaccine, cleaning), reports completion notes, and uploads photo evidence.',

    // Pricing Section
    'pricing.title': 'Flexible Plans for Businesses of Any Size',
    'pricing.subtitle': 'All plans include automated tasks generation, real-time alert notifications, and internal chat threads.',
    'pricing.getStarted': 'Get Started',
    'pricing.mostPopular': 'Most Popular',
    'pricing.basicDesc': 'Perfect for small single-farm owners',
    'pricing.standardDesc': 'Popular choice for expanding setups',
    'pricing.enterpriseDesc': 'Custom configuration for agriculture groups',
    'pricing.farms2': 'Up to 2 Farms',
    'pricing.farms5': 'Up to 5 Farms',
    'pricing.farmsUnlimited': 'Unlimited Farms',
    'pricing.livestockRegistry': 'Livestock Registry & Categories',
    'pricing.feedTracker': 'Feed & Medication Tracker',
    'pricing.employeeTasks': 'Employee Task Checklists',
    'pricing.csvTools': 'CSV Import & Export Tools',
    'pricing.alerts': 'Real-time Alert Notifications',
    'pricing.chat': 'Internal Chat Messenger',
    'pricing.prioritySupport': '24/7 Priority Support Helpdesk',

    // Contact Section
    'contact.title': 'Get in Touch with Our Team',
    'contact.subtitle': 'Have questions about our features, pricing, or custom requests? Drop us a message and our support team will get back to you.',
    'contact.name': 'Full Name',
    'contact.namePlaceholder': 'e.g. John Jenkins',
    'contact.email': 'Email Address',
    'contact.emailPlaceholder': 'e.g. john@jenkins.com',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.subjectGeneral': 'General Inquiry',
    'contact.subjectSupport': 'Technical Support',
    'contact.subjectSales': 'Sales Inquiry',
    'contact.subjectEnterprise': 'Custom Enterprise Request',
    'contact.submit': 'Send Message',
    'contact.infoTitle': 'Contact Info',
    'contact.directEmail': 'Direct Support Email',
    'contact.hours': 'Support Hours',
    'contact.hoursVal': 'Monday - Friday, 9AM - 6PM EST',
    'contact.emailSysOwner': 'Email System Owner',
    'contact.success': 'Your message has been sent successfully to the system owner!',

    // Reviews Page
    'review.back': 'Back to Home',
    'review.title': 'SaaS System Dashboard Reviews',
    'review.subtitle': 'Detailed preview walkthroughs showing platform controls, live metrics tracking, and administration panel settings.',
    
    // 8 Previews
    'review.p1_title': 'System Owner - System Analytics',
    'review.p1_desc': 'Super-admin dashboard showing active tenant accounts, monthly gross revenue metrics, registration streams, and platform conversion indicators.',
    'review.p2_title': 'System Owner - Businesses Registry',
    'review.p2_desc': 'Admin table listing all tenant business databases where the super-admin can edit client details, register new businesses, or activate/suspend databases.',
    'review.p3_title': 'System Owner - Subscriptions Configuration',
    'review.p3_desc': 'Subscriptions overview showing active tier parameters (Basic, Standard, Enterprise) along with cash invoice billing logs.',
    'review.p4_title': 'Business Owner - Farms Control',
    'review.p4_desc': 'Tenant business admin dashboard to create new farm divisions, onboard managers, and review financial overview metrics.',
    'review.p5_title': 'Business Owner - Staff Registry',
    'review.p5_desc': 'Management directory where business owners register employees and assign managers to specific farm locations.',
    'review.p6_title': 'Farm Manager - Farm Overview',
    'review.p6_desc': 'Operations workspace displaying feed levels, active livestock quantities, pending checklists completions progress, and cashflow stats.',
    'review.p7_title': 'Farm Manager - Animals Registry',
    'review.p7_desc': 'Livestock database cataloging animal codes, active categories, breeding statuses, feed types, and veterinary logging logs.',
    'review.p8_title': 'Farm Employee - Assigned Tasks',
    'review.p8_desc': 'Mobile-responsive action list where employees track feed distribution, vaccines, and report task completions directly from the field.',
  },
  bn: {
    // Navigation
    'nav.features': 'বৈশিষ্ট্যসমূহ',
    'nav.roles': 'ভূমিকা সমূহ',
    'nav.pricing': 'মূল্য তালিকা',
    'nav.contact': 'যোগাযোগ',
    'nav.systemReview': 'সিস্টেম পর্যালোচনা',
    'nav.signIn': 'লগ ইন করুন',
    'nav.register': 'ব্যবসা নিবন্ধন করুন',

    // Hero Section
    'hero.award': '২০২৬ সালের সেরা খামার ব্যবস্থাপনা সফটওয়্যার',
    'hero.title': 'এন্টারপ্রাইজ খামার ব্যবস্থাপনা',
    'hero.titleAccent': 'সহজ ও সমন্বিত',
    'hero.subtitle': 'আধুনিক কৃষির জন্য নির্মিত একটি সম্পূর্ণ মাল্টি-টেন্যান্ট SaaS। একই রিয়েল-টাইম প্যানেলে একাধিক ব্যবসার ফিড শিডিউল, গবাদি পশুর ওজন, পশুচিকিৎসা কার্যক্রম, ইনভেন্টরি এবং স্টাফের কাজগুলো সমন্বয় করুন।',
    'hero.getStarted': 'বিনামূল্যে শুরু করুন',
    'hero.explore': 'বৈশিষ্ট্যসমূহ দেখুন',

    // Features Section
    'features.title': 'প্রতিটি কৃষি কার্যক্রমের জন্য ডিজাইন করা',
    'features.subtitle': 'আপনি একটি সাধারণ মুরগির খাঁচা চালান বা কয়েকটি উচ্চ-ক্ষমতাসম্পন্ন মৎস্য জলাশয় এবং দুগ্ধ খামার সমন্বয় করুন না কেন, ফার্মলি আপনার প্রয়োজন অনুসারে খাপ খাইয়ে নেয়।',
    'features.poultry': 'মুরগির খামার',
    'features.poultryDesc': 'ব্রয়লার ও লেয়ারের স্বাস্থ্য, খাদ্য ট্র্যাকিং এবং ডিমের হিসাব।',
    'features.dairy': 'দুগ্ধ খামার',
    'features.dairyDesc': 'দুধের উৎপাদন ট্র্যাকিং, গাভীর সময়সূচী এবং কোয়ারেন্টাইন লগ।',
    'features.goat': 'ছাগলের খামার',
    'features.goatDesc': 'প্রজনন রেকর্ড, ওজন এবং ওষুধের সময়সূচী।',
    'features.fish': 'মৎস্য খামার',
    'features.fishDesc': 'পুকুরের বায়ুচলাচল স্তর, পোনা ছাড়ার ইতিহাস এবং দৈনন্দিন খাদ্য ব্যবহার।',
    'features.duck': 'হাঁসের খামার',
    'features.duckDesc': 'ব্রুডিং সময়সূচী, টিকাদানের লগ এবং পানির স্বাস্থ্য।',
    'features.bird': 'পাখির খামার',
    'features.birdDesc': 'এভিয়ারি জলবায়ুর বিবরণ, খাদ্য পরিকল্পনা এবং প্রজাতির ক্যাটালগ।',
    'features.cattle': 'গবাদি পশুর খামার',
    'features.cattleDesc': 'পুলের প্রজনন, খাদ্য অনুপাত এবং ওজন ট্র্যাকিং।',
    'features.sheep': 'ভেড়ার খামার',
    'features.sheepDesc': 'পশম উৎপাদনের ট্র্যাকিং, চারণ রেকর্ড এবং টিকা।',

    // Roles Section
    'roles.title': 'সুনির্দিষ্ট ভূমিকা-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ',
    'roles.subtitle': 'আপনার কাজের ধারা অনুযায়ী স্বয়ংক্রিয়ভাবে কাজ এবং ভিউ সীমিত করুন। তিনটি ড্যাশবোর্ড সরাসরি ব্যবহারের জন্য প্রস্তুত।',
    'roles.bizOwner': 'ব্যবসার মালিক',
    'roles.bizOwnerDesc': 'কোম্পানি ব্যবস্থাপনা। খামার তৈরি, ম্যানেজার ও কর্মী নিয়োগ, আর্থিক বিবরণী ট্র্যাকিং এবং কোম্পানির ব্যয় ও লাভ পর্যালোচনা।',
    'roles.manager': 'খামার ব্যবস্থাপক',
    'roles.managerDesc': 'অপারেশনাল নিয়ন্ত্রণ। বিভাগ বিন্যাস, গবাদি পশুর তালিকা, খাদ্য/ওষুধের সময়সূচী, স্টক অ্যালার্ট পর্যবেক্ষণ এবং কর্মীদের দৈনিক কাজ বরাদ্দ করা।',
    'roles.employee': 'খামার কর্মী',
    'roles.employeeDesc': 'মোবাইল অ্যাকশন আইটেম। ডাইনামিক কাজের কার্ড (খাওয়ানো, টিকা, পরিষ্কার করা) গ্রহণ, কাজ সম্পন্ন করার নোট জমা এবং ছবি আপলোড।',

    // Pricing Section
    'pricing.title': 'যেকোনো আকারের ব্যবসার জন্য নমনীয় পরিকল্পনা',
    'pricing.subtitle': 'সমস্ত পরিকল্পনায় রয়েছে স্বয়ংক্রিয় কাজ তৈরি, রিয়েল-টাইম অ্যালার্ট নোটিফিকেশন এবং অভ্যন্তরীণ চ্যাট থ্রেড।',
    'pricing.getStarted': 'শুরু করুন',
    'pricing.mostPopular': 'সবচেয়ে জনপ্রিয়',
    'pricing.basicDesc': 'ছোট একক খামার মালিকদের জন্য উপযুক্ত',
    'pricing.standardDesc': 'খামার বৃদ্ধির জন্য জনপ্রিয় পছন্দ',
    'pricing.enterpriseDesc': 'কৃষি সমবায় বা গ্রুপের জন্য কাস্টম কনফিগারেশন',
    'pricing.farms2': 'সর্বোচ্চ ২ টি খামার',
    'pricing.farms5': 'সর্বোচ্চ ৫ টি খামার',
    'pricing.farmsUnlimited': 'আনলিমিটেড খামার',
    'pricing.livestockRegistry': 'গবাদি পশু রেজিস্ট্রি এবং ক্যাটাগরি',
    'pricing.feedTracker': 'খাদ্য ও ওষুধ ট্র্যাকার',
    'pricing.employeeTasks': 'কর্মীদের কাজের চেকলিস্ট',
    'pricing.csvTools': 'CSV ইম্পোর্ট এবং এক্সপোর্ট টুলস',
    'pricing.alerts': 'রিয়েল-টাইম অ্যালার্ট নোটিফিকেশন',
    'pricing.chat': 'অভ্যন্তরীণ চ্যাট মেসেঞ্জার',
    'pricing.prioritySupport': '২৪/৭ অগ্রাধিকার ভিত্তিক সাপোর্ট হেল্পডেস্ক',

    // Contact Section
    'contact.title': 'আমাদের সাথে যোগাযোগ করুন',
    'contact.subtitle': 'আমাদের বৈশিষ্ট্য, মূল্য তালিকা বা কাস্টম অনুরোধ সম্পর্কে প্রশ্ন আছে? আমাদের একটি বার্তা পাঠান এবং আমাদের সাপোর্ট টিম আপনার সাথে যোগাযোগ করবে।',
    'contact.name': 'সম্পূর্ণ নাম',
    'contact.namePlaceholder': 'যেমন: জন জেনকিন্স',
    'contact.email': 'ইমেল ঠিকানা',
    'contact.emailPlaceholder': 'যেমন: john@jenkins.com',
    'contact.subject': 'বিষয়',
    'contact.message': 'বার্তা',
    'contact.subjectGeneral': 'সাধারণ জিজ্ঞাসা',
    'contact.subjectSupport': 'প্রযুক্তিগত সহায়তা',
    'contact.subjectSales': 'বিক্রয় সংক্রান্ত জিজ্ঞাসা',
    'contact.subjectEnterprise': 'কাস্টম অনুরোধ',
    'contact.submit': 'বার্তা পাঠান',
    'contact.infoTitle': 'যোগাযোগের তথ্য',
    'contact.directEmail': 'সরাসরি সাপোর্ট ইমেল',
    'contact.hours': 'সহায়তার সময়সীমা',
    'contact.hoursVal': 'সোমবার - শুক্রবার, সকাল ৯টা - সন্ধ্যা ৬টা EST',
    'contact.emailSysOwner': 'সিস্টেম ওনারকে ইমেল করুন',
    'contact.success': 'আপনার বার্তাটি সফলভাবে সিস্টেম ওনারের কাছে পাঠানো হয়েছে!',

    // Reviews Page
    'review.back': 'হোম পেজে ফিরে যান',
    'review.title': 'খামার ড্যাশবোর্ড পর্যালোচনা',
    'review.subtitle': 'প্ল্যাটফর্ম নিয়ন্ত্রণ, রিয়েল-টাইম ডেটা ট্র্যাকিং এবং প্রশাসনিক প্যানেল সেটিংসমুহের বিস্তারিত প্রিভিউ।',
    
    // 8 Previews
    'review.p1_title': 'সিস্টেম ওনার - সিস্টেম অ্যানালিটিক্স',
    'review.p1_desc': 'সুপার-অ্যাডমিন ড্যাশবোর্ড যা সক্রিয় গ্রাহক অ্যাকাউন্ট, মাসিক মোট রাজস্বের হিসাব, নতুন রেজিস্ট্রেশন এবং কনভার্সন রেট দেখায়।',
    'review.p2_title': 'সিস্টেম ওনার - ব্যবসা রেজিস্ট্রি',
    'review.p2_desc': 'অ্যাডমিন টেবিল যা সব গ্রাহক কোম্পানির তালিকা দেখায়, যেখান থেকে অ্যাডমিন তাদের তথ্য এডিট, নতুন ব্যবসা রেজিস্টার বা সক্রিয়/নিষ্ক্রিয় করতে পারেন।',
    'review.p3_title': 'সিস্টেম ওনার - সাবস্ক্রিপশন কনফিগারেশন',
    'review.p3_desc': 'সক্রিয় প্ল্যানসমূহের প্যারামিটার এবং সাম্প্রতিক ক্যাশ ইনভয়েস বিলিং লগের বিবরণী প্যানেল।',
    'review.p4_title': 'ব্যবসার মালিক - খামার নিয়ন্ত্রণ',
    'review.p4_desc': 'গ্রাহক ড্যাশবোর্ড যেখান থেকে ব্যবসার মালিকরা নতুন খামার তৈরি, ম্যানেজার অনবোর্ড এবং লাভ-ক্ষতির হিসাব দেখতে পারেন।',
    'review.p5_title': 'ব্যবসার মালিক - কর্মী রেজিস্ট্রি',
    'review.p5_desc': 'কর্মী ডিরেক্টরি যেখান থেকে ব্যবসার মালিকরা নতুন কর্মী নিয়োগ এবং নির্দিষ্ট খামারে ম্যানেজার বা এমপ্লয়ি নিযুক্ত করতে পারেন।',
    'review.p6_title': 'খামার ব্যবস্থাপক - খামার ওভারভিউ',
    'review.p6_desc': 'খামার পরিচালনা ড্যাশবোর্ড যা খাদ্যের মজুদ, গবাদি পশুর সংখ্যা, কাজের অগ্রগতি এবং খামারের আয়-ব্যয়ের হিসাব দেখায়।',
    'review.p7_title': 'খামার ব্যবস্থাপক - পশুপাখি রেজিস্ট্রি',
    'review.p7_desc': 'গবাদি পশুর ডাটাবেস যা পশুর কোড, ক্যাটাগরি, প্রজনন অবস্থা, ফিড টাইপ এবং ভেটেরিনারি লগ দেখায়।',
    'review.p8_title': 'খামার কর্মী - বরাদ্দকৃত কাজ',
    'review.p8_desc': 'মোবাইল-বান্ধব কাজের তালিকা যেখান থেকে কর্মীরা খাবার বিতরণ, ভ্যাকসিন দেওয়া এবং কাজ সম্পন্ন করার আপডেট সরাসরি প্রদান করতে পারেন।',
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('bn');

  // Load language preference from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('farmly_locale') as Locale;
    if (saved === 'en' || saved === 'bn') {
      setLocale(saved);
    } else {
      setLocale('bn');
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('farmly_locale', newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
