"use client";

import { THEMES } from "@/app/(private)/constants/themes";
import type { ThemeSelectorProps, ThemeCardProps } from "@/app/(private)/types";

export default function ThemeSelector({
  selectedTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Theme
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {THEMES.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme === theme.id}
            onSelect={() => onThemeChange(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <div
      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium truncate">{theme.name}</div>
        {isSelected && <CheckIcon />}
      </div>
      <div className="flex gap-1 h-8 mb-1">
        <div
          className="flex-1 rounded"
          style={{
            background: theme.gradient,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>
      <div className="flex gap-1">
        <ColorSwatch color={theme.buttonColor} />
        <ColorSwatch color={theme.textColor} />
        <div className="flex-1 flex justify-end">
          <span className="text-xs text-gray-500">
            {theme.buttonStyle === "rounded-full" ? "Pill" : "Rounded"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-blue-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
