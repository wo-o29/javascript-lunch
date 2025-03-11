import { STORAGE_KEY } from "../../../../settings/settings.ts";
import type { Restaurant } from "../../../../types/type.ts";
import { setStorage } from "../../../../utils/storage.ts";
import createStarIcon from "../../../starIcon/starIcon.ts";
import { getRestaurantList } from "../restaurantList.ts";

const categoryIcon = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png",
};

function replaceStarIcon({ isFavorite }: Record<string, boolean>) {
  document.querySelector(".star-icon")?.replaceWith(
    createStarIcon({
      isFill: isFavorite,
    })
  );
}

function handleRestaurantItemClick(e: MouseEvent, id: string) {
  const target = e.target as HTMLElement;
  if (target.closest(".star-icon")) {
    const restaurantList = getRestaurantList().map((restaurant) => {
      if (restaurant.id === id) {
        restaurant.isFavorite = !restaurant.isFavorite;
        replaceStarIcon({ isFavorite: restaurant.isFavorite });
      }

      return restaurant;
    });

    setStorage(STORAGE_KEY.RESTAURANTS, restaurantList);
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
  const restaurantItem = createElement("li", { className: "restaurant" });

  const categoryBox = createElement("div", {
    className: "restaurant__category",
  });
  const categoryImage = createElement("img", {
    src: categoryIcon[category],
    alt: category,
    className: "category-icon",
  });
  categoryBox.appendChild(categoryImage);

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
    categoryBox,
    infoBox,
    createStarIcon({ isFill: isFavorite })
  );
  restaurantItem.addEventListener("click", (e: MouseEvent) =>
    handleRestaurantItemClick(e, id)
  );
  return restaurantItem;
}
