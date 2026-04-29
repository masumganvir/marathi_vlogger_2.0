import { useState } from "react";
import Loader from "@/components/Loader";
import Navigation from "@/components/Navigation";
import SideMenu from "@/components/SideMenu";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Packages from "@/components/Packages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  return (
    <>
      <Loader />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navigation menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Stats />
        <Testimonials />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
