import { redirect } from "next/navigation";
import AccountDashboard from "@/Components/Booking/AccountDashboard";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "My Appointments | Karan Khetan",
  robots: { index: false, follow: false },
};

export default async function AccountPage({ params }) {
  const { locale } = await params;
  const user = await getSessionUser();
  if (!user) {
    const path = `/${locale}/account`;
    redirect(`/${locale}/login?returnTo=${encodeURIComponent(path)}`);
  }
  return <AccountDashboard user={user} />;
}
