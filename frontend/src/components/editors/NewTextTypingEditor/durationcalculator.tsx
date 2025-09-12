import type { Phrase } from "../../../models/TextTyping";
// import { DEFAULT_SETTINGS } from "./assets/configs";

export const calculateDuration = (phrase: Phrase) => {
  const fps = 60;
  const typingSpeed = 15;

  const totalChars = phrase.lines.reduce((sum, line) => sum + line.length, 0);
  const typingFrames = Math.ceil((totalChars / typingSpeed) * fps);
  return (typingFrames + 4 * fps)/60;
};
