import { getElement } from "../../utils/dom";
import createRestaurantForm from "../restaurant/form/form";

function bottomSheetController() {
  let isFirstRender = false;
  const modal = getElement(".modal") as HTMLDialogElement;

  function handleModalClose() {
    modal.close();
  }

  function handleBottomSheetToggle(event: MouseEvent) {
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

  return { handleModalClose, handleBottomSheetToggle };
}

export const { handleModalClose, handleBottomSheetToggle } =
  bottomSheetController();
