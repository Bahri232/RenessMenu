"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAuthError, type Provider } from "@supabase/supabase-js";
import { type TFunction } from "i18next";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormInput } from "~/components/FormInput/FormInput";
import { Icons } from "~/components/Icons";
import { Button, buttonVariants } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { supabase } from "~/server/supabase/supabaseClient";
import { cn } from "~/utils/cn";
import { type ZodReturnType } from "~/utils";

const registerValidationSchema = (translate: TFunction) =>
  z
    .object({
      email: z.string().email(),
      password: z
        .string()
        .min(8, translate("common.passwordLengthValidation"))
        .regex(/[A-Z]/, translate("common.passwordUppercaseValidation"))
        .regex(/[a-z]/, translate("common.passwordLowercaseValidation"))
        .regex(
          /[^A-Za-z0-9]/,
          translate("common.passwordSpecialCharacterValidation"),
        ),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: translate("common.passwordConfirmationValidation"),
      path: ["passwordConfirmation"],
    });

type RegisterFormValues = ZodReturnType<typeof registerValidationSchema>;

const translations = {
  en: {
    hello: "Hello",
    confirmYourEmailAddress: "Confirm your email address.",
    resetYourEmail: "Reset your email.",
    confirmYourEmailAddressDescription:
      "Please confirm your email address by clicking the button below.",
    resetYourEmailDescription:
      "Click the button below to reset your email address.",
    buttonText: "Continue",
    orCopyAndPaste: "or copy and paste this URL into your browser:",
  },
  pl: {
    hello: "Witaj",
    confirmYourEmailAddress: "Potwierdź swój adres email.",
    resetYourEmail: "Zresetuj Adres Email.",
    confirmYourEmailAddressDescription:
      "Potwierdź swój adres email klikając w przycisk poniżej.",
    buttonText: "Kontynuuj",
    orCopyAndPaste: "lub skopiuj i wklej ten adres URL do przeglądarki:",
  },
};

export function UserAuthForm() {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [oauthLoading, setOauthLoading] = React.useState(false);

  const handleOAuthRegister = async (provider: Provider) => {
    try {
      setOauthLoading(true);
      const { data, error } = await supabase().auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });

      if (error) {
        toast({
          title: "Google Registration Error",
          description: error.message,
          variant: "destructive",
          duration: 9000,
        });
        setOauthLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Google Registration Error",
        description: err?.message || "Could not connect to Google",
        variant: "destructive",
        duration: 9000,
      });
      setOauthLoading(false);
    }
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerValidationSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // 1. Attempt instant registration with auto-confirmation
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Registration failed");
      }

      // 2. Automatically sign in
      const { error: signInError } = await supabase().auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        throw signInError;
      }

      toast({
        title: "Account Created!",
        description: "Welcome to your digital menu. Redirecting to dashboard...",
        duration: 3000,
      });

      window.location.href = "/dashboard";
    } catch (e: any) {
      // Fallback: try standard supabase client signUp if API route isn't reachable
      try {
        const { data: signUpData, error: signUpError } = await supabase().auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: translations[i18n.language as "en" | "pl"],
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (signUpData.session) {
          toast({
            title: "Account Created!",
            description: "Redirecting to your dashboard...",
            duration: 3000,
          });
          window.location.href = "/dashboard";
          return;
        }

        toast({
          title: t("register.checkYourEmailForConfirmation"),
          description: t("common.confirmYourEmail"),
          variant: "default",
          duration: 9000,
        });
      } catch (fallbackError: any) {
        toast({
          title: "Registration Error",
          description: e?.message || fallbackError?.message || "Could not create account",
          variant: "destructive",
          duration: 9000,
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInput label={t("common.emailLabel")}>
              <Input {...field} />
            </FormInput>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput label={t("common.passwordLabel")}>
              <Input {...field} type="password" />
            </FormInput>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormInput label={t("common.passwordConfirmLabel")}>
              <Input {...field} type="password" />
            </FormInput>
          )}
        />
        <Button loading={form.formState.isSubmitting} type="submit">
          {t("register.submitButton")}
        </Button>
      </form>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        disabled={oauthLoading}
        className={cn(buttonVariants({ variant: "outline" }), "flex gap-2 items-center justify-center")}
        onClick={() => {
          void handleOAuthRegister("google");
        }}
      >
        {oauthLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.google width={16} />
        )}
        Continue with Google
      </button>
    </Form>
  );
}
