import { useMutation } from '@tanstack/react-query';

import { isNicknameExists } from '@/lib/apis/sign-up';

function NicknameInput({
  value,
  onChange,
  onBlur,
  setIsDuplicate,
  setIsSameCheck,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  setIsDuplicate: (value: boolean) => void;
  setIsSameCheck: (value: boolean) => void;
}) {
  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    setIsDuplicate(false);
    setIsSameCheck(false);
  };

  const { mutate: handleNicknameSameCheck } = useMutation({
    mutationFn: () => isNicknameExists(value),
    onSuccess: (data) => {
      if (data) {
        setIsDuplicate(true);
        setIsSameCheck(false);
      } else {
        setIsSameCheck(true);
        setIsDuplicate(false);
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  return (
    <div className="relative">
      <label htmlFor="nickname" className="text-bold16 flex text-gray2">
        닉네임
      </label>
      <div className="flex gap-[15px]">
        <input
          id="nickname"
          value={value}
          className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none"
          onChange={handleNickname}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="text-regular12 border-primary_dark absolute right-[20px] top-[41px] flex h-[18px] w-[56px] items-center justify-center rounded-[5px] border bg-primary text-gray2"
          onMouseDown={(event) => {
            event.preventDefault();
            handleNicknameSameCheck();
          }}
        >
          중복확인
        </button>
      </div>
    </div>
  );
}

export default NicknameInput;
