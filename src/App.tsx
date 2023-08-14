import React, { useRef, useEffect, useState } from "react";
import { makePlayer, Player } from "./music/player";
import { NOTES } from "./music/notes";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseIcon from "@mui/icons-material/Pause";

const BAR_COUNT = 12;

export default function App() {
  const [bar, setBar] = useState<number>(0);
  const [notes, setNotes] = useState<boolean[][]>(
    Array.from({ length: BAR_COUNT }, () =>
      Array.from({ length: NOTES.length }, () => false)
    )
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const player = useRef<Player | null>(null);

  useEffect(() => {
    player.current = makePlayer();

    const interval = setInterval(() => {
      if (!isPlaying) return;
      player.current?.play(notes[bar]);
      setBar((prev) => (prev + 1) % BAR_COUNT);
    }, 175);

    return () => {
      clearInterval(interval);
      player.current = null;
    };
  }, [isPlaying, bar, notes]);

  const handleClick = () => {
    if (isPlaying) player.current?.stop();
    setIsPlaying((prev) => !prev);
  };

  const toggle = (b: number, p: number) => {
    setNotes((prevBar) =>
      prevBar.map((bar, index) => {
        if (index !== b) {
          return bar;
        }
        return bar.map((pitch, index) => {
          if (index !== p) {
            return pitch;
          }
          return !pitch;
        });
      })
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900">
      <div className={`grid grid-cols-12 gap-2`}>
        {notes.flat().map((_, index) => {
          const i = index % BAR_COUNT;
          const j = Math.floor(index / BAR_COUNT);
          const isToggled = notes[i][j];
          const barIsPlaying =
            bar === (i + BAR_COUNT + 1) % BAR_COUNT && isToggled;
          return (
            <button
              className={`w-8 h-8 rounded-full text-white text-2xl font-bold transition-all duration-300
                ${isToggled ? "bg-gray-300" : "bg-gray-700"}
                ${barIsPlaying ? "ring-2 ring-gray-300 ring-opacity-50" : ""}`}
              key={index}
              onClick={() => toggle(i, j)}
            />
          );
        })}
      </div>
      <div>
        <button
          className="py-2 px-4 rounded bg-gray-300 text-gray-900 hover:bg-gray-200 transition-transform transform active:scale-95 duration-300 flex items-center justify-center space-x-2"
          onClick={handleClick}
        >
          {isPlaying ? (
            <>
              <PauseIcon className="w-5 h-5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <PlayCircleFilledIcon className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
