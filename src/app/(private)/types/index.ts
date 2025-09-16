type Props = { mode: "signup" | "login" };

type Profile = {
  username: string | null;
  category: string | null;
};

type AppearanceSettings = {
  background: string;
  buttonStyle: "rounded-lg" | "rounded-full";
  buttonColor: string;
  textColor: string;
  font: string;
};

type EditCategoryProps = {
  currentCategory?: string;
  onSuccess?: () => void;
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

export type {
  Profile,
  ProfileCategory,
  Props,
  AppearanceSettings,
  EditCategoryProps,
};
