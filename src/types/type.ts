export type HTMLTagName = keyof HTMLElementTagNameMap;

export interface Props {
  [key: string]: string | string[];
}

export type Category = "한식" | "중식" | "일식" | "양식" | "아시안" | "기타";

export type CategoryFilter = "전체" | Category;

export type SortFilter = "이름순" | "거리순";

export type Distance = "5" | "10" | "15" | "20" | "30";

export interface RestaurantAddForm {
  category: Category;
  name: string;
  distance: Distance;
  description: string;
  link: string;
}
