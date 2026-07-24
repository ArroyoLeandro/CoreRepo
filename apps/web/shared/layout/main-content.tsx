import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function MainContent({ children, className = "" }: Props) {
  return (
    <main
      className={`flex min-h-0 flex-1 flex-col overflow-hidden bg-canvas p-2 md:p-3 ${className}`}
      data-testid="admin-main"
    >
      {children}
    </main>
  );
}
