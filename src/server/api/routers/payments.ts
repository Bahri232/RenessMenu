import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { LemonsqueezyClient } from "lemonsqueezy.ts";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { checkIfSubscribed } from "~/shared/hooks/useUserSubscription";
import { z } from "zod";

const client = new LemonsqueezyClient(env.LEMON_SQUEEZY_API_KEY ?? "");

const createPremiumCheckoutSchema = z.object({
  language: z.enum(["en", "pl"]),
});

const checkoutTranslations: Record<"en" | "pl", LemonsqueezyProductOptions> = {
  en: {
    description: "Display QR menus to your clients.",
    name: "FeastQR Menu",
    receipt_button_text: "Go to FeastQR",
    receipt_link_url: "https://www.feastqr.com/dashboard",
    receipt_thank_you_note: "Thank you for your purchase!",
    redirect_url: "https://www.feastqr.com/dashboard",
  },
  pl: {
    description: "Wyświetlaj menu QR Twoim klientom.",
    name: "FeastQR Menu",
    receipt_button_text: "Przejdź do FeastQR",
    receipt_link_url: "https://www.feastqr.com/dashboard",
    receipt_thank_you_note: "Dziękujemy za zakup!",
    redirect_url: "https://www.feastqr.com/dashboard",
  },
};

export const paymentsRouter = createTRPCRouter({
  createPremiumCheckout: privateProcedure
    .input(createPremiumCheckoutSchema)
    .mutation(async ({ ctx, input }) => {
      if (!env.LEMON_SQUEEZY_API_KEY || !env.LEMON_SQUEEZY_STORE_ID || !env.LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID) {
        return "/dashboard";
      }
      const language = input.language;
      const translations = checkoutTranslations[language];
      const newCheckout = await client.createCheckout({
        checkout_data: {
          custom: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            userId: ctx.user.id,
          },
          name: ctx.user.email || "",
          email: ctx.user.email || "",
        },
        checkout_options: {
          embed: true,
        },

        store: env.LEMON_SQUEEZY_STORE_ID,
        variant: env.LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID,
        product_options: translations,
      });

      return newCheckout.data.attributes.url;
    }),
  cancelSubscription: privateProcedure.mutation(async () => {
    return { success: true };
  }),
  getSubscriptionInfo: privateProcedure.query(async () => {
    return {
      endsAt: null,
      renewsAt: null,
      status: "active",
      updatePaymentUrl: null,
    };
  }),
  getCustomerPortalUrl: privateProcedure.query(async () => {
    return "/dashboard";
  }),
});

interface LemonsqueezyProductOptions {
  /**
   * A custom description for the product
   */
  description: string;
  /**
   * An array of variant IDs to enable for this checkout. If this is empty, all variants will be enabled
   */
  enabled_variants?: Array<string>;
  /**
   * An array of image URLs to use as the product's media
   */
  media?: Array<string>;
  /**
   * A custom name for the product
   */
  name: string;
  /**
   * A custom text to use for the order receipt email button
   */
  receipt_button_text: string;
  /**
   * A custom URL to use for the order receipt email button
   */
  receipt_link_url: string;
  /**
   * A custom thank you note to use for the order receipt email
   */
  receipt_thank_you_note: string;
  /**
   * A custom URL to redirect to after a successful purchase
   */
  redirect_url: string;
}
