import assert from "node:assert/strict";
import test from "node:test";
import { BUILT_IN_CARDS } from "../src/cards.js";
import { validateDeck } from "../scripts/deck-integrity.mjs";

const copyDeck = () => BUILT_IN_CARDS.map(card => ({ ...card }));

test("the complete built-in deck passes", () => {
  assert.equal(validateDeck(BUILT_IN_CARDS), 100);
});

test("rejects the cards-1-and-100-only regression", () => {
  assert.throws(() => validateDeck([BUILT_IN_CARDS[0], BUILT_IN_CARDS[99]]), /exactly 100/);
});

test("rejects a missing card", () => {
  assert.throws(() => validateDeck(BUILT_IN_CARDS.slice(1)), /exactly 100/);
});

test("rejects a duplicate ID even when the count is 100", () => {
  const cards = copyDeck();
  cards[50].id = cards[49].id;
  assert.throws(() => validateDeck(cards), /Duplicate card ID/);
});

for (const id of [0, 101, 1.5, "1"]) {
  test(`rejects invalid ID ${JSON.stringify(id)}`, () => {
    const cards = copyDeck();
    cards[0].id = id;
    assert.throws(() => validateDeck(cards), /integer|within 1–100/);
  });
}

test("rejects duplicate card content with distinct IDs", () => {
  const cards = copyDeck();
  cards[50].front = cards[49].front;
  cards[50].back = cards[49].back;
  assert.throws(() => validateDeck(cards), /Duplicate front\/back pair/);
});

for (const field of ["front", "back"]) {
  for (const value of ["", " \n\t ", null, undefined, 123]) {
    test(`rejects ${field} value ${JSON.stringify(value)}`, () => {
      const cards = copyDeck();
      cards[50][field] = value;
      assert.throws(() => validateDeck(cards), new RegExp(`nonblank ${field}`));
    });
  }
}

test("rejects malformed deck and card values", () => {
  assert.throws(() => validateDeck(null), /array/);
  const cards = copyDeck();
  cards[50] = null;
  assert.throws(() => validateDeck(cards), /object/);
});
