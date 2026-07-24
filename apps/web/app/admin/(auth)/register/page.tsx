import { AuthShell, RegisterForm } from "@/features/auth";

export default function AdminRegisterPage() {
  return (
    <AuthShell
      brand="CoreRepo"
      panelTitle="Get started with us"
      panelSubtitle="Complete these easy steps to register your account."
      steps={[
        { n: 1, label: "Sign up your account", active: true },
        { n: 2, label: "Set up your workspace" },
        { n: 3, label: "Set up your profile" },
      ]}
      formTitle="Sign up account"
      formSubtitle="Enter your personal data to create your account."
      theme="dark"
    >
      <RegisterForm />
    </AuthShell>
  );
}
