import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SoloSessionPresetId = 'classic' | 'deep' | 'marathon';
export type SoloSessionPhase = 'idle' | 'focus' | 'break';

export type SoloSessionGoal = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type SoloSessionPreset = {
  id: SoloSessionPresetId;
  label: string;
  focusMinutes: number;
  breakMinutes: number;
  description: string;
};

export const SOLO_SESSION_PRESETS: SoloSessionPreset[] = [
  {
    id: 'classic',
    label: '25 / 5',
    focusMinutes: 25,
    breakMinutes: 5,
    description: 'Short sprint',
  },
  {
    id: 'deep',
    label: '50 / 10',
    focusMinutes: 50,
    breakMinutes: 10,
    description: 'Deep block',
  },
  {
    id: 'marathon',
    label: '100 / 15',
    focusMinutes: 100,
    breakMinutes: 15,
    description: 'Long session',
  },
];

type SoloSessionState = {
  presetId: SoloSessionPresetId;
  focusMinutes: number;
  breakMinutes: number;
  phase: SoloSessionPhase;
  remainingSeconds: number;
  isRunning: boolean;
  completedFocusBlocks: number;
  goals: SoloSessionGoal[];
};

type SoloSessionActions = {
  selectPreset: (presetId: SoloSessionPresetId) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  addGoal: (title: string) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  clearCompletedGoals: () => void;
};

type SoloSessionStore = SoloSessionState & SoloSessionActions;

const defaultPreset = SOLO_SESSION_PRESETS[1];

const initialState: SoloSessionState = {
  presetId: defaultPreset.id,
  focusMinutes: defaultPreset.focusMinutes,
  breakMinutes: defaultPreset.breakMinutes,
  phase: 'idle',
  remainingSeconds: defaultPreset.focusMinutes * 60,
  isRunning: false,
  completedFocusBlocks: 0,
  goals: [],
};

function phaseSeconds(
  phase: SoloSessionPhase,
  focusMinutes: number,
  breakMinutes: number
): number {
  return (phase === 'break' ? breakMinutes : focusMinutes) * 60;
}

function createGoal(title: string): SoloSessionGoal {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function formatSessionTime(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const useSoloSessionStore = create<SoloSessionStore>()(
  persist(
    (set) => ({
      ...initialState,

      selectPreset: (presetId) =>
        set(() => {
          const preset =
            SOLO_SESSION_PRESETS.find(
              (candidate) => candidate.id === presetId
            ) ?? defaultPreset;
          return {
            presetId: preset.id,
            focusMinutes: preset.focusMinutes,
            breakMinutes: preset.breakMinutes,
            phase: 'idle',
            remainingSeconds: preset.focusMinutes * 60,
            isRunning: false,
          };
        }),

      start: () =>
        set((state) => ({
          phase: state.phase === 'idle' ? 'focus' : state.phase,
          remainingSeconds:
            state.remainingSeconds > 0
              ? state.remainingSeconds
              : phaseSeconds('focus', state.focusMinutes, state.breakMinutes),
          isRunning: true,
        })),

      pause: () => set({ isRunning: false }),

      reset: () =>
        set((state) => ({
          phase: 'idle',
          remainingSeconds: phaseSeconds(
            'focus',
            state.focusMinutes,
            state.breakMinutes
          ),
          isRunning: false,
          completedFocusBlocks: 0,
        })),

      tick: () =>
        set((state) => {
          if (!state.isRunning) {
            return state;
          }

          if (state.remainingSeconds > 1) {
            return { remainingSeconds: state.remainingSeconds - 1 };
          }

          const nextPhase = state.phase === 'focus' ? 'break' : 'focus';
          const completedFocusBlocks =
            state.phase === 'focus'
              ? state.completedFocusBlocks + 1
              : state.completedFocusBlocks;

          return {
            phase: nextPhase,
            remainingSeconds: phaseSeconds(
              nextPhase,
              state.focusMinutes,
              state.breakMinutes
            ),
            completedFocusBlocks,
          };
        }),

      addGoal: (title) =>
        set((state) => {
          const trimmedTitle = title.trim();
          if (!trimmedTitle) {
            return state;
          }
          return { goals: [createGoal(trimmedTitle), ...state.goals] };
        }),

      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
          ),
        })),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      clearCompletedGoals: () =>
        set((state) => ({
          goals: state.goals.filter((goal) => !goal.completed),
        })),
    }),
    {
      name: 'solo-session-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        presetId: state.presetId,
        focusMinutes: state.focusMinutes,
        breakMinutes: state.breakMinutes,
        phase: state.phase,
        remainingSeconds: state.remainingSeconds,
        isRunning: state.isRunning,
        completedFocusBlocks: state.completedFocusBlocks,
        goals: state.goals,
      }),
    }
  )
);
