'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  File,
  FileText,
  Loader2,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { api } from '@/utils/trpc';

// Mock quiz questions for demo
const mockQuestions = [
  {
    id: 1,
    question:
      'What is the primary purpose of encapsulation in object-oriented programming?',
    options: [
      'To make the code run faster',
      'To hide internal state and require interaction through methods',
      'To allow multiple inheritance',
      'To reduce memory usage',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which data structure uses LIFO (Last In, First Out) ordering?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'In a relational database, what does SQL stand for?',
    options: [
      'Simple Query Language',
      'Structured Query Language',
      'Standard Question Language',
      'Sequential Query Logic',
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question:
      'What design pattern provides a way to access elements of a collection sequentially?',
    options: ['Factory', 'Iterator', 'Singleton', 'Observer'],
    correctAnswer: 1,
  },
];

function getFileIcon(mimeClass: string) {
  switch (mimeClass) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'ppt':
    case 'pptx':
      return <FileText className="h-4 w-4 text-orange-500" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" />;
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function QuizPracticePage() {
  const { data: session } = authClient.useSession();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    undefined
  );
  const [selectedFileIds, setSelectedFileIds] = useState<Set<number>>(
    new Set()
  );
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(
    new Map()
  );
  const [showResults, setShowResults] = useState(false);

  const { data: status, status: statusStatus } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const notFetchedYet = statusStatus === 'pending';

  const { data: courses = [] } = useQuery(
    api.canvas.getCourses.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  const { data: files = [], isLoading: isLoadingFiles } = useQuery(
    api.canvas.getCourseFiles.queryOptions(
      // biome-ignore lint/style/noNonNullAssertion: selectedCourseId is guaranteed to be set
      { courseId: selectedCourseId! },
      {
        enabled: !!selectedCourseId,
      }
    )
  );

  const selectedCourse = useMemo(
    () => courses.find((c) => c.canvasId === selectedCourseId),
    [courses, selectedCourseId]
  );

  const toggleFileSelection = (fileId: number) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const handleGenerateQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Map());
    setShowResults(false);
  };

  const handleSelectAnswer = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => new Map(prev).set(questionId, answerIndex));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Map());
  };

  const score = useMemo(() => {
    let correct = 0;
    for (const [questionId, answerIndex] of selectedAnswers) {
      const question = mockQuestions.find((q) => q.id === questionId);
      if (question && question.correctAnswer === answerIndex) {
        correct++;
      }
    }
    return correct;
  }, [selectedAnswers]);

  // Canvas not connected state
  if (!(status?.connected || notFetchedYet)) {
    return (
      <div className="container mx-auto max-w-7xl select-none space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Quiz Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Target className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  Connect your Canvas account to practice with quizzes.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link
                  className={buttonVariants({ size: 'lg' })}
                  href="/settings#integrations"
                >
                  Go to Settings
                </Link>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz results view
  if (showResults) {
    const percentage = Math.round((score / mockQuestions.length) * 100);
    return (
      <div className="container mx-auto max-w-3xl space-y-8 p-6 md:p-8">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden rounded-3xl">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="font-bold text-3xl">Quiz Complete!</h2>
              <p className="mt-2 text-white/80">Here are your results</p>
            </div>
            <CardContent className="p-8">
              <div className="mb-6 text-center">
                <p className="font-bold text-5xl">{percentage}%</p>
                <p className="mt-2 text-muted-foreground">
                  You got {score} out of {mockQuestions.length} questions
                  correct
                </p>
              </div>
              <div className="mb-8 h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-600 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="space-y-4">
                {mockQuestions.map((q, index) => {
                  const userAnswer = selectedAnswers.get(q.id);
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div
                      className={cn(
                        'rounded-xl border p-4',
                        isCorrect
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-red-500/30 bg-red-500/5'
                      )}
                      key={q.id}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-medium text-sm',
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{q.question}</p>
                          <p className="mt-1 text-muted-foreground text-sm">
                            Your answer:{' '}
                            {userAnswer !== undefined
                              ? q.options[userAnswer]
                              : 'Not answered'}
                          </p>
                          {!isCorrect && (
                            <p className="mt-1 text-green-600 text-sm">
                              Correct: {q.options[q.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button onClick={handleRestartQuiz} size="lg" variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Files
                </Button>
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers(new Map());
                  }}
                  size="lg"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Quiz taking view
  if (quizStarted) {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

    return (
      <div className="container mx-auto max-w-3xl space-y-8 p-6 md:p-8">
        {/* AI Coming Soon Banner */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3"
          initial={{ opacity: 0, y: -10 }}
        >
          <Sparkles className="h-5 w-5 text-orange-500" />
          <p className="text-sm">
            <span className="font-medium">Demo Mode:</span> These are sample
            questions. AI-generated questions based on your files coming soon!
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden rounded-3xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleRestartQuiz}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div>
                    <p className="font-medium">
                      Question {currentQuestionIndex + 1} of{' '}
                      {mockQuestions.length}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {selectedCourse?.name}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {selectedAnswers.size} answered
                </Badge>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  initial={{ opacity: 0, x: 20 }}
                  key={currentQuestion.id}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-6 font-semibold text-xl">
                    {currentQuestion.question}
                  </h2>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected =
                        selectedAnswers.get(currentQuestion.id) === index;
                      return (
                        <button
                          className={cn(
                            'w-full rounded-xl border p-4 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-2 ring-primary'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          )}
                          key={index}
                          onClick={() =>
                            handleSelectAnswer(currentQuestion.id, index)
                          }
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full border-2 font-medium',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/30'
                              )}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex justify-between">
                <Button
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePreviousQuestion}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < mockQuestions.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Finish Quiz
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Course and file selection view
  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
        initial={{ opacity: 0, y: -10 }}
      >
        <div className="flex select-none items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              AI Quiz Practice
            </h1>
            <p className="text-muted-foreground">
              Generate practice quizzes from your course materials
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI Coming Soon Banner */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.1 }}
      >
        <Sparkles className="h-5 w-5 text-primary" />
        <p className="text-sm">
          <span className="font-medium">AI Integration Coming Soon:</span>{' '}
          Currently showing demo questions. Soon you'll be able to generate
          custom quizzes from your course files!
        </p>
      </motion.div>

      {/* Step 1: Course Selection */}
      {!selectedCourseId && (
        <Card>
          <CardContent>
            <Empty className="!p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookOpen className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Select a Course</EmptyTitle>
                <EmptyDescription>
                  Choose a course to generate practice quizzes from its files.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="min-w-full items-start overflow-x-auto">
                <div className="grid w-full min-w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                  {courses.map((course) => (
                    <Item
                      asChild
                      className="cursor-pointer flex-nowrap overflow-hidden rounded-xl p-3 transition-colors hover:bg-accent"
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseId(course.canvasId);
                        setSelectedFileIds(new Set());
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <button type="button">
                        <ItemMedia variant="icon">
                          <BookOpen className="size-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="line-clamp-2 text-left">
                            {course.name}
                          </ItemTitle>
                        </ItemContent>
                      </button>
                    </Item>
                  ))}
                </div>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      )}

      {/* Step 2: File Selection */}
      {selectedCourseId && !quizStarted && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                className="h-fit"
                onClick={() => {
                  setSelectedCourseId(undefined);
                  setSelectedFileIds(new Set());
                }}
                type="button"
                variant="ghost"
              >
                <ChevronLeft className="h-5 w-5" />
                <div className="text-left">
                  <CardTitle className="text-base">
                    {selectedCourse?.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Select files to generate quiz from
                  </p>
                </div>
              </Button>
              {selectedFileIds.size > 0 && (
                <Badge variant="secondary">
                  {selectedFileIds.size} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingFiles ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <Empty className="!p-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No Files Found</EmptyTitle>
                  <EmptyDescription>
                    This course doesn't have any accessible files.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
                  {files.map((file) => (
                    <button
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors',
                        selectedFileIds.has(file.id)
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'border-border hover:bg-accent'
                      )}
                      key={file.id}
                      onClick={() => toggleFileSelection(file.id)}
                      type="button"
                    >
                      <Checkbox
                        checked={selectedFileIds.has(file.id)}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                      />
                      {getFileIcon(file.mimeClass)}
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium text-sm">
                          {file.displayName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Generate Quiz Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    className="h-14 px-8 text-lg"
                    disabled={selectedFileIds.size === 0}
                    onClick={handleGenerateQuiz}
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Practice Quiz
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
