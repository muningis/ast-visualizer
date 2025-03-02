import { useSyncExternalStore } from "react";

interface Atom<T> {
  "~subscribe": (_callback: () => void) => () => void;
  "~get": () => T;
  "~set": (_value: T | ((_prev: T) => T)) => void;
  "~reset": () => void;
}

const createAtom = <T,>(initialValue: T): Atom<T> => {
  let value = initialValue;
  const listeners = new Set<() => void>();
  const get = () => value;
  const set = (newValue: T | ((_prev: T) => T)) => {
    value =
      typeof newValue === "function"
        ? (newValue as (_prev: T) => T)(value)
        : newValue;
    listeners.forEach((listener) => listener());
  };
  return {
    "~subscribe": (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    "~get": get,
    "~set": set,
    "~reset": () => {
      value = initialValue;
      listeners.forEach((listener) => listener());
    },
  };
};

const useAtom = <T,>(atom: Atom<T>) => {
  const state = useSyncExternalStore(atom["~subscribe"], atom["~get"]);
  return [state, atom["~set"]] as const;
};

const useAtomValue = <T,>(atom: Atom<T>) => {
  return useSyncExternalStore(atom["~subscribe"], atom["~get"]);
};

const useSetAtom = <T,>(atom: Atom<T>) => {
  return atom["~set"];
};

const useResetAtom = <T,>(atom: Atom<T>) => {
  return atom["~reset"];
};

export { createAtom, useAtom, useAtomValue, useSetAtom, useResetAtom };
