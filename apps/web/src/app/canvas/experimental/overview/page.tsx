'use client';

import {
  ArrowRight,
  Brain,
  Calendar,
  ChartLine,
  FlaskConical,
  MessageCircle,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FeatureStatus = 'coming-soon' | 'in-development' | 'available';

interface StudyFeature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  longDescription: string;
  status: FeatureStatus;
  gradient: string;
  benefits: string[];
}

const features: StudyFeature[] = [
  {
    id: 'ai-study-guide',
    icon: <Brain className="h-6 w-6" />,
    title: 'AI Study Guide Generator',
    description: 'Transform course content into personalized study guides',
    longDescription:
      'Fetches modules, pages, and assignment descriptions from your courses, then uses AI to synthesize them into actionable study materials tailored to your learning style.',
    status: 'coming-soon',
    gradient: 'from-purple-500 to-indigo-600',
    benefits: [
      'Auto-generated summaries of key concepts',
      'Personalized study priorities',
      'Export as PDF or flashcards',
    ],
  },
  {
    id: 'grade-predictor',
    icon: <ChartLine className="h-6 w-6" />,
    title: 'Smart Grade Predictor',
    description: 'Predict your final grade and get improvement tips',
    longDescription:
      'Analyzes your submissions, current grades, and assignment weights to predict your final grade. Suggests which assignments to focus on for maximum impact.',
    status: 'available',
    gradient: 'from-emerald-500 to-teal-600',
    benefits: [
      'Final grade predictions',
      'Impact analysis for upcoming work',
      'Minimum scores needed for grade targets',
    ],
  },
  {
    id: 'quiz-practice',
    icon: <Target className="h-6 w-6" />,
    title: 'AI Quiz Practice Mode',
    description: 'Practice with past quiz questions anytime',
    longDescription:
      'Canvas locks quizzes after submission, while we unlock unlimited practice. Review past quiz questions and generate similar practice questions to master the material.',
    status: 'coming-soon',
    gradient: 'from-orange-500 to-red-600',
    benefits: [
      'Practice past quiz questions',
      'AI-generated similar questions',
      'Spaced repetition for retention',
    ],
  },
  {
    id: 'study-planner',
    icon: <Calendar className="h-6 w-6" />,
    title: 'Intelligent Study Planner',
    description: 'Strategic study schedules based on your data',
    longDescription:
      'Analyzes due dates, assignment weights, and your past performance to create an optimized study schedule. Knows what deserves more attention.',
    status: 'available',
    gradient: 'from-blue-500 to-cyan-600',
    benefits: [
      'Priority-weighted schedules',
      'Performance-based time allocation',
      'Calendar integration',
    ],
  },
  {
    id: 'discussion-insights',
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'Discussion Insights',
    description: 'Track your participation in discussion threads',
    longDescription:
      'Long discussion threads are hard to follow. We show you which discussions need your reply, track your participation, and highlight overdue discussions.',
    status: 'available',
    gradient: 'from-pink-500 to-rose-600',
    benefits: [
      'See unanswered discussions',
      'Track your post count',
      'Urgency-based sorting',
    ],
  },
];

const statusConfig: Record<
  FeatureStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  available: { label: 'Available', variant: 'default' },
  'in-development': { label: 'In Development', variant: 'secondary' },
  'coming-soon': { label: 'Coming Soon', variant: 'outline' },
};

function FeatureCard({
  feature,
  index,
}: {
  feature: StudyFeature;
  index: number;
}) {
  const status = statusConfig[feature.status];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative select-none"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
          feature.status === 'available' &&
            'hover:border-border hover:shadow-lg hover:shadow-primary/5'
        )}
      >
        {/* Gradient accent bar */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-60',
            feature.gradient,
            feature.status === 'available' &&
              'transition-opacity group-hover:opacity-100'
          )}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
            >
              {feature.icon}
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          {feature.status === 'available' ? (
            <Link
              className="mt-4 inline-flex items-center gap-1.5 font-semibold text-lg transition-all group-hover:gap-2"
              href={`/canvas/${feature.id}` as Route}
            >
              {feature.title}
              <ArrowRight className="h-4 w-4" />
              <span className="absolute inset-0" />
            </Link>
          ) : (
            <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
          )}
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feature.longDescription}
          </p>

          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Key Benefits
            </p>
            <ul className="space-y-1.5">
              {feature.benefits.map((benefit) => (
                <li
                  className="flex items-center gap-2 text-muted-foreground text-sm"
                  key={benefit}
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StudyLabPage() {
  return (
    <div className="container mx-auto max-w-7xl space-y-12 p-6 md:p-8">
      {/* Hero Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-purple-500/25 shadow-xl">
          <FlaskConical className="h-8 w-8" />
        </div>
        <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
          Study Lab
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Unlock the full potential of your Canvas data. These AI-powered
          features go{' '}
          <span className="font-medium text-foreground">
            beyond what Canvas offers
          </span>{' '}
          to help you study smarter, not harder.
        </p>

        {/* Key differentiator callout */}
        <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <Zap className="h-5 w-5 text-primary" />
          <span>
            <span className="font-medium text-foreground">
              Canvas shows your data.
            </span>{' '}
            <span className="text-muted-foreground">
              We transform it into insights.
            </span>
          </span>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard feature={feature} index={index} key={feature.id} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-8 text-center"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="font-semibold text-xl">
          Want to see these features sooner?
        </h2>
        <p className="mt-2 text-muted-foreground">
          We're actively developing Study Lab. Your feedback helps us prioritize
          which features to build first.
        </p>
      </motion.div>
    </div>
  );
}
