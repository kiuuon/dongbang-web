function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-[48px] w-full items-center justify-between bg-white pl-[20px] pt-[12px]">
      {children}
    </header>
  );
}

export default Header;
