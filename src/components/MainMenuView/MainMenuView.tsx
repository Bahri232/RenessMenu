"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { getDefaultLanguage } from "~/utils/getDefaultLanguage";
import { type FullMenuOutput, parseDishes } from "~/utils/parseDishes";
import { useTranslation } from "react-i18next";
import {
  getCategoryTranslations,
  getDishVariantsTranslated,
} from "~/utils/categoriesUtils";
import { useInView } from "react-intersection-observer";
import { cn } from "~/utils/cn";
import { Badge } from "../ui/badge";
import { tagsTranslations } from "~/utils/tags";
import { notEmpty } from "~/utils/utils";
import { assert } from "~/utils/assert";
import { useMenuSelection, type SelectedModifier } from "./useMenuSelection";
import { WaiterViewModal } from "./WaiterViewModal";
import { Icons } from "~/components/Icons";
import { formatCurrency } from "~/utils/formatCurrency";
import {
  getDishModifierGroups,
  type ModifierGroup,
} from "~/data/renessDelightMenu";
import { ModifierModal } from "./ModifierModal";

export const MainMenuView = ({ menu }: { menu: FullMenuOutput }) => {
  const defaultLanguageSet = useRef(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [activeModifierDish, setActiveModifierDish] = useState<{
    id: string;
    name: string;
    price: number;
    description?: string | null;
    modifierGroups: ModifierGroup[];
  } | null>(null);

  const { t } = useTranslation();

  const defaultLanguage = getDefaultLanguage(menu.menuLanguages);

  if (!defaultLanguageSet.current) {
    setSelectedLanguage(defaultLanguage.languageId);
    defaultLanguageSet.current = true;
  }

  const parsedDishes = parseDishes(
    menu,
    selectedLanguage || defaultLanguage.languageId,
  );

  const {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    clearSelection,
    getItemQuantity,
    getDishTotalQuantity,
    isWaiterModalOpen,
    setIsWaiterModalOpen,
  } = useMenuSelection(menu.slug);

  const handleModifierAdd = useCallback(
    ({
      dishId,
      name,
      price,
      modifiers,
    }: {
      dishId: string;
      name: string;
      price: number;
      modifiers: SelectedModifier[];
    }) => {
      const modifierSignature = modifiers
        .map((m) => `${m.group}:${m.option}`)
        .sort()
        .join("__");
      const uniqueId = `${dishId}__${modifierSignature}`;

      addItem({
        id: uniqueId,
        dishId,
        name,
        price,
        modifiers,
      });
    },
    [addItem],
  );

  return (
    <div className="relative z-0 flex min-h-screen w-full flex-col bg-white pb-32">
      <div className="flex w-full flex-col gap-5">
        {/* Restaurant Header Image */}
        <div className="relative aspect-[2/1] w-full bg-slate-100">
          {menu.backgroundImageUrl && (
            <Image
              src={menu.backgroundImageUrl}
              fill
              priority
              alt={`${menu.name} background`}
              className="object-cover"
            />
          )}
        </div>

        {/* Restaurant Title & Info */}
        <div className="flex w-full flex-row items-center justify-between px-4">
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-black text-slate-900 md:text-4xl">
              {menu.name}
            </h1>
            <p className="break-words text-sm font-medium text-slate-500 md:text-base">
              {menu?.address}, {menu.city}
            </p>
          </div>
        </div>

        {/* Categories Bar - Horizontal scrollable */}
        <div className="sticky top-0 z-30 flex w-full flex-row items-center justify-between bg-white/95 backdrop-blur-sm">
          <CategoriesNavigation
            categories={parsedDishes
              .filter((category) => category.dishes.length > 0)
              .map(({ category }) => category)
              .filter(notEmpty)}
            languageId={selectedLanguage || defaultLanguage.languageId}
          />
        </div>

        {/* Menu Dishes List */}
        <div className="flex flex-col gap-6 px-3 sm:px-4">
          {parsedDishes?.map(({ category, dishes }) => {
            if (!dishes.length) return null;

            return (
              <section
                key={category?.id || "no-category"}
                className="w-full min-w-full flex-1 pt-4"
                id={category?.id}
              >
                <div className="flex w-full flex-col gap-4">
                  {category?.name && (
                    <h3 className="w-full break-words px-1 text-2xl font-black tracking-tight text-slate-900 border-b pb-2">
                      {category?.name ?? ""}
                    </h3>
                  )}
                  <ul className="flex flex-col gap-4">
                    {dishes.map((dish) => {
                      const modifierGroups = getDishModifierGroups(
                        dish.name,
                        dish.translatedDishVariants,
                      );
                      const hasModifiers = modifierGroups.length > 0;
                      const dishTotalQuantity = getDishTotalQuantity(dish.id);
                      const directQuantity = getItemQuantity(dish.id);

                      return (
                        <li
                          key={dish.id}
                          className="flex w-full flex-col items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-slate-200 hover:shadow"
                        >
                          <div className="flex w-full items-start justify-between gap-3">
                            {/* Dish Details */}
                            <div className="flex flex-1 min-w-0 flex-col gap-1.5">
                              <div>
                                <h4 className="break-words text-lg font-bold leading-snug text-slate-900">
                                  {dish.name}
                                </h4>
                                <PriceCard price={dish.price} />
                              </div>

                              {/* Nutritional Information */}
                              <div className="text-slate-600">
                                <MacroCard
                                  protein={dish.protein}
                                  carbohydrates={dish.carbohydrates}
                                  fat={dish.fats}
                                  calories={dish.calories}
                                />
                              </div>

                              {/* Dish Description */}
                              {dish.description && (
                                <p className="break-words text-sm text-slate-600 leading-relaxed">
                                  {dish.description}
                                </p>
                              )}

                              {/* Modifiers Pill Indicator */}
                              {hasModifiers && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {modifierGroups.map((group) => (
                                    <span
                                      key={group.id}
                                      className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800"
                                    >
                                      {group.name} (Pick 1)
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Tags */}
                              {dish.dishesTag && dish.dishesTag.length > 0 && (
                                <Tags
                                  tags={dish.dishesTag.map(({ tagName }) =>
                                    t(tagsTranslations[tagName]),
                                  )}
                                />
                              )}
                            </div>

                            {/* Dish Image */}
                            {dish.pictureUrl && (
                              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-28 sm:w-28">
                                <Image
                                  src={dish.pictureUrl}
                                  alt={dish.name}
                                  fill
                                  sizes="(max-width: 640px) 96px, 112px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Action Bar for Dish Selection & Modifiers */}
                          <div className="flex w-full flex-col gap-2 pt-2 border-t border-slate-100">
                            {/* If dish does NOT have modifier groups but has traditional standalone variants */}
                            {!hasModifiers &&
                              dish.dishVariants &&
                              dish.dishVariants.length > 0 && (
                                <div className="flex w-full flex-col gap-2 py-1">
                                  {getDishVariantsTranslated({
                                    dishVariants: dish.dishVariants,
                                    languageId:
                                      selectedLanguage ||
                                      defaultLanguage.languageId,
                                  }).map((variant) => {
                                    const variantQuantity = getItemQuantity(
                                      variant.id,
                                    );

                                    return (
                                      <VariantCard
                                        key={variant.id}
                                        name={variant.name || ""}
                                        price={variant.price}
                                        description={variant.description || ""}
                                        quantity={variantQuantity}
                                        onAdd={() =>
                                          addItem({
                                            id: variant.id,
                                            dishId: dish.id,
                                            name: `${dish.name} (${variant.name})`,
                                            price: variant.price || dish.price,
                                          })
                                        }
                                        onRemove={() => removeItem(variant.id)}
                                      />
                                    );
                                  })}
                                </div>
                              )}

                            {/* Dish Controls */}
                            <div className="flex w-full items-center justify-between pt-1">
                              <span className="text-xs font-semibold text-slate-400">
                                {hasModifiers
                                  ? dishTotalQuantity > 0
                                    ? `${dishTotalQuantity} in selection`
                                    : "Required options:"
                                  : "Add to order:"}
                              </span>

                              {hasModifiers ? (
                                /* Dish HAS Required Modifiers -> Open Modal */
                                <div className="flex items-center gap-2">
                                  {dishTotalQuantity > 0 && (
                                    <span className="rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1 text-xs font-black text-emerald-800">
                                      {dishTotalQuantity} selected
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveModifierDish({
                                        id: dish.id,
                                        name: dish.name,
                                        price: dish.price,
                                        description: dish.description,
                                        modifierGroups,
                                      })
                                    }
                                    className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-slate-950 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95"
                                    aria-label={`Select options for ${dish.name}`}
                                  >
                                    <Icons.add className="h-3.5 w-3.5" />
                                    <span>
                                      {dishTotalQuantity > 0
                                        ? "Add Another"
                                        : "Select"}
                                    </span>
                                  </button>
                                </div>
                              ) : (
                                /* Dish has NO Modifiers -> 1-Tap Select & Direct Stepper */
                                directQuantity === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addItem({
                                        id: dish.id,
                                        dishId: dish.id,
                                        name: dish.name,
                                        price: dish.price,
                                      })
                                    }
                                    className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-900 hover:text-white active:scale-95"
                                    aria-label={`Select ${dish.name}`}
                                  >
                                    <Icons.add className="h-3.5 w-3.5" />
                                    <span>Select</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-1 text-white shadow-md">
                                    <button
                                      type="button"
                                      onClick={() => removeItem(dish.id)}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm font-black text-white hover:bg-slate-700 active:scale-90"
                                      aria-label={`Decrease ${dish.name}`}
                                    >
                                      -
                                    </button>
                                    <span className="min-w-[22px] text-center text-sm font-black">
                                      {directQuantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addItem({
                                          id: dish.id,
                                          dishId: dish.id,
                                          name: dish.name,
                                          price: dish.price,
                                        })
                                      }
                                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm font-black text-white hover:bg-slate-700 active:scale-90"
                                      aria-label={`Increase ${dish.name}`}
                                    >
                                      +
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Floating Bar */}
      {totalItems > 0 && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center p-4 pb-6">
          <div className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border-2 border-slate-800 bg-slate-950 p-4 text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            {/* Total count & calculated price */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-extrabold text-emerald-400">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Selected
                </span>
              </div>
              <div className="mt-0.5 text-xl font-black tracking-tight text-white sm:text-2xl">
                {formatCurrency(totalPrice)}
              </div>
            </div>

            {/* Prominent "Show My Selection" button */}
            <button
              type="button"
              onClick={() => setIsWaiterModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95 sm:text-base cursor-pointer"
            >
              <Icons.menuSquare className="h-5 w-5" />
              <span>Show My Selection</span>
            </button>
          </div>
        </div>
      )}

      {/* Required Modifiers Selection Modal */}
      {activeModifierDish && (
        <ModifierModal
          isOpen={Boolean(activeModifierDish)}
          onClose={() => setActiveModifierDish(null)}
          dish={activeModifierDish}
          modifierGroups={activeModifierDish.modifierGroups}
          onAddToSelection={handleModifierAdd}
        />
      )}

      {/* Full-Screen "Waiter View" Modal */}
      <WaiterViewModal
        isOpen={isWaiterModalOpen}
        onClose={() => setIsWaiterModalOpen(false)}
        items={items}
        totalPrice={totalPrice}
        totalItems={totalItems}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onClearSelection={clearSelection}
        restaurantName={menu.name}
      />
    </div>
  );
};

const Tags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row flex-wrap gap-1.5 py-1">
      {tags.map((tag, index) => (
        <Badge
          variant="secondary"
          key={index}
          className="text-xs font-medium bg-slate-100 text-slate-700"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

const PriceCard = ({ price }: { price: number }) => {
  return (
    <div className="pt-0.5">
      <div className="text-base font-extrabold text-slate-900">
        {formatCurrency(price)}
      </div>
    </div>
  );
};

const CategoriesNavigation = ({
  categories,
  languageId,
}: {
  categories: FullMenuOutput["categories"];
  languageId: string;
}) => {
  const [visibleSetionsIds, setVisibleSetionsIds] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <nav
      className="z-10 flex w-full max-w-3xl overflow-x-auto whitespace-nowrap border-b-2 border-slate-200 bg-white/95 px-3 py-2.5 scrollbar-none scroll-smooth gap-2"
      ref={sliderRef}
      aria-label="Menu categories"
    >
      {categories.map((category) => (
        <SingleCategory
          onVisibilityChange={(isVisible) => {
            setVisibleSetionsIds((prevVisibleSectionsIds) => {
              let newVisibleSectionIds = [...prevVisibleSectionsIds];

              if (isVisible)
                newVisibleSectionIds = [...prevVisibleSectionsIds, category.id];
              if (!isVisible)
                newVisibleSectionIds = prevVisibleSectionsIds.filter(
                  (id) => id !== category.id,
                );

              if (
                category.id ===
                newVisibleSectionIds[newVisibleSectionIds.length - 1]
              ) {
                const element = document.getElementById(`${category.id}-nav`);

                if (element && sliderRef.current) {
                  const elementOffsetLeft = element.offsetLeft - 30;
                  sliderRef.current.scrollTo({
                    left: elementOffsetLeft,
                    behavior: "smooth",
                  });
                }
              }

              return newVisibleSectionIds;
            });
          }}
          isLastVisibleSection={
            category.id === visibleSetionsIds?.[visibleSetionsIds.length - 1]
          }
          key={category.id}
          languageId={languageId}
          category={category}
        />
      ))}
    </nav>
  );
};

const VariantCard = ({
  description,
  name,
  price,
  quantity = 0,
  onAdd,
  onRemove,
}: {
  name: string;
  price: number | null;
  description: string | null;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
      <div className="flex flex-col min-w-0 flex-1 pr-2">
        <h5 className="break-words text-sm font-bold text-slate-800">{name}</h5>
        {description && (
          <p className="break-words text-xs text-slate-500">{description}</p>
        )}
        {price !== null && (
          <span className="text-xs font-extrabold text-slate-700">
            {formatCurrency(price)}
          </span>
        )}
      </div>

      {onAdd && onRemove && (
        <div className="shrink-0">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="rounded-lg border border-slate-800 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-800 hover:text-white transition-colors"
            >
              + Select
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-1 py-0.5 text-white">
              <button
                type="button"
                onClick={onRemove}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                -
              </button>
              <span className="min-w-[18px] text-center text-xs font-bold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onAdd}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SingleCategory = ({
  category,
  languageId,
  onVisibilityChange,
  isLastVisibleSection,
}: {
  category: FullMenuOutput["categories"][0];
  languageId: string;
  onVisibilityChange: (isVisible: boolean) => void;
  isLastVisibleSection: boolean;
}) => {
  const categoryName = getCategoryTranslations({ category, languageId });

  const { ref } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      onVisibilityChange(inView);
    },
  });

  return (
    <div
      ref={ref}
      id={`${category.id}-nav`}
      onClick={() => {
        const element = document.getElementById(category.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className={cn(
        "cursor-pointer rounded-xl px-4 py-2 text-sm font-extrabold transition-all duration-200 select-none",
        isLastVisibleSection
          ? "bg-slate-950 text-white shadow-sm"
          : "bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
      )}
    >
      {categoryName}
    </div>
  );
};

const MacroCard = ({
  calories,
  carbohydrates,
  fat,
  protein,
}: {
  calories: number | null;
  carbohydrates: number | null;
  fat: number | null;
  protein: number | null;
}) => {
  if (!calories && !carbohydrates && !fat && !protein) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
      {calories && <span>{calories} kcal</span>}
      {protein && <span>• {protein}g protein</span>}
      {carbohydrates && <span>• {carbohydrates}g carbs</span>}
      {fat && <span>• {fat}g fat</span>}
    </div>
  );
};
