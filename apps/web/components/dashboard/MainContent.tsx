import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function MainContent({ children, className = "" }: Props) {
  return (
    <main
      className={`min-h-0 flex-1 overflow-y-auto bg-canvas p-4 md:p-6 ${className}`}
      data-testid="admin-main"
    >
      {children}
    </main>
  );
}
