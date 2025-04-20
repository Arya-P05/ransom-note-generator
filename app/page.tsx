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
    T: 26,
    U: 24,
    V: 22,
    W: 24,
    X: 20,
    Y: 26,
    Z: 23,
  };

  const handleChange = (newText: string) => {
    const filteredText = newText.replace(/[^A-Za-z0-9 ]/g, "");
    const newLetters: Letter[] = [];

    for (let idx = 0; idx < filteredText.length; idx++) {
      const currLetter = filteredText[idx].toUpperCase();

      if (idx < letters.length && letters[idx].char === currLetter) {
        newLetters.push(letters[idx]);
      } else {
        if (!/^[A-Z0-9 ]$/.test(currLetter)) continue;

        if (currLetter === " ") {
          newLetters.push({
            char: " ",
            imageIdx: 0,
            rotation: 0,
            offsetY: 0,
            overlap: 0,
          });
        } else {
          const max = VARIATION_COUNTS[currLetter];
          newLetters.push({
            char: currLetter,
            imageIdx: Math.floor(Math.random() * max) + 1,
            rotation: Math.random() * 16 - 8,
            offsetY: Math.floor(Math.random() * 4) - 2,
            overlap: Math.floor(Math.random() * 8) + 4,
          });
        }
      }
    }

    setText(filteredText);
    setLetters(newLetters);
  };

  const handleRemix = () => {
    const newLetters: Letter[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();

      if (!/^[A-Z0-9 ]$/.test(char)) continue;

      if (char === " ") {
        newLetters.push({
          char: " ",
          imageIdx: 0,
          rotation: 0,
          offsetY: 0,
          overlap: 0,
        });
      } else {
        const max = VARIATION_COUNTS[char];
        newLetters.push({
          char,
          imageIdx: Math.floor(Math.random() * max) + 1,
          rotation: Math.random() * 16 - 8,
          offsetY: Math.floor(Math.random() * 4) - 2,
          overlap: Math.floor(Math.random() * 8) + 4,
        });
      }
    }

    setLetters(newLetters);
  };

  const handleDownload = async () => {
    const element = document.getElementById("ransom-download");
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 3,
    });

    const link = document.createElement("a");
    link.download = "ransom-note.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const renderLetters = (tight: boolean) => {
    const wordElements = [];
    let currentWord: ReactNode[] = [];

    letters.forEach(({ char, imageIdx, rotation, offsetY, overlap }, index) => {
      if (char === " ") {
        if (currentWord.length > 0) {
          wordElements.push(
            <div
              key={`word-${index}`}
              className="flex flex-nowrap items-start justify-start"
              style={{
                marginRight: "24px", // distinct gap between words
                marginBottom: "12px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
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

        currentWord.push(
          <img
            key={`letter-${index}`}
            src={src}
            alt={char}
            className="h-20 w-auto"
            style={{
              transform: `rotate(${rotation}deg)`,
              marginTop: tight ? "0px" : `${offsetY}px`,
              marginLeft: currentWord.length === 0 ? 0 : `-${overlap}px`,
              verticalAlign: "top",
            }}
          />
        );
      }
    });

    if (currentWord.length > 0) {
      wordElements.push(
        <div
          key={`word-final`}
          className="flex flex-nowrap items-start justify-start"
          style={{
            margin: tight ? "0 6px 6px 0" : "0 12px 12px 0",
            maxWidth: "100%",
          }}
        >
          {currentWord}
        </div>
      );
    }

    return wordElements;
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
          🎲 Remix Design
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-black px-4 py-2 rounded hover:opacity-80"
        >
          Download PNG
        </button>
      </div>

      <div className="mt-10 flex justify-center">
        <div
          className="relative bg-zinc-800/50 border border-white/10 shadow-lg p-6 rounded-xl flex justify-center items-center"
          style={{
            width: "1200px",
            height: "600px",
            maxWidth: "90vw",
            maxHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <div
            id="ransom-output"
            className="flex flex-wrap justify-center items-start gap-y-6 gap-x-4"
            style={{
              backgroundColor: "transparent",
              maxWidth: "100%",
              alignItems: "flex-start",
            }}
          >
            {renderLetters(false)}
          </div>
        </div>
      </div>

      {/* Hidden version for PNG export */}
      <div
        id="ransom-download"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
      >
        <div
          style={{
            width: "1000px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <div
            className="flex flex-wrap justify-center items-center"
            style={{
              rowGap: "20px",
              columnGap: "10px",
            }}
          >
            {renderLetters(true)}
          </div>
        </div>
      </div>
    </main>
  );
}
