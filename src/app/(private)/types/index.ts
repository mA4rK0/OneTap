import { THEMES } from "@/app/(private)/constants/themes";
import type { AppearanceState } from "@/app/(private)/constants/themes";

type PreviewProps = {
  username: string;
  avatarUrl: string | null;
  appearanceState: AppearanceState;
  selectedTheme: string;
};

type AppearanceFormProps = {
  avatarUrl: string | null;
  uploading: boolean;
  selectedTheme: string;
  appearanceState: AppearanceState;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarRemove: () => void;
  onThemeChange: (themeId: string) => void;
  onAppearanceChange: (updates: Partial<AppearanceState>) => void;
  onSave: () => void;
  onCancel: () => void;
};

type Props = { mode: "signup" | "login" };

type Profile = {
  username: string | null;
  category: string | null;
};

type AvatarUploaderProps = {
  avatarUrl: string | null;
  uploading: boolean;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarRemove: () => void;
  onButtonClick: () => void;
};

type AvatarImageProps = {
  avatarUrl: string | null;
  onRemove: () => void;
};

type UploadButtonProps = {
  uploading: boolean;
  hasAvatar: boolean;
  onClick: () => void;
};

type ThemeSelectorProps = {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
};

type ThemeCardProps = {
  theme: (typeof THEMES)[number];
  isSelected: boolean;
  onSelect: () => void;
};

type AppearanceSettings = {
  background: string;
  buttonStyle: "rounded-lg" | "rounded-full";
  buttonColor: string;
  textColor: string;
  font: string;
  avatar_url: string;
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
  AvatarUploaderProps,
  AvatarImageProps,
  UploadButtonProps,
  ThemeSelectorProps,
  ThemeCardProps,
  PreviewProps,
  AppearanceFormProps,
};
