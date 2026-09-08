import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/models/Plan";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

const ALLOWED_FIELDS = [
  "name",
  "tagline",
  "dailyRate",
  "termDays",
  "minDeposit",
  "maxDeposit",
  "popular",
  "features",
  "isActive",
];

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    const patch = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in updates) {
        patch[field] = updates[field];
      }
    }

    await connectDB();

    const plan = await Plan.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ plan }, { status: 200 });
  } catch (err) {
    console.error("Update plan error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A plan with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const plan = await Plan.findByIdAndDelete(id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete plan error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}