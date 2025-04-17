function NotPost() {
  return (
    <div className="mt-[144px] flex w-full flex-col items-center justify-center gap-[12px]">
      <div className="text-regular20">아직 올라온 게시글이 없어요</div>
      <button
        type="button"
        className="text-regular20 h-[36px] w-[136px] rounded-[10px] bg-secondary text-tertiary_dark"
      >
        글 작성하기
      </button>
    </div>
  );
}

export default NotPost;
