import { About } from "@/components/sections/About";
import { Amenities } from "@/components/sections/Amenities";
import { Clouds } from "@/components/sections/Clouds";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Location } from "@/components/sections/Location";
import { Moments } from "@/components/sections/Moments";
import { Reels } from "@/components/sections/Reels";
import { Reviews } from "@/components/sections/Reviews";
import { Rules } from "@/components/sections/Rules";
import { Spaces } from "@/components/sections/Spaces";
import { SocialProof } from "@/components/sections/SocialProof";
import { StickyCta } from "@/components/sections/StickyCta";
import { Silhueta } from "@/components/ui/Silhueta";

export default function HomePage() {
  return (
    <>
      <Header />

      <main id="conteudo">
        <Hero />
        <SocialProof />

        <Silhueta from="noite" to="creme" />
        <About />
        <Highlights />

        <Clouds />

        <Spaces />

        <Silhueta from="branco" to="noite" />
        <Amenities />

        <Silhueta from="noite" to="creme" />
        <Moments />

        <Silhueta from="creme" to="noite" />
        <Reels />

        <Silhueta from="noite" to="creme" />
        <Reviews />
        <Location />
        <Rules />

        <FinalCta />
      </main>

      <Footer />
      <StickyCta />
    </>
  );
}
