import type { Props } from "../../types/type";

export default function createTextAreaBox({
  id,
  labelText,
  required = false,
  textCaption = "",
  cols = 30,
  rows = 5,
}: Props) {
  const textAreaBox = createElement("div", {
    className: required ? "form-item form-item--required" : "form-item",
  });
  const textAreaLabel = createElement("label", {
    htmlFor: id,
    className: "text-caption",
    textContent: labelText,
  });
  const textArea = createElement("textarea", {
    name: id,
    id,
    cols,
    rows,
  });

  const fragment = createElementsFragment([textAreaLabel, textArea]);

  if (textCaption) {
    const textCaptionEl = createElement("span", {
      className: ["help-text", "text-caption"],
      textContent: textCaption,
    });

    fragment.appendChild(textCaptionEl);
  }

  textAreaBox.appendChild(fragment);
  return textAreaBox;
}
