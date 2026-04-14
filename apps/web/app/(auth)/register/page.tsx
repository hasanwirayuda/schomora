"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.push("/dashboard");
    },
  });

  return (
    <Card padding="lg">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">Schomora</h1>
        <p className="text-sm text-gray-500 mt-1">Adaptive Learning Platform</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Buat akun baru
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-indigo-600 hover:underline font-medium"
        >
          Masuk di sini
        </Link>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {(error as any)?.response?.data?.error || "Terjadi kesalahan"}
        </div>
      )}

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Nama lengkap"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Minimal 6 karakter"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          className="mt-2 w-full"
        >
          Daftar sekarang
        </Button>
      </form>
    </Card>
  );
}
