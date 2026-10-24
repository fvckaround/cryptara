import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

const MAX_DEPTH = 5;

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const user = await User.findById(id)
      .select("fullName email referredBy")
      .populate("referredBy", "fullName email")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Walk down the referral chain one level at a time.
    const root = { children: [] };
    const nodes = new Map([[id, root]]);
    const visited = new Set([id]);
    let frontier = [id];
    let total = 0;

    for (let depth = 1; depth <= MAX_DEPTH && frontier.length > 0; depth++) {
      const referred = await User.find({ referredBy: { $in: frontier } })
        .select("fullName email createdAt referredBy")
        .sort({ createdAt: 1 })
        .lean();

      const next = [];

      for (const person of referred) {
        const personId = person._id.toString();
        if (visited.has(personId)) continue;
        visited.add(personId);

        const node = {
          id: personId,
          fullName: person.fullName,
          email: person.email,
          joinedAt: person.createdAt,
          level: depth,
          children: [],
        };

        nodes.set(personId, node);
        nodes.get(person.referredBy.toString()).children.push(node);
        next.push(personId);
        total++;
      }

      frontier = next;
    }

    // If the chain goes deeper than we display, tell the UI.
    let hasMoreLevels = false;
    if (frontier.length > 0) {
      const deeper = await User.exists({ referredBy: { $in: frontier } });
      hasMoreLevels = Boolean(deeper);
    }

    return NextResponse.json(
      {
        upline: user.referredBy
          ? {
              fullName: user.referredBy.fullName,
              email: user.referredBy.email,
            }
          : null,
        downline: root.children,
        total,
        hasMoreLevels,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Admin referrals error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
