import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const wallets = await Wallet.find({ isActive: true })
      .select("currency label network address")
      .sort({ currency: 1 })
      .lean();

    return NextResponse.json({ wallets }, { status: 200 });
  } catch (err) {
    console.error("List wallets error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}