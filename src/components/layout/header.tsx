function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed left-0 top-0 z-30 flex h-[60px] w-full items-center justify-between bg-white px-[20px]">
      {children}
    </header>
  );
}

export default Header;
