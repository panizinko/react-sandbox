import { useNavigate } from "@tanstack/react-router";
import { useOverlay } from "../hooks/useOverlay";
import { useViewport } from "../hooks/useViewport";
import { Overlay } from "./Overlay";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Metrics", path: "/metrics" },
  { label: "Logs", path: "/logs" },
  { label: "Alerts", path: "/alerts" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isMobile } = useViewport();
  useOverlay({
    isOpen: isMobile && isOpen,
    onClose,
  });

  const navigate = useNavigate();

  return (
    <>
      <Overlay show={isMobile && isOpen} onClose={onClose} className='top-0' />

      <aside
        className={`
          fixed md:fixed top-16 bottom-0 left-0
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-200 ease-in-out
          w-64 backdrop-blur-md bg-white border-r border-gray-200/80
          z-20 overflow-y-auto
        `}
      >
        <nav className='flex flex-col gap-2 p-4'>
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                navigate({ to: item.path });
              }}
              className='px-4 py-3 rounded-md hover:bg-white/50 transition-colors'
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
