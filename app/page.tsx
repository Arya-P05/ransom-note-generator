"use client";

import { useState, ReactNode } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [text, setText] = useState("");
  const [generated, setGenerated] = useState<ReactNode[][]>([]);

  const handleGenerate = () => {
    const words = text.toUpperCase().split(" ");

    const wordComponents = words.map((word, wordIndex) => {
      let prevVariationByChar: { [char: string]: number } = {};

      const letters = word.split("").map((char, i) => {
        const isValidChar = /^[A-Z0-9]$/.test(char);
        if (!isValidChar) return null;

        let variation: number;
        const maxVariations = 5;
        const prevChar = i > 0 ? word[i - 1] : null;
        const prevVariation =
          prevChar === char ? prevVariationByChar[char] : null;

        do {
          variation = Math.floor(Math.random() * maxVariations) + 1;
        } while (variation === prevVariation);

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

      {/* Website-only container box for style */}
      <div className="mt-10 p-6 rounded-xl bg-zinc-800/50 border border-white/10 shadow-lg">
        <div
          id="ransom-output"
          className="flex flex-col items-center justify-center"
          style={{
            backgroundColor: "transparent",
          }}
        >
          {generated.map((word, wi) => (
            <div
              key={wi}
              className="flex flex-row flex-nowrap mb-2 justify-center p-1"
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
