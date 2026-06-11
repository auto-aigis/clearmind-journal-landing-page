"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  Shield,
  Zap,
  PenTool,
  BarChart3,
  Bell,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Brain className="h-6 w-6 text-violet-500" />,
      title: "NLP Pattern Detection",
      description:
        "Our AI analyzes your journal entries over weeks to detect cognitive distortions like catastrophizing, rumination loops, and escalating anxiety language.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-violet-500" />,
      title: "Longitudinal Emotional Analysis",
      description:
        "Track emotional drift across weeks and months. See how your stress language evolves and get alerts when patterns suggest burnout trajectory.",
    },
    {
      icon: <Bell className="h-6 w-6 text-violet-500" />,
      title: "Early Burnout Warnings",
      description:
        "Receive personalized alerts like \"Your entries show escalating anxiety language over the past 3 weeks\" before you hit a wall.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-violet-500" />,
      title: "Weekly Insight Reports",
      description:
        "Get summaries such as \"You mention work pressure 4x more on Mondays\" — actionable insights tied to your real patterns.",
    },
    {
      icon: <Shield className="h-6 w-6 text-violet-500" />,
      title: "Privacy-First Architecture",
      description:
        "Your journal entries are encrypted end-to-end. We never sell your data or use it for advertising. Your thoughts stay yours.",
    },
    {
      icon: <Zap className="h-6 w-6 text-violet-500" />,
      title: "Smart Prompts",
      description:
        "Context-aware prompts that adapt based on your emotional state and patterns — not generic one-size-fits-all questions.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Write Daily",
      description:
        "Spend 2-5 minutes writing a short daily entry. No structure required — just let your thoughts flow naturally.",
      icon: <PenTool className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "02",
      title: "AI Analyzes Patterns",
      description:
        "Our NLP engine processes your entries over time, identifying emotional patterns, cognitive distortions, and stress signals.",
      icon: <Brain className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "03",
      title: "Get Personalized Insights",
      description:
        "Receive longitudinal insights connecting dots across weeks of entries — spot burnout before it catches you off guard.",
      icon: <BarChart3 className="h-8 w-8 text-violet-500" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out mindful journaling",
      features: [
        "Daily journaling with basic prompts",
        "7-day mood overview",
        "Basic emotional tagging",
        "Mobile-friendly web app",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "Full burnout detection and pattern analysis",
      features: [
        "Everything in Starter",
        "Multi-week NLP pattern analysis",
        "Cognitive distortion detection",
        "Early burnout warning alerts",
        "Weekly insight reports",
        "Personalized smart prompts",
        "Export your data anytime",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Team",
      price: "$9",
      period: "per user/month",
      description: "For teams that care about employee wellbeing",
      features: [
        "Everything in Pro",
        "Team wellness dashboard (anonymized)",
        "Manager burnout risk overview",
        "Custom integration with Slack",
        "Priority support",
        "Quarterly wellness reports",
      ],
      highlighted: false,
    },
  ];

  const faqItems: FaqItem[] = [
    {
      question: "How is ClearMind different from other journaling apps?",
      answer:
        "Unlike generic journaling apps that offer static prompts or basic mood logs, ClearMind performs longitudinal NLP analysis across weeks of entries. We detect cognitive distortions, emotional drift, and burnout signals — acting as your personal emotional analyst rather than a simple diary.",
    },
    {
      question: "How long before I start seeing insights?",
      answer:
        "You will start seeing basic emotional patterns within your first week. The most powerful longitudinal insights — like burnout trajectory warnings and multi-week pattern detection — become available after 2-3 weeks of regular journaling.",
    },
    {
      question: "Is my journal data private and secure?",
      answer:
        "Absolutely. All entries are encrypted end-to-end. We never sell your data, use it for advertising, or share it with third parties. You can export or delete all your data at any time.",
    },
    {
      question: "Do I need to write long entries?",
      answer:
        "Not at all. Even 2-3 sentences per day are enough for our NLP engine to detect patterns over time. The key is consistency, not length.",
    },
    {
      question: "Can ClearMind replace therapy?",
      answer:
        "ClearMind is a self-awareness tool, not a replacement for professional mental health support. It helps you spot patterns early and can be a great complement to therapy — many users share their ClearMind insights with their therapists.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-violet-600" />
              <span className="text-xl font-bold text-gray-900">ClearMind</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <Separator />
              <a href="/login">
                <Button variant="ghost" className="w-full text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="w-full text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-violet-50 text-violet-700 border-violet-200">
              Built for tech professionals {"&"} remote workers
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              AI journal that spots your{" "}
              <span className="text-violet-600">burnout patterns</span>{" "}
              before you crash
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Write short daily entries. Our NLP engine detects emotional drift, cognitive distortions, and burnout signals across weeks — surfacing insights you{"'"}d never notice on your own.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="px-8 py-6 text-base border-gray-300">
                  See How It Works
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required. Free tier available forever.</p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 shrink-0" />
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
                    <p className="text-sm text-gray-500 mb-1">Monday, Nov 18</p>
                    <p className="text-gray-700 text-sm">{"\""}Feeling completely overwhelmed today. Three deadlines hit at once and I can{"'"}t focus on anything...{"\"" }</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 shrink-0" />
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
                    <p className="text-sm text-gray-500 mb-1">Wednesday, Nov 20</p>
                    <p className="text-gray-700 text-sm">{"\""}Another late night. Everything feels like it{"'"}s falling apart if I don{"'"}t push harder...{"\"" }</p>
                  </div>
                </div>
                <div className="mt-4 bg-violet-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-semibold">ClearMind Insight</span>
                  </div>
                  <p className="text-sm opacity-95">
                    {"\""}Your entries over the past 3 weeks show escalating anxiety language and catastrophizing patterns. Work-pressure mentions are 4x higher on Mondays. This trajectory suggests early-stage emotional exhaustion.{"\""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm bg-violet-50 text-violet-700 border-violet-200">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your longitudinal emotional analyst
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Not just another mood logger. ClearMind connects the dots across weeks of entries to surface patterns you{"'"}d never see on your own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-violet-200 transition-colors hover:shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm bg-violet-50 text-violet-700 border-violet-200">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Three steps to self-awareness
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple daily habit, powerful longitudinal insights. It takes less than 5 minutes a day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-violet-500 tracking-widest uppercase mb-2 block">
                  Step {step.number}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-violet-600">
        <div className="max-w-5xl mx-auto text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-white mb-1">92%</p>
              <p className="text-violet-200 text-sm">of users report better self-awareness within 3 weeks</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">2.5min</p>
              <p className="text-violet-200 text-sm">average daily journaling time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">3 weeks</p>
              <p className="text-violet-200 text-sm">average time to first burnout warning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm bg-violet-50 text-violet-700 border-violet-200">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Invest in your mental clarity
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you{"'"}re ready for deeper insights. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.highlighted
                    ? "border-violet-300 shadow-lg shadow-violet-100 scale-[1.02]"
                    : "border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white px-3 py-0.5 text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1 text-sm">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : ""
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm bg-violet-50 text-violet-700 border-violet-200">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Don{"'"}t wait until you crash
          </h2>
          <p className="text-lg text-violet-100 mb-8 max-w-xl mx-auto">
            Start understanding your emotional patterns today. Two minutes a day could save you from months of burnout recovery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-base font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-violet-200">Free forever plan available. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-violet-400" />
              <span className="text-lg font-bold text-white">ClearMind</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 ClearMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}