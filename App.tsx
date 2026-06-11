import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, TextInput, Button, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useTodoStore, Filter } from './src/store/useTodoStore';
import { TodoInput } from './src/components/TodoInput';
import { TodoItem } from './src/components/TodoItem';
import { FilterButtons } from './src/components/FilterButtons';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const { sections, filter, addSection, deleteSection, getFilteredTodos, addTodo, setFilter } = useTodoStore();

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addSection(newSectionTitle.trim());
      setNewSectionTitle("");
      setModalVisible(false);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSection(sectionId);
  };

  const renderTodoSection = ({ item: section }: { item: any }) => {
    const filteredTodos = getFilteredTodos(section.id);

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <TouchableOpacity onPress={() => handleDeleteSection(section.id)}>
            <Text style={styles.deleteSectionButton}>X</Text>
          </TouchableOpacity>
        </View>
        <TodoInput onAddTodo={(text) => addTodo(section.id, text)} />
        <FilterButtons currentFilter={filter} onSetFilter={setFilter} />
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TodoItem todo={item} sectionId={section.id} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.headerTitle}>Görevlerim</Text>

          <FlatList
            data={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderTodoSection}
            contentContainerStyle={styles.sectionsListContainer}
            showsVerticalScrollIndicator={false}
          />
        </KeyboardAvoidingView>

        {/* Add Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Yeni Bölüm Ekle</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Bölüm Başlığı"
                value={newSectionTitle}
                onChangeText={setNewSectionTitle}
              />
              <Button title="Ekle" onPress={handleAddSection} />
              <Button title="İptal" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
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
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007BFF', // Primary blue color
    borderRadius: 30,
    elevation: 8, // Gölge efekti Android için
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalInput: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: 250,
    fontSize: 18,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  deleteSectionButton: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionsListContainer: {
    paddingBottom: 40,
  },
});