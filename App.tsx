import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useTodoStore, Filter } from './src/store/useTodoStore';
import { TodoInput } from './src/components/TodoInput';
import { TodoItem } from './src/components/TodoItem';
import { FilterButtons } from './src/components/FilterButtons';

export default function App() {
  const { getFilteredTodos, addTodo, setFilter } = useTodoStore();
  const filteredTodos = getFilteredTodos();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.headerTitle}>Görevlerim</Text>
        <TodoInput />
        <FilterButtons />
        
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TodoItem todo={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Modern, hafif gri bir arka plan
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20, // SafeAreaView iOS'ta yeterli oluyor
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 40,
  },
});
