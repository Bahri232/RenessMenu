"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

export interface CartItem {
  id: string;
  dishId: string;
  name: string;
  price: number; // in cents
  quantity: number;
}

export const useMenuSelection = (menuSlug: string) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const storageKey = useMemo(
    () => `feastqr_selection_${menuSlug || "default"}`,
    [menuSlug],
  );

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load selection from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  // Save to localStorage when items change (after initial hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save selection to localStorage", e);
    }
  }, [items, isHydrated, storageKey]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const current = updated[existingIndex];
          if (current) {
            updated[existingIndex] = {
              ...current,
              quantity: current.quantity + 1,
            };
          }
          return updated;
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const clearSelection = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error("Failed to clear localStorage selection", e);
    }
  }, [storageKey]);

  const getItemQuantity = useCallback(
    (id: string) => {
      const found = items.find((i) => i.id === id);
      return found ? found.quantity : 0;
    },
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items],
  );

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    clearSelection,
    getItemQuantity,
    isWaiterModalOpen,
    setIsWaiterModalOpen,
  };
};
