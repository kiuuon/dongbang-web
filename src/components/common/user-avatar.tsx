import Image from 'next/image';

function UserAvatar({ avatar, size }: { avatar: string | undefined | null; size: number }) {
  return avatar ? (
    <Image
      src={avatar}
      alt="아바타"
      width={size}
      height={size}
      style={{
        objectFit: 'cover',
        width: `${size}px`,
        minWidth: `${size}px`,
        height: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
      }}
    />
  ) : (
    <Image
      src="/images/none_avatar.png"
      alt="아바타"
      width={size}
      height={size}
      style={{
        objectFit: 'cover',
        width: `${size}px`,
        minWidth: `${size}px`,
        height: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
      }}
    />
  );
}

export default UserAvatar;
