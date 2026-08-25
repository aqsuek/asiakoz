import Hero from "../components/Hero";
import LaserOfferBanner from "../components/LaserOfferBanner";
import QuickPaths from "../components/QuickPaths";
import BranchCities from "../components/BranchCities";
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
import { IS_ALMATY, IS_HOME, IS_LASER } from "../lib/branch";

function LaserHome() {
  return (
    <>
      <LaserHero />
      <TrustStrip />
      <FeaturedReview />
      <Suitability />
      <LaserMethods />
      <Doctors />
      <ProcessSteps />
      <PriceIncludes />
      <CompactAdvantages />
      <Reviews skipFirst />
      <LaserFAQ />
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
      {IS_HOME && <BranchCities />}
      {IS_ALMATY && <QuickPaths />}
      <Advantages />
      {IS_ALMATY && <CityLenses />}
      <Services />
      <Doctors />
      <Reviews />
      <CityFAQ />
      <Booking />
      <Contacts />
    </>
  );
}
