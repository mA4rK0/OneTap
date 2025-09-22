"use client";

import { THEMES } from "@/app/(private)/constants/themes";
import type { PreviewProps } from "@/app/(private)/types";

const MOCK_LINKS = ["Website", "Instagram", "YouTube", "TikTok"];

export default function Preview({
  username,
  avatarUrl,
  appearanceState,
  selectedTheme,
}: PreviewProps) {
  const theme = THEMES.find((t) => t.id === selectedTheme);
  const background = theme?.gradient || appearanceState.background;

  return (
    <div className="w-full lg:w-1/2 flex justify-center">
      <div className="phone-mockup">
        <div className="phone-frame">
          <div className="phone-screen" style={{ background }}>
            <div className="p-6 h-full flex flex-col">
              {/* Profile Section */}
              <div className="text-center mb-8 mt-4">
                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
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
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: appearanceState.textColor }}
                >
                  @{username}
                </h2>
                <p
                  className="text-sm opacity-80"
                  style={{ color: appearanceState.textColor }}
                >
                  Bio description goes here
                </p>
              </div>

              {/* Links Section */}
              <div className="space-y-4 flex-1">
                {MOCK_LINKS.map((link) => (
                  <div
                    key={link}
                    className={`w-full py-3 px-4 ${appearanceState.buttonStyle} text-center`}
                    style={{
                      backgroundColor: appearanceState.buttonColor,
                      color: appearanceState.textColor,
                    }}
                  >
                    {link}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p
                  className="text-xs opacity-70"
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
        }
        .phone-frame {
          width: 320px;
          height: 650px;
          background: #000;
          border-radius: 40px;
          padding: 14px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 4px #333,
            inset 0 0 0 8px #666;
          position: relative;
          transform: rotateX(5deg) rotateY(-5deg);
          transition: transform 0.3s ease;
        }
        .phone-frame:hover {
          transform: rotateX(0deg) rotateY(0deg);
        }
        .phone-screen {
          height: 100%;
          border-radius: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 1024px) {
          .phone-frame {
            width: 300px;
            height: 600px;
          }
        }
      `}</style>
    </div>
  );
}
