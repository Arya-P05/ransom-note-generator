"use client";

import { useState, ReactNode } from "react";
import html2canvas from "html2canvas";

type Letter = {
  char: string;
  imageIdx: number;
  rotation: number;
  offsetY: number;
  overlap: number;
};

export default function Home() {
  const [text, setText] = useState("");
  const [letters, setLetters] = useState<Letter[]>([]);

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

  const handleChange = (newText: string) => {
    const filteredText: string = newText.replace(/[^A-Za-z0-9 ]/g, "");

    const newLetters: Letter[] = [];

    for (let idx = 0; idx < filteredText.length; idx++) {
      const currLetter: string = filteredText[idx].toUpperCase();

      if (idx < letters.length && letters[idx].char === currLetter) {
        newLetters.push(letters[idx]);
      } else {
        if (!/^[A-Z0-9 ]$/.test(currLetter)) {
          continue;
        } else if (currLetter === " ") {
          newLetters.push({ char: " ", imageIdx: 0 });
        } else {
          const maxVariations: number = VARIATION_COUNTS[currLetter];
          let currVariation: number =
            Math.floor(Math.random() * maxVariations) + 1;

          newLetters.push({ char: currLetter, imageIdx: currVariation });
        }
      }
    }

    setText(filteredText);
    setLetters(newLetters);
  };

  const handleRemix = () => {
    const newLetters: Letter[] = [];

    for (let idx = 0; idx < text.length; idx++) {
      const currLetter: string = text[idx].toUpperCase();

      if (!/^[A-Z0-9 ]$/.test(currLetter)) {
        continue;
      } else if (currLetter === " ") {
        newLetters.push({ char: " ", imageIdx: 0 });
      } else {
        const max = VARIATION_COUNTS[currLetter] ?? 1;
        const variation = Math.floor(Math.random() * max) + 1;

        newLetters.push({ char: currLetter, imageIdx: variation });
      }
    }

    setLetters(newLetters);
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
        onChange={(e) => handleChange(e.target.value)}
        className="p-3 border border-gray-600 rounded w-full max-w-md text-xl bg-zinc-900 text-white placeholder-gray-400"
      />

      <div className="mt-4 flex gap-4 flex-wrap">
        <button
          onClick={handleRemix}
          className="bg-white text-black px-4 py-2 rounded hover:opacity-80"
        >
          <span role="img" aria-label="dice">
            🎲
          </span>{" "}
          Remix Design
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
            maxWidth: "90vw",
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
            {(() => {
              const wordElements = [];
              let currentWord: ReactNode[] = [];

              letters.forEach(({ char, imageIdx }, index) => {
                if (char === " ") {
                  // Push current word before the space
                  if (currentWord.length > 0) {
                    wordElements.push(
                      <div
                        key={`word-${index}`}
                        className="flex flex-wrap items-center justify-start"
                        style={{
                          maxWidth: "100%",
                          flexShrink: 1,
                          margin: "0 6px 6px 0", // adds bottom spacing too
                          flexBasis: "auto",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {currentWord}
                      </div>
                    );
                    currentWord = [];
                  }
                } else {
                  const paddedVar = String(imageIdx).padStart(2, "0");
                  const src = `/${char}/${char}_${paddedVar}.png`;

                  const rotation = (Math.random() * 16 - 8).toFixed(2); // -8 to +8 degrees
                  const verticalOffset = Math.floor(Math.random() * 6) - 3; // -3 to +2 px
                  const overlap = Math.floor(Math.random() * 8) + 4; // -4 to -11px margin

                  currentWord.push(
                    <img
                      key={`letter-${index}`}
                      src={src}
                      alt={char}
                      className="h-20 w-auto fade-in"
                      style={{
                        transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
                        marginLeft:
                          currentWord.length === 0 ? 0 : `-${overlap}px`,
                      }}
                    />
                  );
                }
              });

              // Push the final word (if not followed by space)
              if (currentWord.length > 0) {
                wordElements.push(
                  <div
                    key={`word-final`}
                    className="flex flex-wrap items-center justify-start"
                    style={{
                      maxWidth: "100%",
                      flexShrink: 1,
                      margin: "0 6px 6px 0",
                      flexBasis: "auto",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {currentWord}
                  </div>
                );
              }

              return wordElements;
            })()}
          </div>
        </div>
      </div>
    </main>
  );
}
