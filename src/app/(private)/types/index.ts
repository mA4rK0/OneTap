type Props = { mode: "signup" | "login" };

type Profile = {
  username: string | null;
  category: string | null;
};

type ProfileCategory =
  | "sports"
  | "technology"
  | "music"
  | "art"
  | "business"
  | "education"
  | "entertainment"
  | "food_&_beverage"
  | "travel"
  | "other"
  | "health"
  | "government_&_politics"
  | "fashion_&_beauty";

export type { Profile, ProfileCategory, Props };
