import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  const admin = validateAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
}
