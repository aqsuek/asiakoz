import Hero from "../components/Hero";
import LaserOfferBanner from "../components/LaserOfferBanner";
import QuickPaths from "../components/QuickPaths";
import Advantages from "../components/Advantages";
import Services from "../components/Services";
import Doctors from "../components/Doctors";
import Reviews from "../components/Reviews";
import Booking from "../components/Booking";
import Contacts from "../components/Contacts";
import LaserHero from "../components/laser/LaserHero";
import TrustStrip from "../components/laser/TrustStrip";
import FeaturedReview from "../components/laser/FeaturedReview";
import Suitability from "../components/laser/Suitability";
import LaserMethods from "../components/laser/LaserMethods";
import ProcessSteps from "../components/laser/ProcessSteps";
import PriceIncludes from "../components/laser/PriceIncludes";
import CompactAdvantages from "../components/laser/CompactAdvantages";
import LaserFAQ from "../components/laser/LaserFAQ";
import CityFAQ from "../components/CityFAQ";
import CityLenses from "../components/CityLenses";
import MidPageCta from "../components/conversion/MidPageCta";
import WhatsAppFunnel from "../components/conversion/WhatsAppFunnel";
import { useLang } from "../i18n/LanguageContext";
import { IS_ALMATY, IS_LASER } from "../lib/branch";

function LaserHome() {
  const { lang } = useLang();
  const topic = lang === "ru" ? "лазерная коррекция" : "лазерлік түзету";

  return (
    <>
      <LaserHero />
      <TrustStrip />
      <MidPageCta topic={topic} />
      <FeaturedReview />
      <Suitability />
      <LaserMethods />
      <Doctors />
      <ProcessSteps />
      <PriceIncludes />
      <CompactAdvantages />
      <Reviews skipFirst />
      <LaserFAQ />
      <WhatsAppFunnel />
      <Booking laserMode />
      <Contacts />
    </>
  );
}

export default function HomePage() {
  if (IS_LASER) return <LaserHome />;

  return (
    <>
      {IS_ALMATY && <LaserOfferBanner />}
      <Hero />
      {IS_ALMATY && <QuickPaths />}
      <Advantages />
      {IS_ALMATY && <CityLenses />}
      <Services />
      <MidPageCta />
      <Doctors />
      <Reviews />
      <CityFAQ />
      <WhatsAppFunnel />
      <Booking />
      <Contacts />
    </>
  );
}
