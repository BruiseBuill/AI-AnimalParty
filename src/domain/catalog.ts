export const FOODS = ["兽肉", "腐肉", "鸟肉", "草", "树叶", "浆果", "鱼", "昆虫"] as const;
export type Food = (typeof FOODS)[number];

export const FOOD_ICONS: Record<Food, string> = {
  兽肉: "🥩", 腐肉: "🦴", 鸟肉: "🍗", 草: "🌱",
  树叶: "🍃", 浆果: "🫐", 鱼: "🐟", 昆虫: "🪲",
};

export const DIETS = {
  狮子: ["兽肉", "腐肉", "鸟肉"],
  熊: ["浆果", "鱼", "兽肉"],
  鹿: ["草", "树叶", "浆果"],
  野猪: ["草", "浆果", "腐肉"],
  乌鸦: ["腐肉", "浆果", "昆虫"],
  鹅: ["草", "鱼", "昆虫"],
  蜥蜴: ["昆虫", "树叶", "腐肉"],
  猴子: ["树叶", "鸟肉", "浆果"],
  蛇: ["鱼", "兽肉", "鸟肉"],
  鹈鹕: ["鱼", "鸟肉", "昆虫"],
} as const satisfies Record<string, readonly Food[]>;

export type Role = keyof typeof DIETS;
export const ROLES = Object.keys(DIETS) as Role[];
export const ROLE_ICONS: Record<Role, string> = {
  狮子: "🦁", 熊: "🐻", 鹿: "🦌", 野猪: "🐗", 乌鸦: "🐦‍⬛",
  鹅: "🪿", 蜥蜴: "🦎", 猴子: "🐒", 蛇: "🐍", 鹈鹕: "🦤",
};
