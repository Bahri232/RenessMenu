import { type RouterOutputs } from "~/trpc/shared";
import { getCategoryTranslations } from "./categoriesUtils";

export type FullMenuOutput = RouterOutputs["menus"]["getMenuBySlug"];

export const parseDishes = <T extends FullMenuOutput>(
  menu: T,
  selectedLanguage: string,
) => {
  const translatedCategories = menu.categories.map((category) => ({
    ...category,
    name: getCategoryTranslations({ category, languageId: selectedLanguage }),
  }));
  const categorizedDishes = translatedCategories.map((category) => ({
    category,
    dishes: menu.dishes.filter((dish) => dish.categoryId === category.id) || [],
  }));

  const dishesWithoutCategories = menu.dishes.filter(
    (dish) => !dish.categoryId,
  );

  const allDishesWithCategories = [
    ...categorizedDishes,
    {
      category: null,
      dishes: dishesWithoutCategories,
    },
  ];

  const CATEGORY_ORDER = [
    "FOOD TRAYS",
    "AFRICAN DISHES",
    "BREAKFAST",
    "NOODLES",
    "PASTA",
    "HAMBURGERS",
    "WINGS",
    "SANDWICHES",
    "SHAWARMA",
    "SALADS",
    "MEAT STEAK",
    "PIZZA",
    "APPETIZERS & SOUPS",
    "MAIN DISHES (CHICKEN)",
    "SEAFOOD",
    "DRINKS & BEVERAGES",
  ];

  const sortedDishesByCategoryName = categorizedDishes.sort((a, b) => {
    const aName = a.category?.name?.toUpperCase()?.trim() || "";
    const bName = b.category?.name?.toUpperCase()?.trim() || "";
    const aIndex = CATEGORY_ORDER.indexOf(aName);
    const bIndex = CATEGORY_ORDER.indexOf(bName);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return aName.localeCompare(bName);
  });

  const noCategoryDishes = allDishesWithCategories.filter(
    (dish) => dish.category === null,
  );

  const sortedDishes = [...noCategoryDishes, ...sortedDishesByCategoryName];

  const selectedLanguageDishes = sortedDishes.map((category) => {
    const dishes = category.dishes.map((dish) => {
      const selectedDishesTranslation = dish.dishesTranslation.find(
        (translation) => translation.languageId === selectedLanguage,
      );
      const backupTranslation = dish.dishesTranslation?.[0] ?? {
        name: "-",
        description: "-",
      };

      if (!selectedDishesTranslation)
        return {
          ...dish,
          name: backupTranslation.name,
          description: backupTranslation.description,
        };

      return {
        ...dish,
        ...selectedDishesTranslation,
      };
    });

    return {
      category: category.category,
      dishes,
    };
  });

  const dishesWithTranslatedVariants = selectedLanguageDishes.map(
    (category) => {
      const dishes = category.dishes.map((dish) => {
        const dishVariants = dish.dishVariants.map((variant) => {
          const selectedVariantTranslation = variant.variantTranslations.find(
            (translation) => translation.languageId === selectedLanguage,
          );

          const backupTranslation = variant.variantTranslations?.[0] ?? {
            name: "-",
            description: null,
          };

          if (!selectedVariantTranslation)
            return {
              ...variant,
              name: backupTranslation.name,
              description: backupTranslation.description,
            };

          return {
            ...variant,
            ...selectedVariantTranslation,
          };
        });

        return {
          ...dish,
          translatedDishVariants: dishVariants,
        };
      });

      return {
        category: category.category,
        dishes,
      };
    },
  );

  return dishesWithTranslatedVariants;
};
