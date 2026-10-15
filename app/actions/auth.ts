"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export type AuthState = {
  error?: string;
};

function value(formData: FormData, name: string) {
  const input = formData.get(name);
  return typeof input === "string" ? input.trim() : "";
}

export async function signUp(_state: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const name = value(formData, "name");
  const email = value(formData, "email").toLowerCase();
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";

  if (name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return { error: "Use at least 8 characters with at least one letter and one number." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: hashPassword(password) },
  });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function signIn(_state: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const email = value(formData, "email").toLowerCase();
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Email or password is incorrect." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}
