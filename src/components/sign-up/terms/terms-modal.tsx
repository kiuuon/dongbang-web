import TermsType from '@/lib/terms/terms-type';

export default function TermsModal({
  title,
  terms,
  onClose,
}: {
  title: string;
  terms: TermsType[];
  onClose: () => void;
}) {
  return (
    <div
      tabIndex={0}
      role="button"
      className="fixed bottom-0 left-0 right-0 z-50 m-auto flex h-screen w-screen max-w-[600px] items-center bg-black bg-opacity-60 px-[32px]"
      onClick={(event) => {
        if (event.target instanceof HTMLElement && event.target.classList.contains('bg-black')) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.target instanceof HTMLElement && event.target.classList.contains('bg-black')) {
          onClose();
        }
      }}
    >
      <div className="flex flex-col items-center justify-center gap-[10px] rounded-[20px] bg-white p-[20px]">
        <h2 className="text-bold16 w-full text-start">{title}</h2>

        <div className="text-regular14 h-[284px] overflow-y-auto bg-background px-[8px] py-[12px] text-gray2">
          {terms.map((section: TermsType) => {
            const plainText = section.content.map((c) => c.text).join('');

            return (
              <div key={section.id} className="mb-8 last:mb-0">
                <p className="text-gray-900 mb-2 text-[15px] font-bold">{section.title}</p>
                <p className="text-gray-600 whitespace-pre-wrap text-sm leading-6">{plainText}</p>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="text-bold16 h-[56px] w-full rounded-[24px] bg-primary text-white"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
