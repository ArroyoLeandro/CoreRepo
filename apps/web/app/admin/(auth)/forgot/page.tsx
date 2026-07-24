import { AuthShell, ForgotForm } from "@/features/auth";

export default function AdminForgotPage() {
  return (
    <AuthShell
      brand="CoreRepo"
      panelTitle="Reset access"
      panelSubtitle="We’ll email a reset token (dev stub logs it to the console)."
      steps={[
        { n: 1, label: "Request reset email", active: true },
        { n: 2, label: "Open the token link" },
        { n: 3, label: "Choose a new password" },
      ]}
      formTitle="Forgot password"
      formSubtitle="Enter the email associated with your account."
      theme="dark"
    >
      <ForgotForm />
    </AuthShell>
  );
}
