import createButton from "../../button/button.ts";
import createDropdownBox from "../../dropdown/dropdown.ts";
import createInputBox from "../../input/input.ts";
import createTextAreaBox from "../../textarea/textarea.ts";
import {
  FOOD_CATEGORY,
  RESTAURANT_DISTANCE,
} from "../../../settings/settings.ts";
import { restaurantFormValidation } from "../../../validation/restaurantFormValidation.ts";
import { extractFormData } from "../../../utils/extract.ts";
import type { Restaurant } from "../../../types/type.ts";
import { addRestaurantItem } from "../list/restaurantList.ts";
import { getElement } from "../../../utils/dom.ts";

const modal = getElement(".modal") as HTMLDialogElement;

function handleModalClose() {
  modal.close();
}

export default function createRestaurantForm() {
  const restaurantAddForm = createElement("form", {
    className: "restaurant-add-form",
  });

  restaurantAddForm.append(
    createDropdownBox({
      labelText: "카테고리",
      id: "category",
      dropdownList: FOOD_CATEGORY,
      required: true,
    }),
    createInputBox({
      labelText: "이름",
      required: true,
      type: "text",
      id: "name",
    }),
    createDropdownBox({
      labelText: "거리(도보 이동 시간)",
      id: "distance",
      dropdownList: RESTAURANT_DISTANCE,
      required: true,
    }),
    createTextAreaBox({
      labelText: "설명",
      id: "description",
      textCaption: "메뉴 등 추가 정보를 입력해 주세요.",
    }),
    createInputBox({
      labelText: "참고 링크",
      type: "text",
      id: "link",
      textCaption: "메장 정보를 확인할 수 있는 링크를 입력해 주세요.",
    })
  );

  const buttonContainer = createElement("div", {
    className: "button-container",
  });

  buttonContainer.append(
    createButton({
      type: "button",
      className: [
        "button",
        "button--secondary",
        "text-caption",
        "cancel-button",
      ],
      textContent: "취소하기",
      onclick: handleModalClose,
    }),
    createButton({
      type: "submit",
      className: ["button", "button--primary", "text-caption"],
      textContent: "추가하기",
    })
  );

  restaurantAddForm.appendChild(buttonContainer);

  function handleAddRestaurantFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      const formData = extractFormData(
        restaurantAddForm
      ) as unknown as Restaurant;
      restaurantFormValidation(formData);
      addRestaurantItem(formData);
      restaurantAddForm.reset();

      handleModalClose();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  restaurantAddForm.addEventListener("submit", handleAddRestaurantFormSubmit);

  return restaurantAddForm;
}
