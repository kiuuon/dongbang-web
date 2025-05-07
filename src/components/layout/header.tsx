function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-[60px] w-full items-center justify-between bg-white pl-[21px]">
      {children}
    </header>
  );
}

export default Header;
