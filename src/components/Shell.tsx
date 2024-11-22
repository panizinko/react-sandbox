import { ReactNode, useState } from "react";
import { useViewport } from "../hooks/useViewport";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { isMobile } = useViewport();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className='min-h-screen'>
      <Header onMenuToggle={toggleMenu} />
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMenu} />
      <main
        className={`
        min-h-screen
        pt-16
        transition-[padding] duration-200
        ${isMobile ? "" : "md:pl-64"}
      `}
      >
        <div className='p-4 lg:p-8 min-h-screen'>{children}</div>
      </main>
    </div>
  );
}
