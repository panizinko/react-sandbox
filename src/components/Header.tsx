import { useViewport } from "../hooks/useViewport";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { isMobile } = useViewport();

  return (
    <header className='h-16 fixed top-0 left-0 right-0 z-20 backdrop-blur-md bg-white/75 border-b border-gray-200/80 px-4 lg:px-8 flex items-center justify-between supports-[backdrop-filter]:bg-white/75'>
      <div className='flex items-center gap-2'>
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className='p-2 rounded-md hover:bg-gray-100'
            aria-label='Toggle menu'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        )}
        <div className='text-lg lg:text-xl font-semibold'>InfraMonitor</div>
      </div>

      <nav className='flex items-center gap-2 lg:gap-4'>
        {!isMobile && (
          <button className='px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors'>
            Search
          </button>
        )}
        <button className='px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors'>
          Settings
        </button>
        <button className='px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors'>
          Profile
        </button>
      </nav>
    </header>
  );
}
