import { handleBottomSheetToggle } from "./components/bottomSheet/bottomSheet.ts";
import { renderFilterBox } from "./components/filterBox/filterBox.ts";
import {
  renderRestaurantList,
  getRestaurantList,
} from "./components/restaurant/list/restaurantList.ts";

renderFilterBox();
renderRestaurantList(getRestaurantList());
document.body.addEventListener("click", handleBottomSheetToggle);
