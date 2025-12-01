import { create } from "zustand";

const useNoteStore = create((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
}));

export default useNoteStore;
