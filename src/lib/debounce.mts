import { onCleanup } from "solid-js";

export function createDebounce<T>(signalSetter: (_value: T) => void, delay: number) {
  let timerHandle: ReturnType<typeof setTimeout>;
  function debouncedSignalSetter(value: T) {
    clearTimeout(timerHandle);
    timerHandle = setTimeout(() => signalSetter(value), delay);
  }
  onCleanup(() => clearTimeout(timerHandle));
  return debouncedSignalSetter;
}