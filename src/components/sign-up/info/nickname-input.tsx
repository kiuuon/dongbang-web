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
    <div>
      <div className="text-[14px] text-[#969696]">닉네임</div>
      <div className="flex gap-[15px]">
        <input
          value={value}
          className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
          onChange={handleNickname}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="h-[20px] w-[50px] rounded-[10px] bg-[#E9E9E9] text-[10px] text-[#969696]"
          onClick={() => {
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
