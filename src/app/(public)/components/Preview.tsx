"use client";

import { THEMES } from "@/app/(private)/constants/themes";
import type { SocialLink, PreviewProps } from "@/app/(private)/types";

export default function Preview({
  username,
  avatarUrl,
  appearanceState,
  selectedTheme,
  socialLinks = [],
}: PreviewProps) {
  const theme = THEMES.find((t) => t.id === selectedTheme);
  const background = theme?.gradient || appearanceState.background;

  return (
    <div className="sticky top-4">
      <div className="phone-mockup">
        <div className="phone-frame">
          <div
            className="phone-screen"
            style={{
              background: background,
            }}
          >
            <div className="p-4 h-full flex flex-col">
              {/* Profile Section */}
              <div className="text-center mb-4 mt-2">
                <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-white/30">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xl">👤</span>
                  )}
                </div>
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: appearanceState.textColor }}
                >
                  @{username}
                </h2>
                <p
                  className="text-xs opacity-80"
                  style={{ color: appearanceState.textColor }}
                >
                  Welcome to my page!
                </p>
              </div>

              {/* Social Links Section */}
              <div className="flex-1 overflow-y-auto px-2">
                {socialLinks.length === 0 ? (
                  <div className="text-center py-4">
                    <p
                      className="text-sm opacity-70 mb-2"
                      style={{ color: appearanceState.textColor }}
                    >
                      No links yet
                    </p>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-full py-2 px-3 ${appearanceState.buttonStyle} text-center opacity-40`}
                          style={{
                            backgroundColor: appearanceState.buttonColor,
                            color: appearanceState.textColor,
                          }}
                        >
                          Link {i}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {socialLinks.map((link) => {
                      // Simple icon mapping untuk preview
                      const getIcon = (platform: string) => {
                        const icons: Record<string, string> = {
                          instagram: "📸",
                          facebook: "👥",
                          twitter: "🐦",
                          youtube: "📺",
                          tiktok: "🎵",
                          linkedin: "💼",
                          whatsapp: "💬",
                          telegram: "📨",
                          spotify: "🎵",
                          github: "💻",
                          discord: "👾",
                          website: "🌐",
                          email: "✉️",
                          phone: "📱",
                        };
                        return icons[platform] || "🔗";
                      };

                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full py-2 px-3 ${appearanceState.buttonStyle} text-center transition-all duration-200 hover:scale-105 active:scale-95`}
                          style={{
                            backgroundColor: appearanceState.buttonColor,
                            color: appearanceState.textColor,
                            border: `1px solid ${appearanceState.textColor}20`,
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm">
                              {getIcon(link.platform)}
                            </span>
                            <span className="text-sm font-medium">
                              {link.platform.charAt(0).toUpperCase() +
                                link.platform.slice(1)}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center mt-2 pt-2 border-t border-white/10">
                <p
                  className="text-xs opacity-60"
                  style={{ color: appearanceState.textColor }}
                >
                  Powered by OneTap
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .phone-mockup {
          perspective: 1000px;
          transform-style: preserve-3d;
          margin: 0 auto;
        }

        .phone-frame {
          width: 280px;
          height: 560px;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border-radius: 30px;
          padding: 10px;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
          position: relative;
          transform: rotateX(5deg) rotateY(-5deg);
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .phone-frame:hover {
          transform: rotateX(3deg) rotateY(-3deg);
        }

        .phone-screen {
          height: 100%;
          border-radius: 25px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1024px) {
          .phone-frame {
            width: 260px;
            height: 520px;
            transform: none;
          }

          .phone-frame:hover {
            transform: none;
          }
        }

        @media (max-width: 640px) {
          .phone-mockup {
            transform: scale(0.8);
            margin: -20px auto;
          }
        }
      `}</style>
    </div>
  );
}
