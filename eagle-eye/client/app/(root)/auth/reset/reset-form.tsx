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
import { resetSchema, type ResetFormData } from "./validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useResetPassword } from "@/hooks/useUser";

export function ResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit = (data: ResetFormData) => {
    resetPassword({
      email: data.email,
      reset_password_Q: data.resetQuestion,
      reset_password_A: data.resetAnswer,
      newPassword: data.newPassword,
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
              Remember your password?{" "}
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
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </div>
            {isPending ? (
              <Button type="submit" className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
