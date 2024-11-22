import { useMediaQuery } from "./useMediaQuery";

export function useViewport() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch: isMobile || isTablet,
    viewport: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
  } as const;
}
