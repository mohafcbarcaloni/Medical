import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/start-server-core";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findUserByEmail, addUser, updateUser } from "./db";

// Use a more secure secret for the admin session value instead of just "authenticated"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Tarek12042008Lin";
const ADMIN_SESSION_SECRET = "doctor_tarek_secure_admin_v1";

export const checkAuthFn = createServerFn({ method: "GET" }).handler(async () => {
  const adminSession = getCookie("admin_session");
  const userSession = getCookie("user_session");

  console.log(`[AUTH] Checking - Admin: ${adminSession ? "Yes" : "No"}, User: ${userSession ? "Yes" : "No"}`);

  if (adminSession && adminSession === ADMIN_SESSION_SECRET) {
    return { isAuthenticated: true, role: "admin" };
  }

  // Check if session exists and isn't an empty string or "null" string
  if (!userSession || userSession === "" || userSession === "null" || userSession === "undefined") {
    return { isAuthenticated: false };
  }

  try {
    const userData = JSON.parse(userSession);
    if (!userData || !userData.email) return { isAuthenticated: false };
    
    // Verify user actually exists in the database to prevent ghost sessions
    const realUser = await findUserByEmail(userData.email);
    if (!realUser) return { isAuthenticated: false };

    // Explicitly set role to user to prevent any role spoofing from the cookie data
    return { isAuthenticated: true, user: userData, role: "user" };
  } catch (err) {
    console.error("[AUTH] Parse error:", err);
    return { isAuthenticated: false };
  }
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data as z.infer<typeof signupSchema>;
    const existing = await findUserByEmail(data.email);
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    await addUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    
    // Clear any existing admin session when a user signs up/logs in
    setCookie("admin_session", "", { path: "/", maxAge: 0 });
    
    setCookie("user_session", JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return { success: true, user: userWithoutPassword, role: "user" };
  });

const loginSchema = z.object({
  email: z.string().optional(),
  password: z.string(),
});

export const loginFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data as z.infer<typeof loginSchema>;

    // 1. Check Master Password (Admin)
    if (!data.email && data.password === ADMIN_PASSWORD) {
      // Clear existing user session when logging in as admin
      setCookie("user_session", "", { path: "/", maxAge: 0 });
      
      setCookie("admin_session", ADMIN_SESSION_SECRET, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
      return { success: true, role: "admin" };
    }

    // 2. Check User Email/Password
    if (data.email) {
      const user = await findUserByEmail(data.email);
      if (!user) throw new Error("Invalid email or password");

      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) throw new Error("Invalid email or password");

      const { password: _, ...userWithoutPassword } = user;
      
      // Clear existing admin session when logging in as a regular user
      setCookie("admin_session", "", { path: "/", maxAge: 0 });
      
      setCookie("user_session", JSON.stringify(userWithoutPassword), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });

      return { success: true, user: userWithoutPassword, role: "user" };
    }

    throw new Error("Invalid credentials");
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  // Use multiple methods to ensure cookie deletion across all browsers
  const cookieOptions = { 
    path: "/", 
    maxAge: 0, 
    expires: new Date(0),
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
  
  setCookie("admin_session", "", cookieOptions);
  setCookie("user_session", "", cookieOptions);
  
  console.log("[AUTH] User logged out, cookies cleared");
  return { success: true };
});

const forgotSchema = z.object({ email: z.string().email() });

export const forgotPasswordFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data as z.infer<typeof forgotSchema>;
    const user = await findUserByEmail(data.email);
    if (!user) return { success: true, message: "If an account exists, a reset link was sent." };

    const resetToken = Math.random().toString(36).slice(-8);
    await updateUser(data.email, { resetToken, resetTokenExpiry: Date.now() + 3600000 });

    console.log(`[AUTH] Reset token for ${data.email}: ${resetToken}`);
    return { success: true, message: "Reset link sent to your email." };
  });

export const socialLoginFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const { provider, email, name } = ctx.data as { provider: string; email?: string; name?: string };
    
    // In a real OAuth flow, these would come from the provider (Google/Facebook)
    const socialEmail = email || `${provider.toLowerCase()}_user@example.com`;
    const socialName = name || `${provider} User`;

    let user = await findUserByEmail(socialEmail);
    
    if (!user) {
      user = {
        id: `social_${Date.now()}`,
        name: socialName,
        email: socialEmail,
        createdAt: new Date().toISOString(),
        password: "SOCIAL_AUTH_PROVIDER", // Placeholder for social users
      };
      await addUser(user);
    }
    
    const { password: _, ...userWithoutPassword } = user;

    // Clear admin session on social login
    setCookie("admin_session", "", { path: "/", maxAge: 0 });

    setCookie("user_session", JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return { success: true, user: userWithoutPassword, role: "user" };
  });

