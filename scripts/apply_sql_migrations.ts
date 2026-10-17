import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

async function run() {
  console.log("Connecting to Postgres with DIRECT_URL...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Connected successfully!");

  // Clean any partial tables/types from previous attempt
  console.log("Cleaning any partial public tables/types...");
  await client.query(`
    DROP TABLE IF EXISTS 
      "public"."dish_variant_translations",
      "public"."dish_variants",
      "public"."dish_tags",
      "public"."tags",
      "public"."subscriptions",
      "public"."menu_languages",
      "public"."dishes_translation",
      "public"."dishes",
      "public"."categories_translation",
      "public"."categories",
      "public"."menus",
      "public"."languages",
      "public"."profiles" CASCADE;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

    DROP POLICY IF EXISTS "allow based on uid 176g1iq_0" ON storage.objects;
    DROP POLICY IF EXISTS "allow based on uid 176g1iq_1" ON storage.objects;
    DROP POLICY IF EXISTS "allow based on uid 176g1iq_2" ON storage.objects;
    DROP POLICY IF EXISTS "allow select 176g1iq_0" ON storage.objects;

    DROP TYPE IF EXISTS "public"."continents" CASCADE;
    DROP TYPE IF EXISTS "public"."tag_type" CASCADE;
  `);

  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();

  console.log(`Found ${files.length} migration files.`);

  for (const file of files) {
    console.log(`Applying: ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      await client.query(sql);
      console.log(`✓ ${file} applied.`);
    } catch (err: any) {
      console.error(`✗ Failed on ${file}:`, err.message);
      throw err;
    }
  }

  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log("\nCreated tables in public schema:");
  console.log(res.rows.map(r => r.table_name));

  await client.end();
  console.log("\nAll Supabase database migrations applied successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
