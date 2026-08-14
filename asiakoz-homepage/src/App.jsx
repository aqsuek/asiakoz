import { useEffect, useState } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";
import { CityProvider } from "./context/CityContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileSticky from "./components/MobileSticky";
import HomePage from "./pages/HomePage";
import DoctorPage from "./pages/DoctorPage";
import NewsPage from "./pages/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage";
import { parseRoute } from "./lib/routes";
import { useLang } from "./i18n/LanguageContext";
import { captureUtmFromUrl } from "./lib/utm";
import { trackPageView } from "./lib/analytics";
import { useCity } from "./context/CityContext";
import { BRANCH } from "./lib/branch";

function Router() {
  const { t } = useLang();
  const { cityId } = useCity();
  const [route, setRoute] = useState(() => parseRoute());

  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    captureUtmFromUrl();
    trackPageView({ city: cityId || BRANCH || "almaty" });
  }, [route.name, route.id, route.slug]);

  useEffect(() => {
    if (route.name === "home") {
      document.title = t.seoTitle;
    }
  }, [route, t.seoTitle]);

  return (
    <div id="top" className="min-h-screen bg-surface-warm">
      <Header />
      <main>
        {route.name === "doctor" ? (
          <DoctorPage doctorId={route.id} />
        ) : route.name === "news" ? (
          <NewsPage />
        ) : route.name === "news-article" ? (
          <NewsArticlePage slug={route.slug} />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
      <MobileSticky />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CityProvider>
        <Router />
      </CityProvider>
    </LanguageProvider>
  );
}
