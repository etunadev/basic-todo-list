import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Todo, useTodoStore } from "../store/useTodoStore";
import { MaterialIcons } from "@expo/vector-icons";

interface TodoItemProps {
  todo: Todo;
  sectionId: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, sectionId }) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const handleToggleTodo = () => {
    toggleTodo(sectionId, todo.id);
  };

  const handleDeleteTodo = () => {
    deleteTodo(sectionId, todo.id);
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={handleToggleTodo} style={styles.checkboxContainer}>
        <MaterialIcons
          name={todo.completed ? "check-circle" : "radio-button-unchecked"}
          size={24}
          color={todo.completed ? "#28A745" : "#6C757D"} // Yeşil veya gri
        />
      </TouchableOpacity>
      <Text style={[styles.itemText, todo.completed && styles.completedText]}>
        {todo.text}
      </Text>
      
      {/* SADECE GÖREV TAMAMLANDIYSA SİLME BUTONUNU GÖSTER */}
      {todo.completed && (
        <TouchableOpacity onPress={handleDeleteTodo} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={24} color="#DC3545" /> {/* Kırmızı silme butonu */}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkboxContainer: {
    paddingRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    paddingLeft: 10,
  },
});