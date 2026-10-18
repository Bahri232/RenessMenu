"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Provider } from "@supabase/supabase-js";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "~/components/FormInput/FormInput";
import { Icons } from "~/components/Icons";
import { Button, buttonVariants } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { supabase } from "~/server/supabase/supabaseClient";
import { cn } from "~/utils/cn";
import {
  type LoginFormValues,
  loginValidationSchema,
} from "./UserAuthForm.schema";

export function UserAuthForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [oauthLoading, setOauthLoading] = React.useState(false);

  const signInWithOauth = async (provider: Provider) => {
    try {
      setOauthLoading(true);
      const { data, error } = await supabase().auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });

      if (error) {
        toast({
          title: "Google Sign-In Error",
          description: error.message,
          variant: "destructive",
          duration: 9000,
        });
        setOauthLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Google Sign-In Error",
        description: err?.message || "Could not initiate Google sign in",
        variant: "destructive",
        duration: 9000,
      });
      setOauthLoading(false);
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginValidationSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    let { error } = await supabase().auth.signInWithPassword(data);

    if (error && error.message.toLowerCase().includes("email not confirmed")) {
      try {
        const res = await fetch("/api/auth/auto-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

        if (res.ok) {
          const retry = await supabase().auth.signInWithPassword(data);
          error = retry.error;
        }
      } catch (confirmErr) {
        // Continue with original error
      }
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 9000,
      });

      return;
    }

    toast({
      title: "Welcome back!",
      description: "Redirecting to your dashboard...",
      duration: 3000,
    });

    window.location.href = "/dashboard";
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
            <FormInput label={t("login.emailLabel")}>
              <Input {...field} />
            </FormInput>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput label={t("login.passwordLabel")}>
              <Input {...field} type="password" />
            </FormInput>
          )}
        />
        <Button loading={form.formState.isSubmitting} type="submit">
          {t("login.submitButton")}
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
          void signInWithOauth("google");
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
