"use client";

import React, { useState } from "react";
import { type CartItem } from "./useMenuSelection";
import { Icons } from "~/components/Icons";
import { formatCurrency } from "~/utils/formatCurrency";

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
      className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Order Selection — Show to Waiter"
    >
      {/* Top Header Bar - High Contrast */}
      <header className="sticky top-0 z-10 flex flex-col border-b border-slate-800 bg-slate-950 px-4 py-4 text-white shadow-lg sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 font-black text-slate-950 shadow-md">
              <Icons.menuSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Order Selection
              </h2>
              <p className="text-xs font-bold text-emerald-400 sm:text-sm">
                Show this screen to your server
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-slate-800 px-4 text-xs font-extrabold text-slate-100 transition-colors hover:bg-slate-700 hover:text-white sm:text-sm"
            aria-label="Back to Menu"
          >
            <span>Back</span>
            <Icons.close className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Helpful banner */}
      <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs font-bold text-amber-300 sm:text-sm">
        👋 Hand or show your phone to the waiter to record your order.
      </div>

      {/* Selected Items Scrollable List */}
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <p className="text-xl font-black text-white">No items selected yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Browse the menu and tap "+ Select" on any dish to add items.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-emerald-400"
              >
                Back to Menu
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;

                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border-2 border-slate-800 bg-slate-950/90 p-4 shadow-md transition-all hover:border-slate-700 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Quantity Badge & Dish Details */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="inline-flex h-10 min-w-[42px] items-center justify-center rounded-xl bg-emerald-500 px-2.5 text-lg font-black text-slate-950 shadow">
                          {item.quantity}x
                        </span>
                        <div className="flex flex-col min-w-0 flex-1">
                          <h3 className="break-words text-lg font-black leading-snug text-white sm:text-xl">
                            {item.name}
                          </h3>

                          {/* Chosen Modifiers in Bold/Clear Sub-text */}
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.modifiers.map((mod, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-lg bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 text-xs font-black text-amber-300 shadow-xs"
                                >
                                  <span className="text-amber-200/70 font-semibold mr-1.5">
                                    {mod.group}:
                                  </span>
                                  <span className="text-white font-extrabold tracking-wide">
                                    {mod.option}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="mt-1 text-xs font-semibold text-slate-400 sm:text-sm">
                            {formatCurrency(item.price)} each
                          </span>
                        </div>
                      </div>

                      {/* Right: Line Total */}
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-emerald-400 sm:text-2xl">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Quick quantity adjustment controls */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                      <span>Adjust quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-base font-black text-white hover:bg-slate-700 active:scale-95"
                          aria-label={`Decrease ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-black text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddItem(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-base font-black text-white hover:bg-slate-700 active:scale-95"
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
        <footer className="sticky bottom-0 z-10 border-t-2 border-slate-800 bg-slate-950 px-4 py-4 shadow-2xl sm:px-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {/* Grand Total Display */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 border border-slate-800 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Items
                </span>
                <span className="text-base font-black text-white">
                  {totalItems} {totalItems === 1 ? "dish" : "dishes"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Grand Total
                </span>
                <div className="text-2xl font-black text-emerald-400 sm:text-3xl tracking-tight">
                  {formatCurrency(totalPrice)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 px-6 text-base font-black text-slate-950 shadow-lg transition-transform hover:bg-emerald-400 active:scale-98"
              >
                <Icons.chevronLeft className="h-5 w-5" />
                <span>Back to Menu</span>
              </button>

              {!showClearConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="rounded-xl border border-red-500/40 bg-red-500/10 py-3.5 px-4 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 active:scale-98"
                >
                  Clear Selection
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-red-950/80 p-1.5 border border-red-800">
                  <span className="px-2 text-xs font-bold text-red-300">Clear all?</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700"
                  >
                    Yes, clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
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
