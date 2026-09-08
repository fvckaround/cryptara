import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, phone, country } = await request.json();

    if (!fullName || !phone || !country) {
      return NextResponse.json(
        { error: "Full name, phone, and country are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      { fullName, phone, country },
      { new: true, runValidators: true }
    ).select("fullName email phone country");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Update account error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}