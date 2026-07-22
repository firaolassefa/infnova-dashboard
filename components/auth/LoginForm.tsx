"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  prefillEmail?: string;
}

export function LoginForm({ prefillEmail }: LoginFormProps) {
  const router = useRouter();
  const { setToken, setLastEmail } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: prefillEmail ?? "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsNetworkError(false);
    setLastEmail(values.email);

    try {
      const response = await login({ email: values.email, password: values.password });
      const token = response.accessToken || response.token || "";
      setToken(token);
      router.replace("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setIsNetworkError(true);
          setServerError("Network error. Please check your connection and try again.");
        } else if (err.response.status === 401 || err.response.status === 400) {
          setServerError("Invalid email or password. Please try again.");
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  const handleRetry = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@infnova.tech"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          className="min-h-[44px]"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
          className="min-h-[44px]"
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <div
          className="rounded-md bg-red-50 border border-red-200 p-3"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-700">{serverError}</p>
          {isNetworkError && (
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 text-sm font-medium text-red-700 underline focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full min-h-[44px]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
