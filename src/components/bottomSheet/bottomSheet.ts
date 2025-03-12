import type { Restaurant } from "../../types/type";
import { getElement } from "../../utils/dom";
import createRestaurantDetail from "../restaurant/detail/restaurantDetail";
import createRestaurantForm from "../restaurant/form/form";

function bottomSheetController() {
  const modal = getElement(".modal") as HTMLDialogElement;
  const modalContainer = getElement(".modal-container");

  function handleModalClose() {
    modal.close();
  }

  function openRestaurantDetailModal(RestaurantInfo: Restaurant) {
    modal.showModal();
    modalContainer.replaceChildren(createRestaurantDetail(RestaurantInfo));
  }

  function openRestaurantAddFormModal() {
    modal.showModal();
    modalContainer.replaceChildren(createRestaurantForm());
  }

  function handleBottomSheetToggle(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest(".restaurant-add-button")) {
      openRestaurantAddFormModal();
    }

    if (target.closest(".modal-backdrop")) {
      modal.close();
    }
  }

  return {
    handleModalClose,
    handleBottomSheetToggle,
    openRestaurantDetailModal,
  };
}

export const {
  handleModalClose,
  handleBottomSheetToggle,
  openRestaurantDetailModal,
} = bottomSheetController();
