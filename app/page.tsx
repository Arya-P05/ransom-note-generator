"use client";

import { useState, ReactNode } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [text, setText] = useState("");
  const [generated, setGenerated] = useState<ReactNode[][]>([]);

  const VARIATION_COUNTS: { [key: string]: number } = {
    "0": 18,
    "1": 18,
    "2": 14,
    "3": 21,
    "4": 31,
    "5": 15,
    "6": 17,
    "7": 18,
    "8": 16,
    "9": 13,
    A: 57,
    B: 28,
    C: 30,
    D: 27,
    E: 33,
    F: 27,
    G: 32,
    H: 24,
    I: 25,
    J: 23,
    K: 23,
    L: 24,
    M: 30,
    N: 34,
    O: 28,
    P: 23,
    Q: 21,
    R: 35,
    S: 52,
    T: 27,
    U: 24,
    V: 22,
    W: 24,
    X: 20,
    Y: 26,
    Z: 23,
  };

  const handleGenerate = () => {
    const words = text.toUpperCase().split(" ");

    const wordComponents = words.map((word, wordIndex) => {
      let prevVariationByChar: { [char: string]: number } = {};

      const letters = word.split("").map((char, i) => {
        const isValidChar = /^[A-Z0-9]$/.test(char);
        if (!isValidChar) return null;

        const maxVariations = VARIATION_COUNTS[char] ?? 1;
        let variation: number;

        const prevChar = i > 0 ? word[i - 1] : null;
        const prevVariation =
          prevChar === char ? prevVariationByChar[char] : null;

        do {
          variation = Math.floor(Math.random() * maxVariations) + 1;
        } while (variation === prevVariation && maxVariations > 1);

        prevVariationByChar[char] = variation;

        const paddedVar = String(variation).padStart(2, "0");
        const src = `/${char}/${char}_${paddedVar}.png`;

        const rotation = (Math.random() * 10 - 5).toFixed(2);
        const verticalOffset = Math.floor(Math.random() * 6) - 3;

        return (
          <img
            key={`${wordIndex}-${i}`}
            src={src}
            alt={char}
            className="h-20 w-auto"
            style={{
              transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
              marginLeft: i === 0 ? 0 : -8,
            }}
          />
        );
      });

      return letters.filter(Boolean);
    });

    setGenerated(wordComponents);
  };

  const handleDownload = async () => {
    const element = document.getElementById("ransom-output");
    if (!element) return;

    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = "transparent";

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 3,
    });

    element.style.backgroundColor = originalBg;

    const link = document.createElement("a");
    link.download = "ransom-note.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="relative z-20 flex flex-col items-center justify-center min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Ransom Note Generator</h1>

      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-3 border border-gray-600 rounded w-full max-w-md text-xl bg-zinc-900 text-white placeholder-gray-400"
      />

      <div className="mt-4 flex gap-4 flex-wrap">
        <button
          onClick={handleGenerate}
          className="bg-white text-black px-4 py-2 rounded hover:opacity-80"
        >
          Generate
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-black px-4 py-2 rounded hover:opacity-80"
        >
          Download PNG
        </button>
      </div>

      {/* Visual box */}
      <div className="mt-10 flex justify-center">
        <div
          className="relative bg-zinc-800/50 border border-white/10 shadow-lg p-6 rounded-xl flex flex-wrap justify-center items-start"
          style={{
            minWidth: "300px",
            minHeight: "100px",
            maxWidth: "90vw", // grow only up to screen width
            maxHeight: "80vh",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {/* Tightly-cropped export-only element */}
          <div
            id="ransom-output"
            className="flex flex-wrap justify-center gap-2"
            style={{
              backgroundColor: "transparent",
              display: "inline-flex",
              maxWidth: "100%",
            }}
          >
            {generated.map((word, wi) => (
              <div
                key={wi}
                className="flex flex-wrap justify-center break-words p-2"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  paddingTop: 2,
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
