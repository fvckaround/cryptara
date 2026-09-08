import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    const allowedFields = ["currency", "label", "network", "address", "isActive"];
    const patch = {};
    for (const field of allowedFields) {
      if (field in updates) {
        patch[field] =
          field === "currency" ? updates[field]?.toUpperCase() : updates[field];
      }
    }

    await connectDB();

    const wallet = await Wallet.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({ wallet }, { status: 200 });
  } catch (err) {
    console.error("Update wallet error:", err);
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

    const wallet = await Wallet.findByIdAndDelete(id);
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete wallet error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}