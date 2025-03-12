import createRestaurantItem from "../list/item/item.ts";
import type {
  CategoryFilter,
  Restaurant,
  SortedOption,
} from "../../../types/type.ts";
import { getElement } from "../../../utils/dom.ts";
import { STORAGE_KEY } from "../../../settings/settings.ts";
import { getStorage, setStorage } from "../../../utils/storage.ts";

export function getRestaurantList(): Restaurant[] {
  return getStorage(STORAGE_KEY.RESTAURANTS) ?? [];
}

export function getRestaurantItem(id: string): Restaurant {
  const restaurantList = getRestaurantList();
  const result = restaurantList.find((restaurant) => restaurant.id === id);

  if (!result) {
    throw new Error("해당 ID를 가진 음식점이 없습니다.");
  }

  return result;
}

export function removeRestaurantItem(id: string): Restaurant[] {
  const restaurantList = getRestaurantList();
  const newList = restaurantList.filter((restaurant) => restaurant.id !== id);
  setStorage(STORAGE_KEY.RESTAURANTS, newList);
  return newList;
}

function sortRestaurantList(
  restaurantList: Restaurant[],
  sortedOption: SortedOption
) {
  return restaurantList.sort((a, b) => {
    if (sortedOption === "name") {
      return a[sortedOption].localeCompare(b[sortedOption]);
    }

    return a[sortedOption] - b[sortedOption];
  });
}

function filterRestaurantList(
  restaurantList: Restaurant[],
  categoryFilter: CategoryFilter
) {
  if (categoryFilter === "전체") {
    return restaurantList;
  }

  return restaurantList.filter(({ category }) => category === categoryFilter);
}

interface CurrentRestaurantListState {
  categoryFilter: CategoryFilter;
  sortedOption: SortedOption;
  favoriteRenderMode: boolean;
  renderedRestaurantList: Restaurant[];
}

function restaurantListRenderer() {
  const currentState: CurrentRestaurantListState = {
    categoryFilter: "전체",
    sortedOption: "name",
    favoriteRenderMode: false,
    renderedRestaurantList: [],
  };

  function createRestaurantList(restaurantList: Restaurant[]) {
    const $restaurantList = createElement("ul", {
      className: "restaurant-list",
    });

    if (!restaurantList.length) {
      return createElement("p", {
        className: "restaurant-list-empty",
        textContent: "등록된 음식점이 없습니다.",
      });
    }

    restaurantList.forEach((restaurantInfo) =>
      $restaurantList.appendChild(createRestaurantItem(restaurantInfo))
    );

    return $restaurantList;
  }

  function renderRestaurantList(restaurantList: Restaurant[]) {
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
      restaurantListContainer?.replaceChildren(
        createRestaurantList(favoriteList)
      );
      currentState.renderedRestaurantList = favoriteList;
      return;
    }

    restaurantListContainer?.replaceChildren(createRestaurantList(sortedList));
    currentState.renderedRestaurantList = sortedList;
  }

  function addRestaurantItem(restaurantInfo: Restaurant) {
    const prevList = getRestaurantList();
    const newList = [...prevList, restaurantInfo];
    setStorage(STORAGE_KEY.RESTAURANTS, newList);
    renderRestaurantList(newList);
  }

  function setCategoryFilter(categoryFilter: CategoryFilter) {
    currentState.categoryFilter = categoryFilter;
    renderRestaurantList(getRestaurantList());
  }

  function setSortedOption(sortedOption: SortedOption) {
    currentState.sortedOption = sortedOption;
    renderRestaurantList(getRestaurantList());
  }

  function toggleFavoriteRenderMode() {
    currentState.favoriteRenderMode = !currentState.favoriteRenderMode;
    renderRestaurantList(getRestaurantList());
  }

  function getFavoriteRenderMode() {
    return currentState.favoriteRenderMode;
  }

  return {
    createRestaurantList,
    renderRestaurantList,
    addRestaurantItem,
    setCategoryFilter,
    setSortedOption,
    toggleFavoriteRenderMode,
    getFavoriteRenderMode,
  };
}

export const {
  createRestaurantList,
  renderRestaurantList,
  addRestaurantItem,
  setCategoryFilter,
  setSortedOption,
  toggleFavoriteRenderMode,
  getFavoriteRenderMode,
} = restaurantListRenderer();
