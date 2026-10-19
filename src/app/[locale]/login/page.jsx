import AuthForm from "@/Components/Auth/AuthForm";

export const metadata = {
  title: "Login | Karan Khetan",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
