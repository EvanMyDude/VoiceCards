import { BUILT_IN_CARDS } from "../src/cards.js";
import { validateDeck } from "./deck-integrity.mjs";

try {
  const count = validateDeck(BUILT_IN_CARDS);
  console.log(`Deck integrity passed: ${count} unique cards, IDs 1–100, no blank fronts or backs.`);
} catch (error) {
  console.error(`Deck integrity failed: ${error.message}`);
  process.exitCode = 1;
}
