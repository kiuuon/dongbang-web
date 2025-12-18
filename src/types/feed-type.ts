export interface FeedType {
  id: string;
  author_id: string;
  author: {
    id: string;
    name: string;
    nickname: string;
    avatar: string;
    deleted_at: string;
    role: string | null;
  };
  club_id: string;
  club: {
    name: string;
    logo: string;
  };
  club_type: 'campus' | 'union';
  photos: string[];
  title: string;
  content: string;
  is_nickname_visible: boolean;
  is_private: boolean;
  like_count: number;
  taggedUsers: {
    user: {
      id: string;
      name: string;
      nickname: string;
      avatar: string;
      deleted_at: string;
    };
  }[];
  taggedClubs: {
    club: {
      id: string;
      name: string;
      logo: string;
    };
  }[];
  created_at: string;
}

export interface CommentType {
  id: string;
  feed_id: string;
  author_id: string;
  like_count: number;
  reply_count: number;
  author: {
    id: string;
    name: string;
    nickname: string;
    avatar: string | null;
    deleted_at: string | null;
  };
  content: string;
  created_at: string;
}
