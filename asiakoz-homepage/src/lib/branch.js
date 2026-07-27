const rawBranch = (import.meta.env.VITE_BRANCH || "shymkent").toLowerCase();

export const BRANCH =
  rawBranch === "aqtau" ? "aqtau" : rawBranch === "laser" ? "laser" : "shymkent";

export const IS_AQTAU = BRANCH === "aqtau";
export const IS_LASER = BRANCH === "laser";
