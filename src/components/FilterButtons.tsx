import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTodoStore, Filter } from "../store/useTodoStore";

export const FilterButtons = () => {
  const { filter, setFilter } = useTodoStore();

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === Filter.All && styles.activeFilterButton]}
        onPress={() => setFilter(Filter.All)}
      >
        <Text style={[styles.filterButtonText, filter === Filter.All && styles.activeFilterButtonText]}>Tümü</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === Filter.Active && styles.activeFilterButton]}
        onPress={() => setFilter(Filter.Active)}
      >
        <Text style={[styles.filterButtonText, filter === Filter.Active && styles.activeFilterButtonText]}>Aktif</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === Filter.Completed && styles.activeFilterButton]}
        onPress={() => setFilter(Filter.Completed)}
      >
        <Text style={[styles.filterButtonText, filter === Filter.Completed && styles.activeFilterButtonText]}>Tamamlanan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#E0E0E0", // Açık gri arka plan
    borderRadius: 10,
    padding: 5,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeFilterButton: {
    backgroundColor: "#007BFF", // Aktif buton için mavi arka plan
  },
  filterButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },
  activeFilterButtonText: {
    color: "#FFFFFF",
  },
});
