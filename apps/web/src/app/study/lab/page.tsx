import { ArrowRight, Boxes, Database, WandSparkles } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type StudyLabTool, studyLabTools } from '../_components/study-data';
import { StudyPageShell } from '../_components/study-nav';

const statusLabels: Record<StudyLabTool['status'], string> = {
  ready: 'Ready',
  prototype: 'Prototype',
  next: 'Next',
};

const statusVariants: Record<
  StudyLabTool['status'],
  'default' | 'secondary' | 'outline'
> = {
  ready: 'default',
  prototype: 'secondary',
  next: 'outline',
};

export default function StudyLabPage() {
  return (
    <StudyPageShell
      dataMode="sample"
      description="A study surface for turning course material into strategy, practice, and focused work sessions."
      eyebrow="Study system"
      title="Study Lab"
    >
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {studyLabTools.map((tool) => (
            <StudyLabToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <aside className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                  <Database className="size-4" />
                </div>
                <div>
                  <p className="font-medium">Course Data</p>
                  <p className="text-muted-foreground">
                    Assignments, files, grades, discussions, and deadlines.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                  <Boxes className="size-4" />
                </div>
                <div>
                  <p className="font-medium">Study Signals</p>
                  <p className="text-muted-foreground">
                    Urgency, impact, weak topics, and participation gaps.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                  <WandSparkles className="size-4" />
                </div>
                <div>
                  <p className="font-medium">Action</p>
                  <p className="text-muted-foreground">
                    Practice set, study guide, focus block, or grade strategy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recommended Bet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge>Quiz Practice</Badge>
              <p className="text-muted-foreground text-sm">
                It is the clearest non-wrapper Canvas feature: course files and
                quiz history become drills students can actually use.
              </p>
              <Link
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'w-full justify-between'
                )}
                href={'/canvas/experimental/quiz-practice' as Route}
              >
                Open prototype
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </aside>
      </section>
    </StudyPageShell>
  );
}

function StudyLabToolCard({ tool }: { tool: StudyLabTool }) {
  const Icon = tool.icon;

  return (
    <Card className="shadow-sm transition-colors duration-200 hover:bg-accent/50">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-md border bg-muted/40">
            <Icon className="size-4" />
          </div>
          <Badge variant={statusVariants[tool.status]}>
            {statusLabels[tool.status]}
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-base">{tool.title}</CardTitle>
          <p className="text-muted-foreground text-sm leading-6">
            {tool.description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Input</p>
            <p className="font-medium">{tool.input}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Output</p>
            <p className="font-medium">{tool.output}</p>
          </div>
        </div>
        <Link
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full justify-between'
          )}
          href={tool.href as Route}
        >
          Open
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
