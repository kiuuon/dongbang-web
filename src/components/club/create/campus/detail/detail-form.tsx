import ActivityInput from './ativity-input';
import LogoInput from './logo-input';

function DetailForm() {
  return (
    <form className="flex flex-col gap-[32px]">
      <LogoInput />
      <ActivityInput />
    </form>
  );
}

export default DetailForm;
