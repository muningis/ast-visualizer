import { atom } from "./utils/atom.mts";
import { Program } from "acorn";

export const translateAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
export const programAtom = atom<Program | null>(null);