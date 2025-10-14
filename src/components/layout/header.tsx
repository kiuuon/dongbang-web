function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 m-auto flex h-[60px] w-full max-w-[600px] items-center justify-between bg-white px-[20px]">
      {children}
    </header>
  );
}

export default Header;
