import { NextResponse } from "next/server";
import { getProjectById, updateProject, deleteProject } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Project updated", data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function PATCH(request, ctx) {
  return PUT(request, ctx);
}

export async function DELETE(request, { params }) {
  try {
    const admin = validateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
