import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function MainContent({ children, className = "" }: Props) {
  return (
    <main
      className={`min-h-0 flex-1 overflow-y-auto bg-canvas p-3 md:p-4 ${className}`}
      data-testid="admin-main"
    >
      {children}
    </main>
  );
}
