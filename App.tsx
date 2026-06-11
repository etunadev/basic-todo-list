import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, TextInput, View, LayoutAnimation, UIManager, Alert } from 'react-native'; // Alert eklendi
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodoStore, Filter } from './src/store/useTodoStore';
import { TodoInput } from './src/components/TodoInput';
import { TodoItem } from './src/components/TodoItem';
import { FilterButtons } from './src/components/FilterButtons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SectionItem = ({ section, filter, setFilter, addTodo, deleteSection, getFilteredTodos }: any) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filteredTodos = getFilteredTodos(section.id);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // --- BEST PRACTICE ONAY MEKANİZMASI ---
  const handleDeletePress = () => {
    Alert.alert(
      "Bölümü Sil", // Diyalog Başlığı
      `"${section.title}" bölümünü ve içerisindeki tüm görevleri silmek istediğinize emin misiniz?`, // Diyalog Mesajı
      [
        {
          text: "İptal",
          style: "cancel" // Android/iOS için varsayılan iptal davranışı ve stili
        },
        {
          text: "Sil",
          style: "destructive", // iOS'ta butonu otomatik kırmızı yapar
          onPress: () => {
            // Silinme esnasında listenin kalan elemanları aşağıdan yukarı yumuşakça süzülür
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            deleteSection(section.id);
          }
        }
      ],
      { cancelable: true } // Boşluğa tıklayınca kapanabilme özelliği (Android)
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpand} activeOpacity={0.7}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        
        <View style={styles.headerActions}>
          {/* Tetikleyici buton artık doğrudan Alert mekanizmasını çağırıyor */}
          <TouchableOpacity onPress={handleDeletePress} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
          
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#666" 
          />
        </View>
      </TouchableOpacity>

      {isExpanded ? (
        <View>
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
      ) : null}
    </View>
  );
};

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
            renderItem={({ item }) => (
              <SectionItem 
                section={item}
                filter={filter}
                setFilter={setFilter}
                addTodo={addTodo}
                deleteSection={deleteSection}
                getFilteredTodos={getFilteredTodos}
              />
            )}
            contentContainerStyle={styles.sectionsListContainer}
            showsVerticalScrollIndicator={false}
          />
        </KeyboardAvoidingView>

        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
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
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalAddButton]} onPress={handleAddSection}>
                  <Text style={styles.modalButtonText}>Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={[styles.modalButtonText, styles.modalCancelButtonText]}>İptal</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F5F7FA',
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    elevation: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250, 
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalAddButton: {
    backgroundColor: '#007BFF', 
  },
  modalCancelButton: {
    backgroundColor: '#E2E8F0', 
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalCancelButtonText: {
    color: '#4A5568', 
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
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginRight: 10,
  },
  sectionsListContainer: {
    paddingBottom: 100,
  },
});