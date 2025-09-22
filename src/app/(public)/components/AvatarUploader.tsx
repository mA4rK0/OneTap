"use client";

import type {
  AvatarUploaderProps,
  AvatarImageProps,
  UploadButtonProps,
} from "@/app/(private)/types";

export default function AvatarUploader({
  avatarUrl,
  uploading,
  onAvatarRemove,
  onButtonClick,
}: AvatarUploaderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Photo
      </label>
      <div className="flex items-center gap-4">
        <AvatarImage avatarUrl={avatarUrl} onRemove={onAvatarRemove} />
        <UploadButton
          uploading={uploading}
          hasAvatar={!!avatarUrl}
          onClick={onButtonClick}
        />
      </div>
    </div>
  );
}

function AvatarImage({ avatarUrl, onRemove }: AvatarImageProps) {
  return (
    <div className="relative">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Photo</span>
        )}
      </div>
      {avatarUrl && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

function UploadButton({ uploading, hasAvatar, onClick }: UploadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={uploading}
      className="btn-secondary text-sm disabled:opacity-50"
    >
      {uploading ? "Uploading..." : hasAvatar ? "Change Photo" : "Upload Photo"}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
