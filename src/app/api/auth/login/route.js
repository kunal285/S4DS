import { NextResponse } from "next/server";
import { getAdminByEmail } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    const envName = process.env.ADMIN_NAME || "S4DS MITAOE Administrator";

    let admin = null;

    // 1. Primary check: Exact match with environment variables from .env
    if (envEmail && envPassword && email.trim().toLowerCase() === envEmail.trim().toLowerCase()) {
      if (password === envPassword) {
        admin = {
          id: "admin-1",
          email: envEmail,
          name: envName,
          role: "admin",
        };
      } else {
        return NextResponse.json(
          { error: "Invalid admin credentials" },
          { status: 401 }
        );
      }
    } else {
      // 2. Fallback: Database stored hash check
      admin = await getAdminByEmail(email);
      if (!admin) {
        return NextResponse.json(
          { error: "Invalid admin credentials" },
          { status: 401 }
        );
      }

      const isValid = comparePassword(password, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid admin credentials" },
          { status: 401 }
        );
      }
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("s4ds_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
