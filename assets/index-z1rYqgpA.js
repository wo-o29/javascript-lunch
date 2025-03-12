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
    if (key === "dataset") {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
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
function elementCashController() {
  const cash = /* @__PURE__ */ new Map();
  function getElement2(selector) {
    if (!cash.has(selector)) {
      cash.set(selector, document.querySelector(selector));
    }
    return cash.get(selector);
  }
  return { getElement: getElement2 };
}
const { getElement } = elementCashController();
const FOOD_CATEGORY = [
  { value: "한식", text: "한식" },
  { value: "중식", text: "중식" },
  { value: "일식", text: "일식" },
  { value: "아시안", text: "아시안" },
  { value: "양식", text: "양식" },
  { value: "기타", text: "기타" }
];
const FOOD_CATEGORY_FILTER = [
  {
    value: "전체",
    text: "전체"
  },
  ...FOOD_CATEGORY
];
const SORTED_OPTION = [
  {
    value: "name",
    text: "이름순"
  },
  {
    value: "distance",
    text: "거리순"
  }
];
const RESTAURANT_DISTANCE = [
  { value: 5, text: "5분 내" },
  { value: 10, text: "10분 내" },
  { value: 15, text: "15분 내" },
  { value: 20, text: "20분 내" },
  { value: 30, text: "30분 내" }
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
const STORAGE_KEY = {
  RESTAURANTS: "restaurants"
};
function storageController(storage) {
  function getStorage2(key) {
    const item = storage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }
  function setStorage2(key, value) {
    storage.setItem(key, JSON.stringify(value));
  }
  function removeStorage2(key) {
    storage.removeItem(key);
  }
  function clearStorage() {
    storage.clear();
  }
  return {
    getStorage: getStorage2,
    setStorage: setStorage2,
    removeStorage: removeStorage2,
    clearStorage
  };
}
const { getStorage, setStorage } = storageController(localStorage);
function getRestaurantList() {
  return getStorage(STORAGE_KEY.RESTAURANTS) ?? [];
}
function getRestaurantItem(id) {
  const restaurantList = getRestaurantList();
  const result = restaurantList.find((restaurant) => restaurant.id === id);
  if (!result) {
    throw new Error("해당 ID를 가진 음식점이 없습니다.");
  }
  return result;
}
function removeRestaurantItem(id) {
  const restaurantList = getRestaurantList();
  const newList = restaurantList.filter((restaurant) => restaurant.id !== id);
  setStorage(STORAGE_KEY.RESTAURANTS, newList);
  return newList;
}
function sortRestaurantList(restaurantList, sortedOption) {
  return restaurantList.sort((a, b) => {
    if (sortedOption === "name") {
      return a[sortedOption].localeCompare(b[sortedOption]);
    }
    return a[sortedOption] - b[sortedOption];
  });
}
function filterRestaurantList(restaurantList, categoryFilter) {
  if (categoryFilter === "전체") {
    return restaurantList;
  }
  return restaurantList.filter(({ category }) => category === categoryFilter);
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
const categoryIcon = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
};
function createCategoryIcon(category) {
  const categoryBox = createElement("div", {
    className: "restaurant__category"
  });
  const categoryImage = createElement("img", {
    src: categoryIcon[category],
    alt: category,
    className: "category-icon"
  });
  categoryBox.appendChild(categoryImage);
  return categoryBox;
}
const filled = {
  true: "M16 23.0267L24.24 28L22.0533 18.6267L29.3333 12.32L19.7467 11.5067L16 2.66666L12.2533 11.5067L2.66666 12.32L9.94666 18.6267L7.76 28L16 23.0267Z",
  false: "M29.3333 12.32L19.7467 11.4934L16 2.66669L12.2533 11.5067L2.66666 12.32L9.94666 18.6267L7.76 28L16 23.0267L24.24 28L22.0667 18.6267L29.3333 12.32ZM16 20.5334L10.9867 23.56L12.32 17.8534L7.89333 14.0134L13.7333 13.5067L16 8.13335L18.28 13.52L24.12 14.0267L19.6933 17.8667L21.0267 23.5734L16 20.5334Z"
};
function createStarIcon({ className, isFill }) {
  const filledKey = String(isFill);
  const starIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  starIcon.setAttribute("class", className);
  starIcon.innerHTML = `
    <g id="Star" clip-path="url(#clip0_9959_430)">
    <path id="Vector" d="${filled[filledKey]}" fill="#EC4A0A"/>
    </g>
    <defs>
    <clipPath id="clip0_9959_430">
    <rect width="32" height="32" fill="white"/>
    </clipPath>
    </defs>
  `;
  return starIcon;
}
function replaceStarIcon(isFavorite, starIcon, className) {
  starIcon.replaceWith(
    createStarIcon({
      className,
      isFill: isFavorite
    })
  );
}
function getRestaurantItemStarIcon(id) {
  const restaurantItem = document.querySelector(`[data-id="${id}"]`);
  return restaurantItem == null ? void 0 : restaurantItem.querySelector(".star-icon");
}
function toggleRestaurantFavorite(id, replaceStarIcons) {
  const restaurantList = getRestaurantList().map((restaurant) => {
    if (restaurant.id === id) {
      restaurant.isFavorite = !restaurant.isFavorite;
      replaceStarIcons.forEach(({ starIcon, className }) => {
        replaceStarIcon(restaurant.isFavorite, starIcon, className);
      });
    }
    return restaurant;
  });
  setStorage(STORAGE_KEY.RESTAURANTS, restaurantList);
}
function handleRestaurantItemClick$1(e, id) {
  const target = e.target;
  if (target.closest(".star-icon")) {
    const starIcon = getRestaurantItemStarIcon(id);
    toggleRestaurantFavorite(id, [{ starIcon, className: "star-icon" }]);
  }
  if (target.closest(".restaurant")) {
    const restaurantData = getRestaurantItem(id);
    openRestaurantDetailModal(restaurantData);
  }
}
function createRestaurantItem({
  id,
  category,
  name,
  distance,
  description,
  isFavorite
}) {
  const restaurantItem = createElement("li", {
    className: "restaurant",
    dataset: {
      id
    }
  });
  const infoBox = createElement("div", { className: "restaurant__info" });
  const nameElement = createElement("h3", {
    className: ["restaurant__name", "text-subtitle"],
    textContent: name
  });
  const distanceElement = createElement("span", {
    className: ["restaurant__distance", "text-body"],
    textContent: `캠퍼스부터 ${distance}분 내`
  });
  const descriptionElement = createElement("p", {
    className: ["restaurant__description", "text-body"],
    textContent: description
  });
  infoBox.append(nameElement, distanceElement, descriptionElement);
  restaurantItem.append(
    createCategoryIcon(category),
    infoBox,
    createStarIcon({ className: "star-icon", isFill: isFavorite })
  );
  restaurantItem.addEventListener(
    "click",
    (e) => handleRestaurantItemClick$1(e, id)
  );
  return restaurantItem;
}
function restaurantListRenderer() {
  const currentState = {
    categoryFilter: "전체",
    sortedOption: "name",
    favoriteRenderMode: false,
    renderedRestaurantList: []
  };
  function createRestaurantList2(restaurantList) {
    const $restaurantList = createElement("ul", {
      className: "restaurant-list"
    });
    if (!restaurantList.length) {
      return createElement("p", {
        className: "restaurant-list-empty",
        textContent: "등록된 음식점이 없습니다."
      });
    }
    restaurantList.forEach(
      (restaurantInfo) => $restaurantList.appendChild(createRestaurantItem(restaurantInfo))
    );
    return $restaurantList;
  }
  function renderRestaurantList2(restaurantList) {
    const restaurantListContainer = getElement(".restaurant-list-container");
    const filteredList = filterRestaurantList(
      restaurantList,
      currentState.categoryFilter
    );
    const sortedList = sortRestaurantList(
      filteredList,
      currentState.sortedOption
    );
    if (currentState.favoriteRenderMode) {
      const favoriteList = sortedList.filter(({ isFavorite }) => isFavorite);
      restaurantListContainer == null ? void 0 : restaurantListContainer.replaceChildren(
        createRestaurantList2(favoriteList)
      );
      currentState.renderedRestaurantList = favoriteList;
      return;
    }
    restaurantListContainer == null ? void 0 : restaurantListContainer.replaceChildren(createRestaurantList2(sortedList));
    currentState.renderedRestaurantList = sortedList;
  }
  function addRestaurantItem2(restaurantInfo) {
    const prevList = getRestaurantList();
    const newList = [...prevList, restaurantInfo];
    setStorage(STORAGE_KEY.RESTAURANTS, newList);
    renderRestaurantList2(newList);
  }
  function setCategoryFilter2(categoryFilter) {
    currentState.categoryFilter = categoryFilter;
    renderRestaurantList2(getRestaurantList());
  }
  function setSortedOption2(sortedOption) {
    currentState.sortedOption = sortedOption;
    renderRestaurantList2(getRestaurantList());
  }
  function toggleFavoriteRenderMode2() {
    currentState.favoriteRenderMode = !currentState.favoriteRenderMode;
    renderRestaurantList2(getRestaurantList());
  }
  function getFavoriteRenderMode2() {
    return currentState.favoriteRenderMode;
  }
  return {
    createRestaurantList: createRestaurantList2,
    renderRestaurantList: renderRestaurantList2,
    addRestaurantItem: addRestaurantItem2,
    setCategoryFilter: setCategoryFilter2,
    setSortedOption: setSortedOption2,
    toggleFavoriteRenderMode: toggleFavoriteRenderMode2,
    getFavoriteRenderMode: getFavoriteRenderMode2
  };
}
const {
  renderRestaurantList,
  addRestaurantItem,
  setCategoryFilter,
  setSortedOption,
  toggleFavoriteRenderMode,
  getFavoriteRenderMode
} = restaurantListRenderer();
function handleRestaurantItemDelete(id) {
  renderRestaurantList(removeRestaurantItem(id));
  handleModalClose();
}
function handleRestaurantItemClick(e, id) {
  const target = e.target;
  if (target.closest(".detail-star-icon")) {
    const starIcon = document.querySelector(".detail-star-icon");
    toggleRestaurantFavorite(id, [
      { starIcon, className: "detail-star-icon" },
      { starIcon: getRestaurantItemStarIcon(id), className: "star-icon" }
    ]);
  }
  if (target.closest(".delete-button")) {
    handleRestaurantItemDelete(id);
  }
  if (target.closest(".close-button")) {
    handleModalClose();
  }
}
function createRestaurantDetail({
  id,
  category,
  name,
  distance,
  description,
  link,
  isFavorite
}) {
  const detailBox = createElement("div");
  const detailHeader = createElement("div", {
    className: "detail-header"
  });
  detailHeader.append(
    createCategoryIcon(category),
    createStarIcon({ className: "detail-star-icon", isFill: isFavorite })
  );
  const detailBody = createElement("div", {
    className: "detail-body"
  });
  const detailName = createElement("h2", {
    className: "detail-name",
    textContent: name
  });
  const detailDistance = createElement("span", {
    className: "detail-distance",
    textContent: `캠퍼스부터 ${distance}분 내`
  });
  const detailDescription = createElement("p", {
    className: "detail-description",
    textContent: description
  });
  const detailLink = createElement("a", {
    className: "detail-link",
    href: link,
    textContent: link
  });
  detailBody.append(detailName, detailDistance, detailDescription, detailLink);
  const detailFooter = createElement("div", {
    className: "detail-footer"
  });
  detailFooter.append(
    createButton({
      type: "button",
      className: [
        "button",
        "button--secondary",
        "text-caption",
        "delete-button"
      ],
      textContent: "삭제하기"
    }),
    createButton({
      type: "button",
      className: ["button", "button--primary", "text-caption", "close-button"],
      textContent: "닫기"
    })
  );
  detailBox.append(detailHeader, detailBody, detailFooter);
  detailBox.addEventListener(
    "click",
    (e) => handleRestaurantItemClick(e, id)
  );
  return detailBox;
}
function createDropdownBox({
  labelText,
  id,
  dropdownList,
  required = false
}) {
  const dropdownBox = createElement("div", {
    className: ["form-item", `${required && "form-item--required"}`]
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
  const optionElements = dropdownList.map(
    ({ value, text }) => createElement("option", {
      value,
      textContent: text
    })
  );
  select.append(...optionElements);
  dropdownBox.append(dropdownLabel, select);
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
    htmlFor: id,
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
  description && _validateRestaurantDescription(description);
  link && _validateRestaurantLink(link);
}
function createFilter({ id, onchange, dropdownList }) {
  const select = createElement("select", {
    name: id,
    id,
    onchange,
    className: "restaurant-filter"
  });
  const optionElements = dropdownList.map(
    ({ value, text }) => createElement("option", {
      value,
      textContent: text
    })
  );
  select.append(...optionElements);
  return select;
}
function handleCategoryFilterSelect(categoryFilter) {
  const select = document.getElementById(
    "category-filter"
  );
  select.value = categoryFilter;
  setCategoryFilter(categoryFilter);
}
function handleCategoryFilterChange(e) {
  const target = e.target;
  setCategoryFilter(target.value);
}
function handleSortedFilterChange(e) {
  const target = e.target;
  setSortedOption(target.value);
}
function filterBoxRenderer() {
  function createFilterBox() {
    const categoryFilter = createFilter({
      id: "category-filter",
      onchange: handleCategoryFilterChange,
      dropdownList: FOOD_CATEGORY_FILTER
    });
    const sortedFilter = createFilter({
      id: "sorting-filter",
      onchange: handleSortedFilterChange,
      dropdownList: SORTED_OPTION
    });
    return createElementsFragment([categoryFilter, sortedFilter]);
  }
  function renderFilterBox2() {
    const restaurantFilterContainer = getElement(
      ".restaurant-filter-container"
    );
    restaurantFilterContainer == null ? void 0 : restaurantFilterContainer.appendChild(createFilterBox());
  }
  function removeFilterBox2() {
    const restaurantFilterContainer = getElement(
      ".restaurant-filter-container"
    );
    restaurantFilterContainer == null ? void 0 : restaurantFilterContainer.replaceChildren();
  }
  return { renderFilterBox: renderFilterBox2, removeFilterBox: removeFilterBox2 };
}
const { renderFilterBox } = filterBoxRenderer();
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = { randomUUID };
function v4(options, buf, offset) {
  var _a;
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? ((_a = options.rng) == null ? void 0 : _a.call(options)) ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function createRestaurantForm() {
  const title = createElement("h2", {
    className: ["modal-title", "text-title"],
    textContent: "새로운 음식점"
  });
  const restaurantAddForm = createElement("form", {
    className: "restaurant-add-form"
  });
  const defaultOption = { value: "", text: "선택해 주세요" };
  restaurantAddForm.append(
    createDropdownBox({
      labelText: "카테고리",
      id: "category",
      dropdownList: [defaultOption, ...FOOD_CATEGORY],
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
      dropdownList: [defaultOption, ...RESTAURANT_DISTANCE],
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
      onclick: handleModalClose
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
      const formData = extractFormData(
        restaurantAddForm
      );
      restaurantFormValidation(formData);
      addRestaurantItem({ ...formData, id: v4(), isFavorite: false });
      handleCategoryFilterSelect(formData.category);
      restaurantAddForm.reset();
      handleModalClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }
  restaurantAddForm.addEventListener("submit", handleAddRestaurantFormSubmit);
  return createElementsFragment([title, restaurantAddForm]);
}
function bottomSheetController() {
  const modal = getElement(".modal");
  const modalContainer = getElement(".modal-container");
  function handleModalClose2() {
    modal.close();
  }
  function openRestaurantDetailModal2(RestaurantInfo) {
    modal.showModal();
    modalContainer.replaceChildren(createRestaurantDetail(RestaurantInfo));
  }
  function openRestaurantAddFormModal() {
    modal.showModal();
    modalContainer.replaceChildren(createRestaurantForm());
  }
  function handleBottomSheetToggle2(event) {
    const target = event.target;
    if (target.closest(".restaurant-add-button")) {
      openRestaurantAddFormModal();
    }
    if (target.closest(".modal-backdrop")) {
      modal.close();
    }
  }
  return {
    handleModalClose: handleModalClose2,
    handleBottomSheetToggle: handleBottomSheetToggle2,
    openRestaurantDetailModal: openRestaurantDetailModal2
  };
}
const {
  handleModalClose,
  handleBottomSheetToggle,
  openRestaurantDetailModal
} = bottomSheetController();
function restaurantTabRenderer() {
  function toggleRestaurantTab() {
    toggleFavoriteRenderMode();
    const toggleClassName = "select-tab-button";
    getElement(".all-restaurant-tab").classList.toggle(toggleClassName);
    getElement(".favorite-restaurant-tab").classList.toggle(toggleClassName);
    const selectEffect = getElement(".select-effect");
    if (getFavoriteRenderMode()) {
      selectEffect.classList.add("select-favorite-restaurant-tab");
      selectEffect.classList.remove("select-all-restaurant-tab");
      return;
    }
    selectEffect.classList.add("select-all-restaurant-tab");
    selectEffect.classList.remove("select-favorite-restaurant-tab");
  }
  function createRestaurantTab() {
    const allRestaurantTab = createButton({
      type: "button",
      textContent: "모든 음식점",
      className: ["tab-button", "select-tab-button", "all-restaurant-tab"],
      onclick: toggleRestaurantTab
    });
    const favoriteRestaurantTab = createButton({
      type: "button",
      textContent: "자주가는 음식점",
      className: ["tab-button", "favorite-restaurant-tab"],
      onclick: toggleRestaurantTab
    });
    const selectEffect = createElement("p", {
      className: "select-effect"
    });
    return createElementsFragment([
      allRestaurantTab,
      favoriteRestaurantTab,
      selectEffect
    ]);
  }
  function renderRestaurantTab2() {
    const restaurantTabContainer = getElement(".restaurant-tab-container");
    restaurantTabContainer.appendChild(createRestaurantTab());
  }
  return { renderRestaurantTab: renderRestaurantTab2 };
}
const { renderRestaurantTab } = restaurantTabRenderer();
renderRestaurantTab();
renderFilterBox();
renderRestaurantList(getRestaurantList());
document.body.addEventListener("click", handleBottomSheetToggle);
