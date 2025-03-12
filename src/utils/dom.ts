import type { HTMLTagName, Props } from "../types/type.ts";

export function createElement(
  tag: HTMLTagName,
  props: Props = {}
): HTMLElement {
  const element = document.createElement(tag) as HTMLElement;

  for (const [key, value] of Object.entries(props)) {
    if (key === "className") {
      Array.isArray(value)
        ? element.classList.add(...value)
        : element.classList.add(value);

      continue;
    }

    if (key === "dataset") {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue as string;
      }
      continue;
    }

    (element as any)[key] = value;
  }

  return element;
}

export function createElementsFragment(
  elements: HTMLElement[]
): DocumentFragment {
  const fragment = document.createDocumentFragment();
  fragment.append(...elements);
  return fragment;
}

function elementCashController() {
  const cash = new Map();

  function getElement(selector: string): HTMLElement {
    if (!cash.has(selector)) {
      cash.set(selector, document.querySelector(selector));
    }

    return cash.get(selector);
  }

  return { getElement };
}

export const { getElement } = elementCashController();
