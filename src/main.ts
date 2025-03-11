import createRestaurantForm from "./components/restaurant/form/form.ts";
import { getElement } from "./utils/dom.ts";

function bottomSheetController() {
  let isFirstRender = false;

  function handleBottomSheetToggle(event: MouseEvent) {
    const modal = getElement(".modal") as HTMLDialogElement;
    const target = event.target as HTMLElement;

    if (target?.closest(".restaurant-add-button")) {
      modal.showModal();

      if (!isFirstRender) {
        const modalContainer = getElement(".modal-container");
        const restaurantFrom = createRestaurantForm();

        modalContainer.appendChild(restaurantFrom);
        isFirstRender = true;
      }
    }

    if (target?.closest(".modal-backdrop")) {
      modal.close();
    }
  }

  return { handleBottomSheetToggle };
}

const { handleBottomSheetToggle } = bottomSheetController();

document.body.addEventListener("click", handleBottomSheetToggle);
