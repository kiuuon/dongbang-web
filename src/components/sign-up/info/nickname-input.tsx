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
    <div className="relative flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
      <label htmlFor="nickname" className="text-bold12 flex text-gray2">
        닉네임
      </label>
      <div className="flex gap-[15px]">
        <input
          id="nickname"
          value={value}
          className="text-bold12 w-[224px] text-center text-gray2 outline-none placeholder:text-gray0"
          onChange={handleNickname}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="text-regular12 absolute right-[20px] top-[10px] flex h-[18px] w-[56px] items-center justify-center rounded-[5px] border border-gray2 bg-primary text-gray2"
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
