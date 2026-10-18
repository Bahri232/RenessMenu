import { PrismaClient } from "@prisma/client";
import { RENESS_DELIGHT_CATEGORIES } from "../src/data/renessDelightMenu";

const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🌱 Starting Reness Delight Menu Seed (TypeScript)...");

  // 1. Resolve English Language
  let english = await db.languages.findFirst({
    where: {
      name: {
        equals: "English",
        mode: "insensitive",
      },
    },
  });

  if (!english) {
    console.log("Creating English language...");
    english = await db.languages.create({
      data: {
        name: "English",
        isoCode: "GB",
        flagUrl: "https://flagsapi.com/GB/flat/64.png",
      },
    });
  }

  console.log(`✅ Using language: ${english.name} (${english.id})`);

  // 2. Find Reness Delight Menu
  let menu = await db.menus.findFirst({
    where: {
      OR: [
        { slug: "reness-delight-restaurant-bar-freetown-748" },
        { name: { contains: "Reness", mode: "insensitive" } },
      ],
    },
  });

  if (!menu) {
    const user = await db.users.findFirst();
    if (!user) {
      throw new Error("No user found in auth.users to own the menu.");
    }

    let profile = await db.profiles.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      profile = await db.profiles.create({
        data: {
          id: user.id,
          email: user.email || "admin@renessdelight.com",
          fullName: "Reness Delight Admin",
        },
      });
    }

    menu = await db.menus.create({
      data: {
        name: "Reness Delight Restaurant & Bar",
        slug: "reness-delight-restaurant-bar-freetown-748",
        city: "Freetown",
        address: "56 Kossoh Town, Grafton Highway",
        userId: user.id,
        isPublished: true,
        contactNumber: "072992244",
      },
    });
  }

  // Ensure menu has English in menuLanguages
  const existingMenuLang = await db.menuLanguages.findFirst({
    where: {
      menuId: menu.id,
      languageId: english.id,
    },
  });

  if (!existingMenuLang) {
    await db.menuLanguages.create({
      data: {
        menuId: menu.id,
        languageId: english.id,
        isDefault: true,
      },
    });
  }

  // 3. Clear out old dishes & categories for this menu to guarantee a clean, pristine seed
  console.log("🧹 Clearing previous dishes and categories for clean re-seed...");
  await db.dishes.deleteMany({
    where: { menuId: menu.id },
  });
  await db.categories.deleteMany({
    where: { menuId: menu.id },
  });

  console.log("📦 Seeding 16 Categories and Dishes with Modifiers...");

  let totalDishesCount = 0;
  let totalVariantsCount = 0;

  for (const catData of RENESS_DELIGHT_CATEGORIES) {
    const category = await db.categories.create({
      data: {
        menuId: menu.id,
        categoriesTranslation: {
          create: {
            languageId: english.id,
            name: catData.name,
          },
        },
      },
    });

    console.log(`  📂 Category [${catData.name}] created.`);

    for (const dishData of catData.dishes) {
      const dish = await db.dishes.create({
        data: {
          menuId: menu.id,
          categoryId: category.id,
          price: dishData.price,
          dishesTranslation: {
            create: {
              languageId: english.id,
              name: dishData.name,
              description: dishData.description || null,
            },
          },
        },
      });

      totalDishesCount++;

      if (dishData.modifierGroups && dishData.modifierGroups.length > 0) {
        for (const group of dishData.modifierGroups) {
          for (const opt of group.options) {
            await db.dishVariants.create({
              data: {
                dishId: dish.id,
                price: opt.price || null,
                variantTranslations: {
                  create: {
                    languageId: english.id,
                    name: opt.name,
                    description: group.name,
                  },
                },
              },
            });
            totalVariantsCount++;
          }
        }
      }
    }
  }

  console.log("\n========================================================");
  console.log("🎉 SEED COMPLETED SUCCESSFULLY!");
  console.log(`✨ Total Categories Seeded: ${RENESS_DELIGHT_CATEGORIES.length}`);
  console.log(`✨ Total Dishes Seeded: ${totalDishesCount}`);
  console.log(`✨ Total Modifier Variants Seeded: ${totalVariantsCount}`);
  console.log(`🌐 Public Customer Menu URL: /menu/${menu.slug}`);
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
