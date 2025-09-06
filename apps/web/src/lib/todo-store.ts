import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  addTask: (newTodo: string) => void;
  toggleTask: (task: Task['id']) => void;
  removeTask: (task: Task['id']) => void;
}

export const useTodoStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (newTodo) => {
        if (newTodo.trim()) {
          const todo: Task = {
            id: Date.now().toString(),
            title: newTodo.trim(),
            completed: false,
          };
          set((state) => ({ tasks: [...state.tasks, todo] }));
        }
      },
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    }),
    {
      name: 'todo-storage',
    }
  )
);
