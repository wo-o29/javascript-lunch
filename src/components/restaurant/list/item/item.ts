import { STORAGE_KEY } from "../../../../settings/settings.ts";
import type { Restaurant } from "../../../../types/type.ts";
import { setStorage } from "../../../../utils/storage.ts";
import { openRestaurantDetailModal } from "../../../bottomSheet/bottomSheet.ts";
import createCategoryIcon from "../../../categoryIcon/categoryIcon.ts";
import createStarIcon from "../../../starIcon/starIcon.ts";
import { getRestaurantItem, getRestaurantList } from "../restaurantList.ts";

function replaceStarIcon(
  isFavorite: boolean,
  starIcon: HTMLElement,
  className: string
) {
  starIcon.replaceWith(
    createStarIcon({
      className,
      isFill: isFavorite,
    })
  );
}

export function getRestaurantItemStarIcon(id: string) {
  const restaurantItem = document.querySelector(`[data-id="${id}"]`);
  return restaurantItem?.querySelector(".star-icon") as HTMLElement;
}

interface ReplaceStarIcons {
  starIcon: HTMLElement;
  className: string;
}

export function toggleRestaurantFavorite(
  id: string,
  replaceStarIcons: ReplaceStarIcons[]
) {
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

function handleRestaurantItemClick(e: MouseEvent, id: string) {
  const target = e.target as HTMLElement;
  if (target.closest(".star-icon")) {
    const starIcon = getRestaurantItemStarIcon(id);
    toggleRestaurantFavorite(id, [{ starIcon, className: "star-icon" }]);
  }

  if (target.closest(".restaurant")) {
    const restaurantData = getRestaurantItem(id);
    openRestaurantDetailModal(restaurantData);
  }
}

export default function createRestaurantItem({
  id,
  category,
  name,
  distance,
  description,
  isFavorite,
}: Restaurant) {
  const restaurantItem = createElement("li", {
    className: "restaurant",
    dataset: {
      id,
    },
  });
  const infoBox = createElement("div", { className: "restaurant__info" });
  const nameElement = createElement("h3", {
    className: ["restaurant__name", "text-subtitle"],
    textContent: name,
  });
  const distanceElement = createElement("span", {
    className: ["restaurant__distance", "text-body"],
    textContent: `캠퍼스부터 ${distance}분 내`,
  });
  const descriptionElement = createElement("p", {
    className: ["restaurant__description", "text-body"],
    textContent: description,
  });
  infoBox.append(nameElement, distanceElement, descriptionElement);

  restaurantItem.append(
    createCategoryIcon(category),
    infoBox,
    createStarIcon({ className: "star-icon", isFill: isFavorite })
  );
  restaurantItem.addEventListener("click", (e: MouseEvent) =>
    handleRestaurantItemClick(e, id)
  );
  return restaurantItem;
}
