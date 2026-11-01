import AuthForm from "@/Components/Auth/AuthForm";

export const metadata = {
  title: "Create an Account | Karan Khetan",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
