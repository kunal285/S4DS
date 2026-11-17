import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";

    const projects = await getProjects({ domain, search, featuredOnly: featured });
    return NextResponse.json(
      { success: true, count: projects.length, data: projects },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const project = await createProject(body);
    return NextResponse.json({ success: true, message: "Project created", data: project }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
