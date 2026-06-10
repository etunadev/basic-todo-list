import { useTodoStore, Filter } from '../useTodoStore';

describe('useTodoStore', () => {
  // Her testten önce store'u tertemiz bir başlangıç durumuna (initial state) getiriyoruz
  beforeEach(() => {
    useTodoStore.setState({ todos: [], filter: 'all' as Filter });
  });

  it('yeni bir görev ekleyebilmelidir', () => {
    // 1. İşlem: Doğrudan getState() ile fonksiyona ulaşıp görev ekliyoruz
    useTodoStore.getState().addTodo('TypeScript Hatasını Çöz');

    // 2. Kontrol: State güncellendi mi?
    const state = useTodoStore.getState();
    expect(state.todos.length).toBe(1);
    expect(state.todos[0].text).toBe('TypeScript Hatasını Çöz');
    expect(state.todos[0].completed).toBe(false);
  });

  it('görevi tamamlandı olarak işaretleyebilmelidir (toggle)', () => {
    // 1. Hazırlık: Önce bir görev ekle
    useTodoStore.getState().addTodo('Test Görevi');
    const todoId = useTodoStore.getState().todos[0].id;

    // 2. İşlem: Görevi tamamla
    useTodoStore.getState().toggleTodo(todoId);

    // 3. Kontrol: Durum true oldu mu?
    expect(useTodoStore.getState().todos[0].completed).toBe(true);
  });

  it('görevi silebilmelidir', () => {
    // 1. Hazırlık
    useTodoStore.getState().addTodo('Silinecek Görev');
    const todoId = useTodoStore.getState().todos[0].id;

    // 2. İşlem: Görevi sil
    useTodoStore.getState().deleteTodo(todoId);

    // 3. Kontrol: Liste boşaldı mı?
    expect(useTodoStore.getState().todos.length).toBe(0);
  });
});