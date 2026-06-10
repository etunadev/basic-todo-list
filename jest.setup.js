// Projede sadece gerçekten var olan ve Zustand Persist için gereken AsyncStorage'ı mock'luyoruz
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);