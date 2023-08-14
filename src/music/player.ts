import * as Tone from "tone";
import { NOTES } from "./notes";

const MAX_COUNT = 32;

export const makePlayer = () => {
  const state = {
    count: 0,
    synth: new Tone.PolySynth().toDestination(),
  };
  const reset = () => {
    state.count = 0;
    state.synth.dispose();
    state.synth = new Tone.PolySynth().toDestination();
  };
  return {
    play: (bar: boolean[]) => {
      if (state.count >= MAX_COUNT) {
        reset();
      }
      const time = Tone.now();
      bar.forEach((note, i) => {
        if (note) {
          state.synth.triggerAttackRelease(NOTES[i], "32n", time);
        }
      });
      state.count++;
    },
    stop: reset,
  };
};

export type Player = ReturnType<typeof makePlayer>;
