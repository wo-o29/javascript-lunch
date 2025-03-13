import { mockRestaurantList } from "../fixture/restaurantList";
import addRestaurant from "../utils/addRestaurant";

describe("음식점 상세 모달 테스트", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
    mockRestaurantList.forEach((item) => {
      addRestaurant(item);
    });
  });

  it("음식점 상세 모달 띄우기", () => {
    cy.get(".restaurant").click();
    cy.get(".modal").should("be.visible");
    cy.get(".detail-modal").should("exist");
  });

  it("음식점 상세 모달 띄우고 닫기 버튼 클릭", () => {
    cy.get(".restaurant").click();
    cy.get(".modal").should("be.visible");
    cy.get(".detail-modal").should("exist");

    cy.get(".close-button").click();
    cy.get(".modal").should("not.be.visible");
  });

  it("음식점 상세 모달 띄우고 삭제 버튼 클릭", () => {
    cy.get(".restaurant").should("have.length", 1);

    cy.get(".restaurant").click();
    cy.get(".modal").should("be.visible");
    cy.get(".detail-modal").should("exist");

    cy.get(".delete-button").click();
    cy.get(".restaurant").should("have.length", 0);
  });
});
