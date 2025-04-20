function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="text-bold32 mb-[32px] mt-[16px] h-[74px] min-h-[74px] w-full rounded-[5px] bg-primary text-tertiary_dark"
    >
      {children}
    </button>
  );
}

export default SubmitButton;
