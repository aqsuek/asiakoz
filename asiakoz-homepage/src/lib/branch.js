const rawBranch = (import.meta.env.VITE_BRANCH || "shymkent").toLowerCase();

const BRANCHES = new Set(["shymkent", "aqtau", "laser", "almaty"]);

export const BRANCH = BRANCHES.has(rawBranch) ? rawBranch : "shymkent";

export const IS_AQTAU = BRANCH === "aqtau";
export const IS_LASER = BRANCH === "laser";
export const IS_ALMATY = BRANCH === "almaty";
