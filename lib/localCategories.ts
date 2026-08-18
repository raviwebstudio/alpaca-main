export type LocalCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
  description: string | null;
  parent?: { name: string } | null;
  _count?: { products: number };
};

export const LOCAL_CATEGORIES_KEY = "alpaca_categories";
export const LOCAL_CATEGORIES_EVENT = "alpaca-categories-updated";

export const createCategorySlug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const baseCategories: LocalCategory[] = [
  { id: "oversized", name: "Oversized", slug: "oversized", parentId: null, image: null, description: "Relaxed silhouettes", _count: { products: 0 } },
  { id: "basics", name: "Basics", slug: "basics", parentId: null, image: null, description: "Daily uniform", _count: { products: 0 } },
  { id: "outerwear", name: "Outerwear", slug: "outerwear", parentId: null, image: null, description: "Layered utility", _count: { products: 0 } },
];

const attachParents = (categories: LocalCategory[]) =>
  categories.map((category) => ({
    ...category,
    parent: category.parentId
      ? { name: categories.find((item) => item.id === category.parentId)?.name ?? "Parent" }
      : null,
    _count: category._count ?? { products: 0 },
  }));

export const readLocalCategories = () => {
  if (typeof window === "undefined") return attachParents(baseCategories);

  try {
    const stored = window.localStorage.getItem(LOCAL_CATEGORIES_KEY);
    const categories = stored ? (JSON.parse(stored) as LocalCategory[]) : baseCategories;
    return attachParents(categories);
  } catch {
    return attachParents(baseCategories);
  }
};

export const writeLocalCategories = (categories: LocalCategory[]) => {
  window.localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
  window.dispatchEvent(new Event(LOCAL_CATEGORIES_EVENT));
};
