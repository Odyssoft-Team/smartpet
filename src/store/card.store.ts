// store/cards.store.ts
import type { Cards } from "@/domains/profile/utils/Card";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CardsState {
  listCards: Cards[]; // ✅ Cambiado de 'cards' a 'listCards'
  loading: boolean;
  error: string | null;

  // Actions
  setCards: (listCards: Cards[]) => void;
  addCard: (card: Cards) => void;
  updateCard: (cardId: string, updatedCard: Partial<Cards>) => void;
  deleteCard: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCards: () => void;
}

export const useCardsStore = create<CardsState>()(
  persist(
    (set) => ({
      listCards: [], // ✅ Cambiado aquí
      loading: false,
      error: null,

      setCards: (listCards) => set({ listCards, error: null }), // ✅ Actualizado

      addCard: (card) =>
        set((state) => ({
          listCards: [...state.listCards, card], // ✅ Actualizado
          error: null,
        })),

      updateCard: (cardId, updatedCard) =>
        set((state) => ({
          listCards: state.listCards.map(
            (
              card // ✅ Actualizado
            ) => (card.id === cardId ? { ...card, ...updatedCard } : card)
          ),
          error: null,
        })),

      deleteCard: (cardId) =>
        set((state) => ({
          listCards: state.listCards.filter((card) => card.id !== cardId), // ✅ Actualizado
          error: null,
        })),

      setDefaultCard: (cardId) =>
        set((state) => ({
          listCards: state.listCards.map((card) => ({
            // ✅ Actualizado
            ...card,
            is_default: card.id === cardId,
          })),
        })),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearCards: () => set({ listCards: [], error: null }), // ✅ Actualizado
    }),
    {
      name: "cards-storage",
    }
  )
);
