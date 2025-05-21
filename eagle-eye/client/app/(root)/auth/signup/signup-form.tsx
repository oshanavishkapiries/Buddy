"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { generalData } from "@/data/general";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "./validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate: registerUser, isPending } = useRegisterUser();

  const onSubmit = (data: SignupFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      reset_password_Q: data.resetQuestion,
      reset_password_A: data.resetAnswer,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Logo />
              </div>
              <span className="sr-only">{generalData.title}</span>
            </a>
            <h1 className="text-xl font-bold uppercase">{generalData.title}</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="resetQuestion">Security Question</Label>
                <Select
                  onValueChange={(value) => setValue("resetQuestion", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a security question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="What was the name of your first pet?">
                      What was the name of your first pet?
                    </SelectItem>
                    <SelectItem value="What is the name of the street you grew up on?">
                      What is the name of the street you grew up on?
                    </SelectItem>
                    <SelectItem value="What was the model of your first car?">
                      What was the model of your first car?
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.resetQuestion && (
                  <p className="text-sm text-red-500">
                    {errors.resetQuestion.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="resetAnswer">Security Answer</Label>
                <Input
                  id="resetAnswer"
                  type="text"
                  placeholder="Enter your answer"
                  {...register("resetAnswer")}
                />
                {errors.resetAnswer && (
                  <p className="text-sm text-red-500">
                    {errors.resetAnswer.message}
                  </p>
                )}
              </div>
            </div>
            {isPending ? (
              <Button type="submit" className="w-full" disabled>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
