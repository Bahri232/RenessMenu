"use client";

import React, { useState } from "react";
import { type CartItem } from "./useMenuSelection";
import { Icons } from "~/components/Icons";

interface WaiterViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  onAddItem: (item: CartItem) => void;
  onRemoveItem: (id: string) => void;
  onClearSelection: () => void;
  restaurantName?: string;
}

export const WaiterViewModal = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  totalItems,
  onAddItem,
  onRemoveItem,
  onClearSelection,
  restaurantName,
}: WaiterViewModalProps) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    onClearSelection();
    setShowClearConfirm(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white text-slate-950 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Order Selection — Show to Waiter"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 z-10 flex flex-col border-b-2 border-slate-900 bg-slate-950 px-4 py-4 text-white shadow-md sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950 shadow">
              <Icons.menuSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight sm:text-2xl">
                Order Selection — Show to Waiter
              </h2>
              {restaurantName && (
                <p className="text-xs font-medium text-slate-300 sm:text-sm">
                  {restaurantName}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white sm:text-sm"
            aria-label="Back to Menu"
          >
            <span>Back</span>
            <Icons.close className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Helpful banner */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-semibold text-amber-900 sm:text-sm">
        💡 Show this screen to your server to take your order easily.
      </div>

      {/* Selected Items Scrollable List */}
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
              <p className="text-lg font-semibold">No items selected</p>
              <p className="text-sm">Browse the menu and tap "+ Select" to add items.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-slate-800"
              >
                Back to Menu
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
              {items.map((item) => {
                const lineTotal = (item.price * item.quantity) / 100;
                const unitPrice = item.price / 100;

                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Quantity Badge & Dish Name */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="inline-flex h-9 min-w-[40px] items-center justify-center rounded-lg bg-slate-950 px-2.5 text-base font-black text-white shadow-sm">
                          {item.quantity}x
                        </span>
                        <div className="flex flex-col min-w-0 flex-1">
                          <h3 className="break-words text-lg font-extrabold leading-snug text-slate-950 sm:text-xl">
                            {item.name}
                          </h3>
                          <span className="text-xs font-medium text-slate-500 sm:text-sm">
                            {unitPrice.toFixed(2)} PLN each
                          </span>
                        </div>
                      </div>

                      {/* Right: Line total */}
                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-slate-950 sm:text-xl">
                          {lineTotal.toFixed(2)}
                        </span>
                        <span className="ml-1 text-xs font-bold text-slate-500">
                          PLN
                        </span>
                      </div>
                    </div>

                    {/* Quick quantity adjustment controls */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                      <span>Adjust quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-95"
                          aria-label={`Decrease ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddItem(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-95"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {/* Bottom Summary & Actions Footer */}
      {items.length > 0 && (
        <footer className="sticky bottom-0 z-10 border-t-2 border-slate-300 bg-slate-100 px-4 py-4 shadow-2xl sm:px-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {/* Grand Total Display */}
            <div className="flex items-baseline justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Items
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {totalItems} {totalItems === 1 ? "dish" : "dishes"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Grand Total
                </span>
                <div className="text-2xl font-black text-slate-950 sm:text-3xl">
                  {(totalPrice / 100).toFixed(2)}{" "}
                  <span className="text-sm font-bold text-slate-600">PLN</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 px-6 text-base font-bold text-white shadow-lg transition-transform hover:bg-slate-800 active:scale-98"
              >
                <Icons.chevronLeft className="h-5 w-5" />
                <span>Back to Menu</span>
              </button>

              {!showClearConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="rounded-xl border border-red-300 bg-white py-3.5 px-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 active:scale-98"
                >
                  Clear Selection
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-1 border border-red-200">
                  <span className="px-2 text-xs font-bold text-red-700">Clear all?</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Yes, clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
