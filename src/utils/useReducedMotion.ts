import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const read = () => window.matchMedia(query).matches;
const subscribe = (update: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
};

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, () => false);
}
