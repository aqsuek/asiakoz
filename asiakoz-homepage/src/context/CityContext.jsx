import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  NETWORK_BRANCHES,
  getNetworkBranch,
  isComingSoon as branchIsComingSoon,
} from "../data/branches";
import { branchDefaultCityId } from "../lib/branch";
import { readStoredCityId, writeStoredCityId } from "../lib/cityStorage";
import { trackEvent } from "../lib/analytics";

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [cityId, setCityIdState] = useState(
    () => readStoredCityId() || branchDefaultCityId(),
  );

  useEffect(() => {
    writeStoredCityId(cityId);
  }, [cityId]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key !== "asiakoz-home-city") return;
      const next = readStoredCityId();
      if (next) setCityIdState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setCityId = (nextId) => {
    if (!NETWORK_BRANCHES.some((b) => b.id === nextId)) return;
    setCityIdState((prev) => {
      if (prev === nextId) return prev;
      writeStoredCityId(nextId);
      trackEvent("branch_select", {
        branch: nextId,
        city: nextId,
        page_url: typeof window !== "undefined" ? window.location.href : "",
      });
      return nextId;
    });
  };

  const branch = useMemo(() => getNetworkBranch(cityId), [cityId]);

  const value = useMemo(
    () => ({
      cityId,
      setCityId,
      branch,
      branches: NETWORK_BRANCHES,
      isComingSoon: branchIsComingSoon(branch),
    }),
    [cityId, branch],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) {
    const fallback = branchDefaultCityId();
    return {
      cityId: fallback,
      setCityId: () => {},
      branch: getNetworkBranch(fallback),
      branches: NETWORK_BRANCHES,
      isComingSoon: false,
    };
  }
  return ctx;
}
