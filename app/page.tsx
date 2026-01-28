import Navbar from "@/components/navbar"
import HeroVideo from "@/components/hero-video"
import Hero from "@/components/hero"
import Testimonials from "@/components/testimonials"
import Programs from "@/components/programs"
import Gallery from "@/components/gallery"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"
import AnimatedSection from "@/components/animated-section"
import FloatingWhatsApp from "@/components/FloatingWhatsapp"
import SectionTabsWithTour from "@/components/section-tabs"

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-subtle scroll-smooth overflow-x-hidden scrollbar-hide">
        {/* Video Hero Section */}
        <section id="home">
          <HeroVideo />
        </section>

        {/* Animated Sections */}
        <section id="about" className="overflow-x-hidden">
          <AnimatedSection direction="up">
            <Hero />
          </AnimatedSection>
        </section>

        {/* MAGIC Navigation Section with WorkHub (Tour) integrated */}
        <SectionTabsWithTour />

        <section id="testimonials" className="overflow-x-hidden">
          <AnimatedSection direction="left" delay={0.1}>
            <Testimonials />
          </AnimatedSection>
        </section>

        {/* G - Gallery */}
        <section id="gallery" className="overflow-x-hidden">
          <AnimatedSection direction="left" delay={0.1}>
            <Gallery />
          </AnimatedSection>
        </section>

        {/* I - Impact (Partners & Programs) */}
        <section id="impact" className="overflow-x-hidden">
          <AnimatedSection direction="up" delay={0.1}>
            <Programs />
          </AnimatedSection>
        </section>

        {/* C - CIBA News (Newsletter) */}
        <section id="ciba-news" className="overflow-x-hidden">
          <AnimatedSection direction="right" delay={0.1}>
            <Newsletter />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="up" delay={0.1}>
            <Footer />
          </AnimatedSection>
        </section>
      </main>

      {/* FAQ Chatbot - Floats on top of everything */}
      <FloatingWhatsApp />
    </>
  )
}