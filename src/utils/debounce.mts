export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let last_invoke: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (last_invoke) clearTimeout(last_invoke);
    last_invoke = setTimeout(() => fn(...args), ms);
  }

}