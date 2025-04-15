"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [text, setText] = useState("");
  const [generated, setGenerated] = useState<JSX.Element[][]>([]);

  const handleGenerate = () => {
    const words = text.toUpperCase().split(" ");

    const wordComponents = words.map((word, wordIndex) => {
      const letters = word.split("").map((char, i) => {
        const isValidChar = /^[A-Z0-9]$/.test(char);
        if (!isValidChar) return null;

        const variation = String(Math.floor(Math.random() * 5) + 1).padStart(
          2,
          "0"
        );
        const src = `/${char}/${char}_${variation}.png`;

        const rotation = (Math.random() * 10 - 5).toFixed(2); // -5 to +5 deg
        const verticalOffset = Math.floor(Math.random() * 6) - 3; // -3 to +2 px

        return (
          <img
            key={`${wordIndex}-${i}`}
            src={src}
            alt={char}
            className="h-20 w-auto"
            style={{
              transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
              marginLeft: i === 0 ? 0 : -8, // overlap more if not first letter
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

    const canvas = await html2canvas(element, { backgroundColor: null });
    const link = document.createElement("a");
    link.download = "ransom-note.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Ransom Note Generator</h1>

      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-3 border rounded w-full max-w-md text-xl"
      />

      <div className="mt-4 flex gap-4 flex-wrap">
        <button
          onClick={handleGenerate}
          className="bg-black text-white px-4 py-2 rounded hover:opacity-80"
        >
          Generate
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-80"
        >
          Download PNG
        </button>
      </div>

      <div
        id="ransom-output"
        className="flex flex-col flex-wrap mt-10 p-4 bg-white rounded shadow max-w-4xl"
      >
        {generated.map((word, wi) => (
          <div key={wi} className="flex flex-row flex-nowrap mb-2">
            {word}
          </div>
        ))}
      </div>
    </main>
  );
}
