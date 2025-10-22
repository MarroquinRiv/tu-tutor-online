"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(name: string, email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        email: email,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, needsEmailConfirmation: true };
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}