import type { Props } from "../../types/type.ts";

export default function createButton({
  type,
  textContent,
  className,
  onclick,
}: Props) {
  return createElement("button", {
    type,
    onclick,
    className,
    textContent,
  });
}
