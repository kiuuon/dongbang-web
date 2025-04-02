function ActivityInput({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newPreviews.push(reader.result);

          if (newPreviews.length === files.length) {
            onChange([...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newPreviews = value.filter((_, idx) => idx !== index);
    onChange(newPreviews);
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <p>활동 사진</p>
      {value.length === 0 && (
        <label
          htmlFor="file-upload"
          className="relative flex h-[144px] w-[144px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-gray-100"
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="absolute h-full w-full cursor-pointer opacity-0"
          />
          <span className="text-gray-500">추가하기</span>
        </label>
      )}

      <div className="w-full overflow-x-auto">
        <div className="flex w-max gap-[8px]">
          {value.map((preview, index) => (
            <div
              key={preview}
              className="relative h-[144px] w-[144px] rounded-lg border bg-gray-100"
              style={{
                backgroundImage: `url(${preview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:bg-red-500 hover:text-white"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityInput;
