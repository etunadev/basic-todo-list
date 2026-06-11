import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoSection {
  id: string;
  title: string;
  todos: Todo[];
}

enum Filter {
  All = "all",
  Active = "active",
  Completed = "completed",
}

interface TodoStore {
  sections: TodoSection[];
  filter: Filter;
  addSection: (title: string) => void;
  deleteSection: (sectionId: string) => void;
  addTodo: (sectionId: string, text: string) => void;
  deleteTodo: (sectionId: string, todoId: string) => void;
  toggleTodo: (sectionId: string, todoId: string) => void;
  setFilter: (filter: Filter) => void;
  getFilteredTodos: (sectionId: string) => Todo[];
}

const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      sections: [],
      filter: Filter.All,
      addSection: (title) =>
        set((state) => ({
          sections: [...state.sections, { id: Date.now().toString(), title, todos: [] }],
        })),
      deleteSection: (sectionId) =>
        set((state) => ({
          sections: state.sections.filter((section) => section.id !== sectionId),
        })),
      addTodo: (sectionId, text) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: [...section.todos, { id: Date.now().toString(), text, completed: false }],
                }
              : section
          ),
        })),
      deleteTodo: (sectionId, todoId) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: section.todos.filter((todo) => todo.id !== todoId),
                }
              : section
          ),
        })),
      toggleTodo: (sectionId, todoId) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: section.todos.map((todo) =>
                    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
                  ),
                }
              : section
          ),
        })),
      setFilter: (filter) => set({ filter }),
      getFilteredTodos: (sectionId) => {
        const { sections, filter } = get();
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return [];

        switch (filter) {
          case Filter.Active:
            return section.todos.filter((todo) => !todo.completed);
          case Filter.Completed:
            return section.todos.filter((todo) => todo.completed);
          default:
            return section.todos;
        }
      },
    }),
    {
      name: "todo-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useTodoStore, Filter, Todo, TodoSection };
