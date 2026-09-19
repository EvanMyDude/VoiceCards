import assert from "node:assert/strict";

export function validateDeck(cards) {
  assert.ok(Array.isArray(cards), "Deck must be an array.");
  assert.equal(cards.length, 100, "Deck must contain exactly 100 cards.");

  const ids = new Set();
  const pairs = new Set();

  for (const card of cards) {
    assert.ok(card && typeof card === "object", "Every card must be an object.");
    assert.ok(Number.isInteger(card.id), "Every card ID must be an integer.");
    assert.ok(card.id >= 1 && card.id <= 100, `Card ID ${card.id} must be within 1–100.`);
    assert.ok(!ids.has(card.id), `Duplicate card ID: ${card.id}.`);
    ids.add(card.id);

    for (const field of ["front", "back"]) {
      assert.ok(
        typeof card[field] === "string" && card[field].trim().length > 0,
        `Card ${card.id} must have a nonblank ${field} string.`,
      );
    }

    const pair = JSON.stringify([card.front, card.back]);
    assert.ok(!pairs.has(pair), `Duplicate front/back pair at card ${card.id}.`);
    pairs.add(pair);
  }

  for (let id = 1; id <= 100; id += 1) {
    assert.ok(ids.has(id), `Missing card ID: ${id}.`);
  }

  return cards.length;
}
