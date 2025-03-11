import type { Props } from "../../types/type.ts";

export default function createDropdownBox({
  labelText,
  id,
  dropdownList,
  required = false,
}: Props) {
  const dropdownBox = createElement("div", {
    className: ["form-item", `${required && "form-item--required"}`],
  });
  const dropdownLabel = createElement("label", {
    htmlFor: id,
    className: "text-caption",
    textContent: labelText,
  });
  const select = createElement("select", {
    name: id,
    id,
    required,
  });

  const optionElements = dropdownList.map(
    ({ value, text }: Record<string, string>) =>
      createElement("option", {
        value,
        textContent: text,
      })
  );

  select.append(...optionElements);
  dropdownBox.append(dropdownLabel, select);

  return dropdownBox;
}
