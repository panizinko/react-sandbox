import { useEffect } from "react";

interface UseOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  lockScroll?: boolean;
}

export function useOverlay({
  isOpen,
  onClose,
  lockScroll = true,
}: UseOverlayProps) {
  useEffect(() => {
    if (!lockScroll) return;

    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isOpen, lockScroll]);

  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return {
    overlayProps: {
      "aria-hidden": true,
      onClick: onClose,
      className: "fixed inset-0 bg-black bg-opacity-50 z-20",
    },
  };
}
