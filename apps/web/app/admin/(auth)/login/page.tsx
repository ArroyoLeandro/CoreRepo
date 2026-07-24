import { AuthShell, LoginForm } from "@/features/auth";

export default function AdminLoginPage() {
  return (
    <AuthShell
      brand="CoreRepo"
      panelTitle="Welcome back"
      panelSubtitle="Sign in to manage users, settings, and the admin workspace."
      steps={[
        { n: 1, label: "Sign in to your account", active: true },
        { n: 2, label: "Open the dashboard" },
        { n: 3, label: "Configure workspace prefs" },
      ]}
      formTitle="Sign in"
      formSubtitle="Enter your credentials to continue."
      theme="dark"
    >
      <LoginForm />
    </AuthShell>
  );
}
