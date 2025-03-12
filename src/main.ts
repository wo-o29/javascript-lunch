import { handleBottomSheetToggle } from "./components/bottomSheet/bottomSheet.ts";
import { renderFilterBox } from "./components/filterBox/filterBox.ts";
import {
  renderRestaurantList,
  getRestaurantList,
} from "./components/restaurant/list/restaurantList.ts";
import { renderRestaurantTab } from "./components/restaurant/tab/restaurantTab.ts";

renderRestaurantTab();
renderFilterBox();
renderRestaurantList(getRestaurantList());
document.body.addEventListener("click", handleBottomSheetToggle);
