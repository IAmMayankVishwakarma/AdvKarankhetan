import { notFound, redirect } from "next/navigation";
import AdminDashboard from "@/Components/Booking/AdminDashboard";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Admin Panel | Karan Khetan",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ params }) {
  const { locale } = await params;
  const user = await getSessionUser();
  if (!user) {
    const path = `/${locale}/admin`;
    redirect(`/${locale}/login?returnTo=${encodeURIComponent(path)}`);
  }
  if (user.role !== "ADMIN") notFound();
  return <AdminDashboard />;
}
