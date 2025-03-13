import { useRouter } from 'next/router';

import Navigator from '@/components/main/navigator';
import JoinClubPrompt from '@/components/main/join-club-prompt';
import NotPost from '@/components/main/not-post';

function Main() {
  const router = useRouter();
  const { clubType } = router.query;

  return (
    <div>
      <Navigator />
      {clubType === 'my-club' ? <JoinClubPrompt /> : <NotPost />}
    </div>
  );
}

export default Main;
