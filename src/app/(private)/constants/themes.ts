export const THEMES = [
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    background: "#1a1a2e",
    buttonColor: "#8a2be2",
    textColor: "#e6e6fa",
    buttonStyle: "rounded-full",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    background: "#ff6b6b",
    buttonColor: "#ff9e6b",
    textColor: "#2d3436",
    buttonStyle: "rounded-full",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ff9e6b 100%)",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    background: "#0077b6",
    buttonColor: "#00b4d8",
    textColor: "#ffffff",
    buttonStyle: "rounded-lg",
    gradient: "linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    background: "#2d6a4f",
    buttonColor: "#40916c",
    textColor: "#f1faee",
    buttonStyle: "rounded-lg",
    gradient: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)",
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    background: "#d8bfd8",
    buttonColor: "#9370db",
    textColor: "#4b0082",
    buttonStyle: "rounded-full",
    gradient: "linear-gradient(135deg, #d8bfd8 0%, #9370db 100%)",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    background: "#0f0f1a",
    buttonColor: "#00ff9d",
    textColor: "#ffffff",
    buttonStyle: "rounded-lg",
    gradient: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    background: "#ffcbf2",
    buttonColor: "#c0fdff",
    textColor: "#5e60ce",
    buttonStyle: "rounded-full",
    gradient: "linear-gradient(135deg, #ffcbf2 0%, #c0fdff 100%)",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    background: "#ffd166",
    buttonColor: "#ef476f",
    textColor: "#073b4c",
    buttonStyle: "rounded-lg",
    gradient: "linear-gradient(135deg, #ffd166 0%, #ef476f 100%)",
  },
  {
    id: "deep-space",
    name: "Deep Space",
    background: "#0b0b1d",
    buttonColor: "#7b2cbf",
    textColor: "#e0aaff",
    buttonStyle: "rounded-full",
    gradient: "linear-gradient(135deg, #0b0b1d 0%, #3c096c 100%)",
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    background: "#ff8fa3",
    buttonColor: "#ff4d6d",
    textColor: "#2d1e2f",
    buttonStyle: "rounded-lg",
    gradient: "linear-gradient(135deg, #ff8fa3 0%, #ff4d6d 100%)",
  },
  {
    id: "mint-chocolate",
    name: "Mint Chocolate",
    background: "#ccd5ae",
    buttonColor: "#d4a373",
    textColor: "#2b2d42",
    buttonStyle: "rounded-full",
    gradient: "linear-gradient(135deg, #ccd5ae 0%, #d4a373 100%)",
  },
  {
    id: "neon-dream",
    name: "Neon Dream",
    background: "#03071e",
    buttonColor: "#ff0a54",
    textColor: "#f9c74f",
    buttonStyle: "rounded-lg",
    gradient: "linear-gradient(135deg, #03071e 0%, #370617 100%)",
  },
];

export type Theme = (typeof THEMES)[number];
export type ButtonStyle = "rounded-lg" | "rounded-full";

export type AppearanceState = {
  background: string;
  buttonStyle: ButtonStyle;
  buttonColor: string;
  textColor: string;
};
