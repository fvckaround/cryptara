import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const wallets = await Wallet.find({}).sort({ currency: 1 }).lean();

    return NextResponse.json({ wallets }, { status: 200 });
  } catch (err) {
    console.error("Admin list wallets error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currency, label, network, address } = await request.json();

    if (!currency || !label || !network || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const wallet = await Wallet.create({
      currency: currency.toUpperCase(),
      label,
      network,
      address,
    });

    return NextResponse.json({ wallet }, { status: 201 });
  } catch (err) {
    console.error("Create wallet error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}