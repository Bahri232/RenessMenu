import menuData from "./renessDelightData.json";

export interface ModifierOption {
  id: string;
  name: string;
  price?: number; // in cents (0 if included)
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  minSelections: number;
  maxSelections: number;
  options: ModifierOption[];
}

export interface MenuItemData {
  name: string;
  price: number; // in cents (Leones * 100)
  description?: string;
  modifierGroups?: ModifierGroup[];
}

export interface MenuCategoryData {
  name: string;
  dishes: MenuItemData[];
}

export const RENESS_DELIGHT_CATEGORIES: MenuCategoryData[] =
  menuData as MenuCategoryData[];

/**
 * Normalizes a dish name for matching modifier definitions
 */
export const normalizeDishName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

// Quick lookup map by normalized name
export const MODIFIERS_BY_DISH_NAME = new Map<string, ModifierGroup[]>();

for (const cat of RENESS_DELIGHT_CATEGORIES) {
  for (const dish of cat.dishes) {
    if (dish.modifierGroups && dish.modifierGroups.length > 0) {
      MODIFIERS_BY_DISH_NAME.set(
        normalizeDishName(dish.name),
        dish.modifierGroups,
      );
    }
  }
}

/**
 * Returns modifier groups for a dish by its name or translated variants.
 */
export const getDishModifierGroups = (
  dishName: string,
  dishVariants?: { name?: string | null; description?: string | null }[],
): ModifierGroup[] => {
  const normalized = normalizeDishName(dishName);
  const matched = MODIFIERS_BY_DISH_NAME.get(normalized);
  if (matched && matched.length > 0) {
    return matched;
  }

  // Fallback: construct groups from database dishVariants if available
  if (dishVariants && dishVariants.length > 0) {
    const groupsMap = new Map<string, ModifierOption[]>();
    for (const v of dishVariants) {
      if (!v.name) continue;
      const groupName = v.description || "Options";
      const existing = groupsMap.get(groupName) || [];
      existing.push({
        id: normalizeDishName(v.name),
        name: v.name,
      });
      groupsMap.set(groupName, existing);
    }

    if (groupsMap.size > 0) {
      return Array.from(groupsMap.entries()).map(([name, options], idx) => ({
        id: `group-${idx}`,
        name,
        required: true,
        minSelections: 1,
        maxSelections: 1,
        options,
      }));
    }
  }

  return [];
};
