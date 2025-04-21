"use client";

import { useState, ReactNode } from "react";
import html2canvas from "html2canvas";
import { Download, Dices } from "lucide-react";

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
  const [isDownloading, setIsDownloading] = useState(false);

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
    B: 29,
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
    U: 28,
    V: 22,
    W: 24,
    X: 22,
    Y: 30,
    Z: 27,
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
    setLetters(
      letters.map(({ char }) => {
        if (char === " ")
          return { char, imageIdx: 0, rotation: 0, offsetY: 0, overlap: 0 };
        const max = VARIATION_COUNTS[char];
        return {
          char,
          imageIdx: Math.floor(Math.random() * max) + 1,
          rotation: Math.random() * 16 - 8,
          offsetY: Math.floor(Math.random() * 4) - 2,
          overlap: Math.floor(Math.random() * 8) + 4,
        };
      })
    );
  };

  const handleDownload = async () => {
    const element = document.getElementById("ransom-download");
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3,
      });
      const link = document.createElement("a");
      link.download = "ransom-note.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const renderLetters = (tight: boolean) => {
    const wordElements: ReactNode[] = [];
    let currentWord: ReactNode[] = [];

    letters.forEach(({ char, imageIdx, rotation, offsetY, overlap }, idx) => {
      if (char === " ") {
        if (currentWord.length) {
          wordElements.push(
            <div key={idx} className="flex flex-nowrap items-start">
              {currentWord}
            </div>
          );
          currentWord = [];
        }
      } else {
        const padded = String(imageIdx).padStart(2, "0");
        const src = `/compressed/${char}/${char}_${padded}.png`;
        currentWord.push(
          <img
            key={idx}
            src={src}
            alt={char}
            className="h-20 w-auto drop-shadow-lg transition-transform duration-300 hover:scale-105 animate-ransom-in"
            style={{
              transform: `rotate(${rotation}deg)`,
              marginTop: tight ? 0 : `${offsetY}px`,
              marginLeft: currentWord.length === 0 ? 0 : `-${overlap}px`,
            }}
          />
        );
      }
    });

    // final word
    if (currentWord.length) {
      wordElements.push(
        <div key="final" className="flex flex-nowrap items-start">
          {currentWord}
        </div>
      );
    }

    return wordElements;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-white">
      <div className="w-[90%] max-w-[1000px] backdrop-blur-sm bg-zinc-800/60 rounded-2xl p-8 shadow-2xl space-y-6">
        <h1 className="text-4xl font-extrabold text-center tracking-tight">
          Ransom Note Generator
        </h1>

        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-zinc-700/40 border border-zinc-600 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition"
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={handleRemix}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-400 text-black font-semibold shadow-md hover:scale-105 transition"
          >
            <Dices className="w-5 h-5" />
            <span>Remix</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition"
          >
            {isDownloading ? (
              <span>Downloading...</span>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 overflow-auto bg-zinc-800/50 rounded-xl border border-zinc-700 w-full h-[400px]">
          <div
            id="ransom-output"
            className="flex flex-wrap justify-center items-start gap-x-6 gap-y-8 pt-6 pb-4"
          >
            {renderLetters(false)}
          </div>
        </div>
      </div>

      <div id="ransom-download" className="absolute -top-full -left-full">
        <div
          style={{
            width: "1100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="flex flex-wrap justify-center items-start gap-x-6 gap-y-8 pt-6 pb-4">
            {renderLetters(true)}
          </div>
        </div>
      </div>
    </main>
  );
}
