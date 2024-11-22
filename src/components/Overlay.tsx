interface OverlayProps {
  show: boolean;
  onClose?: () => void;
  className?: string;
}

export function Overlay({ show, onClose, className = "" }: OverlayProps) {
  if (!show) return null;

  return (
    <div
      aria-hidden='true'
      onClick={onClose}
      className={`
        fixed top-16 bottom-0 right-0 left-0
        backdrop-blur-sm bg-black/30
        z-20
        transition-opacity duration-200
        supports-[backdrop-filter]:bg-black/20
        ${className}
      `}
    />
  );
}
