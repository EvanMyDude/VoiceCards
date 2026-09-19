import { useEffect, useState } from "react";
import { BUILT_IN_CARDS } from "./cards.js";

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

export default function FlashcardApp() {

  const [queue, setQueue] = useState(BUILT_IN_CARDS.map((_, i) => i));
  const [cursor, setCursor] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);
  const [sessionId] = useState(() => Date.now());
  const [toast, setToast] = useState(null);
  const [typeMode, setTypeMode] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [reinsertedCardId, setReinsertedCardId] = useState(null);

  const currentCard = BUILT_IN_CARDS[queue[cursor] ?? 0];
  const upcomingCards = queue.slice(cursor + 1, cursor + 6).map(index => BUILT_IN_CARDS[index]);

  function shuffle() {
    const arr = [...queue];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setQueue(arr);
    setCursor(0);
    setFlipped(false);
    setReinsertedCardId(null);
  }

  function resetSession() {
    setQueue(BUILT_IN_CARDS.map((_, i) => i));
    setCursor(0);
    setFlipped(false);
    setCorrectCount(0);
    setAgainCount(0);
    setToast(null);
    setTypedAnswer("");
    setChecked(false);
    setReinsertedCardId(null);
  }

  function showToast(kind, message) {
    setToast({kind, message});
    setTimeout(() => setToast(null), 1200);
  }

  function mark(correct) {
    if (!currentCard) return;
    const deckIndex = queue[cursor];
    const arr = [...queue];
    arr.splice(cursor, 1);
    if (correct) {
      arr.push(deckIndex);
      setCorrectCount(c => c + 1);
      showToast("correct", "Marked Correct");
    } else {
      const pos = Math.min(cursor + 3, arr.length);
      arr.splice(pos, 0, deckIndex);
      setAgainCount(c => c + 1);
      showToast("again", `Will repeat in ${pos - cursor} cards`);
    }
    const nextCursor = Math.min(cursor, Math.max(0, arr.length - 1));
    setReinsertedCardId(previousId => {
      const id = correct ? previousId : currentCard.id;
      return BUILT_IN_CARDS[arr[nextCursor]]?.id === id ? null : id;
    });
    setQueue(arr);
    setCursor(nextCursor);
    setFlipped(false);
    setTypedAnswer("");
    setChecked(false);
  }

  // Keys
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") { e.preventDefault(); setFlipped(f => !f); }
      else if (e.key === "ArrowRight") mark(true);
      else if (e.key === "ArrowLeft") mark(false);
      else if (e.key.toLowerCase() === "s") shuffle();
      else if (e.key.toLowerCase() === "r") resetSession();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, queue]);

  const progress = { total: BUILT_IN_CARDS.length, seen: cursor + 1 };

  function checkTyped() {
    setChecked(true);
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Voice & Wellbeing — 100 Flashcards</h1>
        <p className="text-sm text-gray-600 mt-1">Space = Flip • → Correct • ← Again • S Shuffle • R Reset</p>

        <div className="mt-4 rounded-3xl bg-white border shadow p-6 md:p-8 relative">
          {!currentCard ? (
            <div className="text-center py-12 text-gray-500">Cards will appear here.</div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {progress.seen}/{progress.total} • ✅ {correctCount} • ↩︎ {againCount}</span>
                <span className="text-xs">Session {new Date(sessionId).toLocaleString()}</span>
              </div>

              {!typeMode ? (
                <button
                  onClick={() => setFlipped(f => !f)}
                  className="w-full min-h-[180px] rounded-2xl border bg-gradient-to-b from-gray-50 to-white px-6 py-8 text-left shadow hover:shadow-md focus:outline-none"
                  title="Space to flip"
                >
                  <div className="text-sm text-indigo-600 font-semibold tracking-wide mb-2">{flipped ? "Answer" : "Question"}</div>
                  <div className="text-xl leading-relaxed">{flipped ? currentCard.back : currentCard.front}</div>
                </button>
              ) : (
                <div className="w-full min-h-[180px] rounded-2xl border bg-gradient-to-b from-gray-50 to-white px-6 py-6 text-left shadow">
                  <div className="text-sm text-indigo-600 font-semibold tracking-wide mb-2">Question</div>
                  <div className="text-lg mb-4">{currentCard.front}</div>
                  {!checked ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="min-w-0 flex-1 border rounded-lg px-2 py-1"
                        placeholder="Type your answer"
                        value={typedAnswer}
                        onChange={(e)=>setTypedAnswer(e.target.value)}
                        onKeyDown={(e)=>{ if(e.key==="Enter") checkTyped(); }}
                        autoFocus
                      />
                      <button onClick={checkTyped} className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-sm">Check</button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-green-700">Answer:</div>
                      <div className="text-lg mb-2">{currentCard.back}</div>
                      <div className="flex gap-2">
                        <button onClick={() => mark(false)} className="px-4 py-2 rounded-xl border bg-white shadow hover:shadow-md text-sm">Again (←)</button>
                        <button onClick={() => mark(true)} className="px-4 py-2 rounded-xl border bg-white shadow hover:shadow-md text-sm">Correct (→)</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!typeMode && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => mark(false)} className="px-4 py-2 rounded-xl border bg-white shadow hover:shadow-md text-sm">Again (←)</button>
                  <button onClick={() => setFlipped(f => !f)} className="px-4 py-2 rounded-xl border bg-white shadow hover:shadow-md text-sm">Flip (Space)</button>
                  <button onClick={() => mark(true)} className="px-4 py-2 rounded-xl border bg-white shadow hover:shadow-md text-sm">Correct (→)</button>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button onClick={shuffle} className="px-3 py-2 rounded-xl bg-white shadow hover:shadow-md border text-sm">Shuffle</button>
                <button onClick={resetSession} className="px-3 py-2 rounded-xl bg-white shadow hover:shadow-md border text-sm">Reset</button>
                <button onClick={()=>{setTypeMode(m=>!m); resetSession();}} className="px-3 py-2 rounded-xl bg-white shadow hover:shadow-md border text-sm">{typeMode ? "Exit Type Mode" : "Type Mode"}</button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
                <span>Up next</span>
                <ol aria-label="Upcoming cards" className="flex flex-wrap gap-2">
                  {upcomingCards.map(card => (
                    <li
                      key={card.id}
                      aria-label={`Card ${card.id}${card.id === reinsertedCardId ? ", reinserted Again card" : ""}`}
                      className={classNames(
                        "rounded-lg border px-2 py-1 font-medium",
                        card.id === reinsertedCardId
                          ? "border-orange-400 bg-orange-100 text-orange-800"
                          : "border-gray-200 bg-gray-50 text-gray-600",
                      )}
                    >
                      #{card.id}
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-3 text-xs text-gray-500 text-center">Cue: Jaw loose • Ribs expand • Tongue leads • Tone rides the breath.</p>
            </div>
          )}
          {toast && (
            <div className={classNames("absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm shadow", toast.kind==="correct"?"bg-green-500 text-white":"bg-orange-500 text-white")}>{toast.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
