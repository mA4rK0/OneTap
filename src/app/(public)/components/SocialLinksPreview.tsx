"use client";

import { SOCIAL_PLATFORMS } from "@/app/(private)/constants/socialPlatforms";
import type { SocialLinksPreviewProps } from "@/app/(private)/types";

export default function SocialLinksPreview({
  links,
  appearanceState,
}: SocialLinksPreviewProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No social links added yet. Add some links to see them here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {links.map((link) => {
        const platformConfig = SOCIAL_PLATFORMS[link.platform];

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-3 px-4 ${appearanceState.buttonStyle} text-center transition-all hover:scale-105 hover:shadow-lg`}
            style={{
              backgroundColor: appearanceState.buttonColor,
              color: appearanceState.textColor,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{platformConfig.icon}</span>
              <span>{platformConfig.name}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
