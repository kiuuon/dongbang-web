function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`text-bold16 mb-[21px] mt-[32px] h-[56px] min-h-[56px] w-full rounded-[24px] ${disabled ? 'bg-gray0' : 'bg-primary'} text-white`}
    >
      {children}
    </button>
  );
}

export default SubmitButton;
