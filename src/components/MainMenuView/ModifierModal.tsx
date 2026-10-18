"use client";

import React, { useState, useMemo } from "react";
import { Icons } from "~/components/Icons";
import { type ModifierGroup } from "~/data/renessDelightMenu";
import { formatCurrency } from "~/utils/formatCurrency";
import { type SelectedModifier } from "./useMenuSelection";

interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: {
    id: string;
    name: string;
    price: number; // in cents
    description?: string | null;
  };
  modifierGroups: ModifierGroup[];
  onAddToSelection: (params: {
    dishId: string;
    name: string;
    price: number;
    modifiers: SelectedModifier[];
  }) => void;
}

export const ModifierModal = ({
  isOpen,
  onClose,
  dish,
  modifierGroups,
  onAddToSelection,
}: ModifierModalProps) => {
  // State: map of groupId -> selected option name
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      // Pre-select the first option if there is only 1 option in a group, or leave unselected
      return {};
    },
  );

  // Check if all required groups have a selection
  const isComplete = useMemo(() => {
    return modifierGroups.every((group) => {
      if (!group.required) return true;
      const selection = selectedOptions[group.id];
      return Boolean(selection);
    });
  }, [modifierGroups, selectedOptions]);

  if (!isOpen) return null;

  const handleSelectOption = (groupId: string, optionName: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: optionName,
    }));
  };

  const handleConfirm = () => {
    if (!isComplete) return;

    const modifiers: SelectedModifier[] = modifierGroups
      .filter((group) => selectedOptions[group.id])
      .map((group) => ({
        group: group.name,
        option: selectedOptions[group.id]!,
      }));

    onAddToSelection({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      modifiers,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:items-center sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modifier-modal-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl bg-white text-slate-900 shadow-2xl sm:rounded-3xl animate-in slide-in-from-bottom-6 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div className="pr-8">
            <h3
              id="modifier-modal-title"
              className="text-xl font-black text-slate-950 sm:text-2xl tracking-tight leading-snug"
            >
              {dish.name}
            </h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-black text-emerald-700">
                {formatCurrency(dish.price)}
              </span>
            </div>
            {dish.description && (
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                {dish.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900"
            aria-label="Close"
          >
            <Icons.close className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Modifier Groups */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {modifierGroups.map((group) => {
            const currentSelection = selectedOptions[group.id];

            return (
              <div
                key={group.id}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4"
              >
                {/* Group Title & Required Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      {group.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                    Required • Pick 1
                  </span>
                </div>

                {/* Option Choices */}
                <div className="mt-3 space-y-2">
                  {group.options.map((option) => {
                    const isSelected = currentSelection === option.name;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          handleSelectOption(group.id, option.name)
                        }
                        className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-all ${
                          isSelected
                            ? "border-2 border-slate-950 bg-slate-950 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio Indicator */}
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isSelected
                                ? "border-emerald-400 bg-emerald-500 text-slate-950"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Icons.check className="h-3 w-3 stroke-[3]" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              isSelected ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {option.name}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {option.price ? formatCurrency(option.price) : "Included"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Price
              </span>
              <span className="text-xl font-black text-slate-950">
                {formatCurrency(dish.price)}
              </span>
            </div>

            <button
              type="button"
              disabled={!isComplete}
              onClick={handleConfirm}
              className={`flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition-all ${
                isComplete
                  ? "bg-slate-950 text-white shadow-lg hover:bg-slate-800 active:scale-95 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Icons.add className="h-4 w-4" />
              <span>
                {isComplete ? "Add to Selection" : "Select Required Options"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
