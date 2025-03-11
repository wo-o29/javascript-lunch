import type { Props } from "../../types/type";

function createFilter({ id, onchange, dropdownList }: Props) {
  const select = createElement("select", {
    name: id,
    id,
    onchange,
    className: "restaurant-filter",
  });
  const optionElements = dropdownList.map(
    ({ value, text }: Record<string, string>) =>
      createElement("option", {
        value,
        textContent: text,
      })
  );
  select.append(...optionElements);
  return select;
}

export default createFilter;
