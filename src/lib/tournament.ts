export type Category = {
  id: string;
  name: string;
  price: number;
  capacity: number;
};

export const tournament = {
  id: "pj-2026-december-open",
  name: "PJ December Open 2026",
  dateLabel: "2026年12月開催",
  currency: "jpy",
  categories: [
    { id: "mens-doubles-open", name: "男子ダブルス Open", price: 6000, capacity: 160 },
    { id: "womens-doubles-open", name: "女子ダブルス Open", price: 6000, capacity: 160 },
    { id: "mixed-doubles-open", name: "ミックスダブルス Open", price: 6000, capacity: 220 },
    { id: "mens-singles-open", name: "男子シングルス Open", price: 5000, capacity: 120 },
    { id: "womens-singles-open", name: "女子シングルス Open", price: 5000, capacity: 80 },
  ] satisfies Category[],
};

export function getCategory(categoryId: string) {
  return tournament.categories.find((category) => category.id === categoryId);
}
