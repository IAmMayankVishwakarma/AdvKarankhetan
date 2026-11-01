import { redirect } from "next/navigation";
import BookingFlow from "@/Components/Booking/BookingFlow";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Book an Appointment | Karan Khetan",
  robots: { index: false, follow: false },
};

export default async function BookPage({ params }) {
  const { locale } = await params;
  const user = await getSessionUser();
  if (!user) {
    const path = `/${locale}/book`;
    redirect(`/${locale}/login?returnTo=${encodeURIComponent(path)}`);
  }
  return <BookingFlow />;
}
