(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function createElement(tag, props = {}) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "className") {
      Array.isArray(value) ? element.classList.add(...value) : element.classList.add(value);
      continue;
    }
    element[key] = value;
  }
  return element;
}
function createElementsFragment(elements) {
  const fragment = document.createDocumentFragment();
  fragment.append(...elements);
  return fragment;
}
function createButton({
  type,
  textContent,
  className,
  onclick
}) {
  return createElement("button", {
    type,
    onclick,
    className,
    textContent
  });
}
const defaultOption = { value: "", text: "선택해 주세요" };
function createDropdownBox({
  labelText,
  id,
  dropdownList,
  required
}) {
  const dropdownBox = createElement("div", {
    className: ["form-item", `${"form-item--required"}`]
  });
  const dropdownLabel = createElement("label", {
    htmlFor: id,
    className: "text-caption",
    textContent: labelText
  });
  const select = createElement("select", {
    name: id,
    id,
    required
  });
  const optionList = [defaultOption, ...dropdownList];
  const optionElements = optionList.map(
    ({ value, text }) => createElement("option", {
      value,
      textContent: text
    })
  );
  select.append(...optionElements);
  const fragment = createElementsFragment([dropdownLabel, select]);
  dropdownBox.appendChild(fragment);
  return dropdownBox;
}
function createInputBox({
  labelText,
  type,
  id,
  required = false,
  textCaption = ""
}) {
  const inputBox = createElement("div", {
    className: ["form-item", `${required && "form-item--required"}`]
  });
  const inputLabel = createElement("label", {
    htmlFor: id,
    className: "text-caption",
    textContent: labelText
  });
  const input = createElement("input", {
    type,
    name: id,
    id,
    required
  });
  const fragment = createElementsFragment([inputLabel, input]);
  if (textCaption) {
    const textCaptionEl = createElement("span", {
      className: ["help-text", "text-caption"],
      textContent: textCaption
    });
    fragment.appendChild(textCaptionEl);
  }
  inputBox.appendChild(fragment);
  return inputBox;
}
function createTextAreaBox({
  id,
  labelText,
  required = false,
  textCaption = "",
  cols = 30,
  rows = 5
}) {
  const textAreaBox = createElement("div", {
    className: ["form-item", `${required && "form-item--required"}`]
  });
  const textAreaLabel = createElement("label", {
    htmlFor: "description",
    className: "text-caption",
    textContent: labelText
  });
  const textArea = createElement("textarea", {
    name: id,
    id,
    cols,
    rows
  });
  const fragment = createElementsFragment([textAreaLabel, textArea]);
  if (textCaption) {
    const textCaptionEl = createElement("span", {
      className: ["help-text", "text-caption"],
      textContent: textCaption
    });
    fragment.appendChild(textCaptionEl);
  }
  textAreaBox.appendChild(fragment);
  return textAreaBox;
}
const FOOD_CATEGORY = [
  { value: "한식", text: "한식" },
  { value: "중식", text: "중식" },
  { value: "일식", text: "일식" },
  { value: "아시안", text: "아시안" },
  { value: "양식", text: "양식" },
  { value: "기타", text: "기타" }
];
const RESTAURANT_DISTANCE = [
  { value: "5", text: "5분 내" },
  { value: "10", text: "10분 내" },
  { value: "15", text: "15분 내" },
  { value: "20", text: "20분 내" },
  { value: "30", text: "30분 내" }
];
const RESTAURANT_FIELD_LENGTH = {
  name: { min: 1, max: 12 },
  description: { min: 0, max: 300 },
  link: { min: 0, max: 300 }
};
const ERROR_MESSAGE = {
  INVALID_CATEGORY: "존재하지 않는 카테고리 입니다.",
  INVALID_RESTAURANT_NAME_LENGTH: `음식점 이름은 ${RESTAURANT_FIELD_LENGTH.name.min}글자 이상, ${RESTAURANT_FIELD_LENGTH.name.max}글자 이하만 가능합니다.`,
  INVALID_RESTAURANT_DISTANCE: "음식점 거리가 유효하지 않습니다.",
  INVALID_RESTAURANT_DESCRIPTION_LENGTH: `음식점 설명은 ${RESTAURANT_FIELD_LENGTH.description.max}이하만 가능합니다.`,
  INVALID_RESTAURANT_LINK_LENGTH: `움식점 링크는 ${RESTAURANT_FIELD_LENGTH.link.max}이하만 가능합니다.`
};
function extractByKey(list, key) {
  return list.map((item) => item[key]);
}
function extractFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}
function isInRange(value, min, max) {
  return value >= min && value <= max;
}
function _validateRestaurantCategory(category) {
  const categoryList = extractByKey(FOOD_CATEGORY, "value");
  if (!categoryList.includes(category)) {
    throw new Error(ERROR_MESSAGE.INVALID_CATEGORY);
  }
}
function _validateRestaurantName(restaurantName) {
  if (!isInRange(
    restaurantName.length,
    RESTAURANT_FIELD_LENGTH.name.min,
    RESTAURANT_FIELD_LENGTH.name.max
  )) {
    throw new Error(ERROR_MESSAGE.INVALID_RESTAURANT_NAME_LENGTH);
  }
}
function _validateRestaurantDistance(distance) {
  const distanceList = extractByKey(RESTAURANT_DISTANCE, "value");
  if (!distanceList.includes(distance)) {
    throw new Error(ERROR_MESSAGE.INVALID_RESTAURANT_DISTANCE);
  }
}
function _validateRestaurantDescription(description) {
  if (!isInRange(
    description.length,
    RESTAURANT_FIELD_LENGTH.description.min,
    RESTAURANT_FIELD_LENGTH.description.max
  )) {
    throw new Error(ERROR_MESSAGE.INVALID_RESTAURANT_DESCRIPTION_LENGTH);
  }
}
function _validateRestaurantLink(link) {
  if (!isInRange(
    link.length,
    RESTAURANT_FIELD_LENGTH.link.min,
    RESTAURANT_FIELD_LENGTH.link.max
  )) {
    throw new Error(ERROR_MESSAGE.INVALID_RESTAURANT_LINK_LENGTH);
  }
}
function restaurantFormValidation({
  category,
  name,
  distance,
  description,
  link
}) {
  _validateRestaurantCategory(category);
  _validateRestaurantName(name);
  _validateRestaurantDistance(distance);
  _validateRestaurantDescription(description);
  _validateRestaurantLink(link);
}
const categoryIcon = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
};
function createRestaurantItem({
  category,
  name,
  distance,
  description,
  link
}) {
  const restaurantItem = createElement("li", { className: "restaurant" });
  restaurantItem.innerHTML = `
  <div class="restaurant__category">
    <img
      src="${categoryIcon[category]}"
      alt="${category}"
      class="category-icon"
    />
  </div>
  <div class="restaurant__info">
    <h3 class="restaurant__name text-subtitle">${name}</h3>
    <span class="restaurant__distance text-body"
      >캠퍼스부터 ${distance}분 내</span
    >
    <p class="restaurant__description text-body">
      ${description}
    </p>
  </div>
  `;
  return restaurantItem;
}
function createRestaurantForm() {
  const restaurantAddForm = createElement("form", {
    className: "restaurant-add-form"
  });
  restaurantAddForm.append(
    createDropdownBox({
      labelText: "카테고리",
      id: "category",
      dropdownList: FOOD_CATEGORY,
      required: true
    }),
    createInputBox({
      labelText: "이름",
      required: true,
      type: "text",
      id: "name"
    }),
    createDropdownBox({
      labelText: "거리(도보 이동 시간)",
      id: "distance",
      dropdownList: RESTAURANT_DISTANCE,
      required: true
    }),
    createTextAreaBox({
      labelText: "설명",
      id: "description",
      textCaption: "메뉴 등 추가 정보를 입력해 주세요."
    }),
    createInputBox({
      labelText: "참고 링크",
      type: "text",
      id: "link",
      textCaption: "메장 정보를 확인할 수 있는 링크를 입력해 주세요."
    })
  );
  const buttonContainer = createElement("div", {
    className: "button-container"
  });
  buttonContainer.append(
    createButton({
      type: "button",
      className: [
        "button",
        "button--secondary",
        "text-caption",
        "cancel-button"
      ],
      textContent: "취소하기",
      onclick: () => document.querySelector(".modal").close()
    }),
    createButton({
      type: "submit",
      className: ["button", "button--primary", "text-caption"],
      textContent: "추가하기"
    })
  );
  restaurantAddForm.appendChild(buttonContainer);
  function handleAddRestaurantFormSubmit(event) {
    event.preventDefault();
    try {
      const formData = extractFormData(restaurantAddForm);
      restaurantFormValidation(formData);
      const restaurantList = document.querySelector(".restaurant-list");
      restaurantList.appendChild(createRestaurantItem(formData));
      restaurantAddForm.reset();
      const modal = document.querySelector(".modal");
      modal.close();
    } catch (error) {
      alert(error.message);
    }
  }
  restaurantAddForm.addEventListener("submit", handleAddRestaurantFormSubmit);
  return restaurantAddForm;
}
document.querySelector("#app");
function bottomSheetController() {
  let isFirstRender = false;
  function handleBottomSheetToggle2(event) {
    const modal = document.querySelector(".modal");
    if (event.target.closest(".restaurant-add-button")) {
      modal.showModal();
      if (!isFirstRender) {
        const modalContainer = document.querySelector(".modal-container");
        const restaurantFrom = createRestaurantForm();
        modalContainer.appendChild(restaurantFrom);
        isFirstRender = true;
      }
    }
    if (event.target.closest(".modal-backdrop")) {
      modal.close();
    }
  }
  return { handleBottomSheetToggle: handleBottomSheetToggle2 };
}
const { handleBottomSheetToggle } = bottomSheetController();
document.body.addEventListener("click", handleBottomSheetToggle);
