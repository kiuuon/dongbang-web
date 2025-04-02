export interface ClubType {
  type: string;
  name: string;
  category: string;
  location: string;
  description: string;
  tags: string[];
  logo: string;
  activity_photos: string[];
  detail_description: string;
  detail_type: string | null;
}
