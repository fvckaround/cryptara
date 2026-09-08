import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DashboardNav from "@/app/components/DashboardNav";
import ProfileForm from "@/app/components/ProfileForm";
import PasswordForm from "@/app/components/PasswordForm";

export const metadata = {
  title: "Settings — Cryptara Holdings",
};

export default async function SettingsPage() {
  const session = await getSession();

  await connectDB();
  const user = await User.findById(session.userId)
    .select("fullName email phone country")
    .lean();

  const initialUser = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
  };

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-2xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Settings
        </h1>

        <div className="mt-8 border-t border-hairline pt-8 md:mt-10">
          <h2 className="font-display text-lg text-warm-white">Profile</h2>
          <div className="mt-6">
            <ProfileForm initialUser={initialUser} />
          </div>
        </div>

        <div className="mt-10 border-t border-hairline pt-8">
          <h2 className="font-display text-lg text-warm-white">Password</h2>
          <div className="mt-6">
            <PasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}