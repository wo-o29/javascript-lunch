import { mockRestaurantList } from "../fixture/restaurantList";
import addRestaurant from "../utils/addRestaurant";

describe("음식점 카테고리 필터 테스트", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
    mockRestaurantList.forEach((item) => {
      addRestaurant(item);
    });
    cy.get("#category-filter").select("전체");
    cy.get(".restaurant").should("have.length", 10);
  });

  it("한식 카테고리를 클릭하면 한식에 해당되는 음식점 3개가 렌더링된다. ", () => {
    cy.get("#category-filter").select("한식");
    cy.get(".restaurant").should("have.length", 3);
  });

  it("중식 카테고리를 클릭하면 중식에 해당되는 음식점 2개가 렌더링된다. ", () => {
    cy.get("#category-filter").select("중식");
    cy.get(".restaurant").should("have.length", 2);
  });

  it("일식 카테고리를 클릭하면 일식에 해당되는 음식점 1개가 렌더링된다. ", () => {
    cy.get("#category-filter").select("일식");
    cy.get(".restaurant").should("have.length", 1);
  });

  it("양식 카테고리를 클릭하면 양식에 해당되는 음식점 2개가 렌더링된다. ", () => {
    cy.get("#category-filter").select("양식");
    cy.get(".restaurant").should("have.length", 2);
  });

  it("아시안 카테고리를 클릭하면 아시안에 해당되는 음식점 2개가 렌더링된다. ", () => {
    cy.get("#category-filter").select("아시안");
    cy.get(".restaurant").should("have.length", 2);
  });

  it("기타 카테고리를 클릭하면 기타에 해당되는 음식점 0개가 렌더링된다. ", () => {
    cy.get("#category-filter").select("기타");
    cy.get(".restaurant").should("have.length", 0);
  });
});
