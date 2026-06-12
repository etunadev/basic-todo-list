import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTodoStore, Filter } from "../store/useTodoStore";

interface FilterButtonsProps {
  onSetFilter: (filter: Filter) => void;
  currentFilter: Filter;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({ onSetFilter, currentFilter }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, currentFilter === Filter.All && styles.activeFilterButton]}
        onPress={() => onSetFilter(Filter.All)}
      >
        <Text style={[styles.filterButtonText, currentFilter === Filter.All && styles.activeFilterButtonText]}>{t('filter_all')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, currentFilter === Filter.Active && styles.activeFilterButton]}
        onPress={() => onSetFilter(Filter.Active)}
      >
        <Text style={[styles.filterButtonText, currentFilter === Filter.Active && styles.activeFilterButtonText]}>{t('filter_active')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, currentFilter === Filter.Completed && styles.activeFilterButton]}
        onPress={() => onSetFilter(Filter.Completed)}
      >
        <Text style={[styles.filterButtonText, currentFilter === Filter.Completed && styles.activeFilterButtonText]}>{t('filter_completed')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#E0E0E0", 
    borderRadius: 10,
    padding: 5,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeFilterButton: {
    backgroundColor: "#007BFF", 
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