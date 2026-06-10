import React from "react";
import { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../../App";
import { useTodoStore, Filter } from "../store/useTodoStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("App", () => {
  beforeEach(async () => {
    // React 19 Kuralı: Bileşen mount edilmeden önce act() kullanmak kuyruğu kilitler.
    // Doğrudan temiz state ataması yapıyoruz.
    useTodoStore.setState({ todos: [], filter: Filter.All });
    jest.clearAllMocks();
  });

  it("renders correctly and allows adding a todo", async () => {
    // React 19 asenkron render yapısı için await ekledik
    const { getByPlaceholderText, getByText, findByText } = await render(<App />);

    const input = getByPlaceholderText("Yeni görev ekle...");
    const addButton = getByText("Ekle");

    fireEvent.changeText(input, "İlk görev");
    fireEvent.press(addButton);

    expect(await findByText("İlk görev")).toBeTruthy();
    expect(input.props.value).toBe("");

    // Verilerin AsyncStorage'a kaydedildiğini doğrula
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "todo-store",
        expect.stringContaining("İlk görev")
      )
    );
  });

  it("filters todos correctly when filter buttons are pressed", async () => {
    const { getByPlaceholderText, getByText, queryByText, findByText } = await render(<App />);

    const input = getByPlaceholderText("Yeni görev ekle...");
    const addButton = getByText("Ekle");

    // İki adet görev ekle
    fireEvent.changeText(input, "Active Todo");
    fireEvent.press(addButton);
    fireEvent.changeText(input, "Completed Todo");
    fireEvent.press(addButton);

    // Birini tamamlandı olarak işaretle
    const completedTodoItem = await findByText("Completed Todo");
    
    // TypeScript TestNode katı hiyerarşi hatasını önlemek için 'as any' ekledik
    if (completedTodoItem.parent?.children[0]) {
      fireEvent.press(completedTodoItem.parent.children[0] as any);
    }

    // İlk durumu kontrol et (Tümü seçeneği)
    expect(getByText("Active Todo")).toBeTruthy();
    expect(getByText("Completed Todo")).toBeTruthy();

    // Aktif Filtresi
    fireEvent.press(getByText("Aktif"));
    expect(getByText("Active Todo")).toBeTruthy();
    expect(queryByText("Completed Todo")).toBeNull();

    // Tamamlanan Filtresi
    fireEvent.press(getByText("Tamamlanan"));
    expect(queryByText("Active Todo")).toBeNull();
    expect(getByText("Completed Todo")).toBeTruthy();

    // Tekrar Tümü Filtresi
    fireEvent.press(getByText("Tümü"));
    expect(getByText("Active Todo")).toBeTruthy();
    expect(getByText("Completed Todo")).toBeTruthy();
  });
});