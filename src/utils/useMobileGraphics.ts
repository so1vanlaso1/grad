import { useMediaQuery } from "react-responsive";

/** Match phones in both portrait and landscape orientations. */
export default function useMobileGraphics() {
  const narrow = useMediaQuery({ maxWidth: 767 });
  const touch = useMediaQuery({ query: "(pointer: coarse)" });
  return narrow || touch;
}
