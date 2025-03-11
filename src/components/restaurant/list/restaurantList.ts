import createRestaurantItem from "../item/item";
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

function restaurantListRenderer() {
  let currentRenderedRestaurantList: Restaurant[] = [];

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

    restaurantListContainer?.replaceChildren(
      createRestaurantList(restaurantList)
    );

    currentRenderedRestaurantList = restaurantList;
  }

  function addRestaurantItem(restaurantInfo: Restaurant) {
    const prevList = getRestaurantList();
    const newList = [...prevList, restaurantInfo];
    setStorage(STORAGE_KEY.RESTAURANTS, newList);

    if (!prevList.length) {
      renderRestaurantList(newList);
      return;
    }

    const restaurantList = document.querySelector(".restaurant-list");
    restaurantList?.appendChild(createRestaurantItem(restaurantInfo));
  }

  function renderFilterRestaurantList(categoryFilter: CategoryFilter) {
    const restaurantList = getRestaurantList();

    if (categoryFilter === "전체") {
      renderRestaurantList(restaurantList);
      return;
    }

    const filteredList = restaurantList.filter(
      ({ category }) => category === categoryFilter
    );
    renderRestaurantList(filteredList);
  }

  function renderSortedRestaurantList(sortedOption: SortedOption) {
    const sortedList = currentRenderedRestaurantList.sort((a, b) => {
      if (sortedOption === "name") {
        return a[sortedOption].localeCompare(b[sortedOption]);
      }

      return a[sortedOption] - b[sortedOption];
    });

    renderRestaurantList(sortedList);
  }

  return {
    createRestaurantList,
    renderRestaurantList,
    addRestaurantItem,
    renderFilterRestaurantList,
    renderSortedRestaurantList,
  };
}

export const {
  createRestaurantList,
  renderRestaurantList,
  addRestaurantItem,
  renderFilterRestaurantList,
  renderSortedRestaurantList,
} = restaurantListRenderer();
