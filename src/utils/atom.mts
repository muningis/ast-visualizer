interface Atom<T> {
  read(): T;
  write(newValueOrFn: T | ((oldValue: T) => T)): void;
  subscribe(subscriber: () => void): () => boolean;
}

export function atom<T>(initialValue: T): Atom<T> {
  let value = initialValue;
  const subscribers = new Set<() => void>();
  const read = () => {
    return value;
  };
  const write = (newValueOrFn: T | ((oldValue: T) => T)) => {
    value = newValueOrFn instanceof Function ? newValueOrFn(value) : newValueOrFn;
    subscribers.forEach(subscriber => {
      subscriber()
  });
  }
  const subscribe = (subscriber: () => void) => {
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  }

  return { read, write, subscribe };
}

export function getAtomValue<T>(atom: Atom<T>) {
  return atom.read()
};
export function setAtomValue<T>(atom: Atom<T>, newValueOrFn: T | ((oldValue: T) => T)) {
  atom.write(newValueOrFn)
};

export function subscribe(atoms: Atom<any>[], callback: (...args: any[]) => void) {
  atoms.forEach(atom => {
    atom.subscribe(() => {
      callback(atoms.map(atom => {
        return getAtomValue(atom) as any;
    }));
    });
  });
}