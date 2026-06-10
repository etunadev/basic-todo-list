import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

enum Filter {
  All = "all",
  Active = "active",
  Completed = "completed",
}

interface TodoStore {
  todos: Todo[];
  filter: Filter;
  addTodo: (text: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: Filter) => void;
  getFilteredTodos: () => Todo[];
}

const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: Filter.All,
      addTodo: (text) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now().toString(), text, completed: false }],
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      setFilter: (filter) => set({ filter }),
      getFilteredTodos: () => {
        const { todos, filter } = get();
        switch (filter) {
          case Filter.Active:
            return todos.filter((todo) => !todo.completed);
          case Filter.Completed:
            return todos.filter((todo) => todo.completed);
          default:
            return todos;
        }
      },
    }),
    {
      name: "todo-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useTodoStore, Filter, Todo };
