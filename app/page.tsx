import Navbar from "@/components/navbar"
import HeroVideo from "@/components/hero-video"
import Hero from "@/components/hero"
import Testimonials from "@/components/testimonials"
import StartupCards from "@/components/startup-cards"
import Programs from "@/components/programs"
import Gallery from "@/components/gallery"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"
import AnimatedSection from "@/components/animated-section"
import TourSection from "@/components/tour-section"
import MentorsSection from "@/components/mentors-section"
import StartupsSection from "@/components/startups-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-subtle scroll-smooth">
      <Navbar />

      {/* Video Hero Section */}
      <HeroVideo />

      {/* Animated Sections with Scroll Snapping */}
      <div className="snap-y snap-mandatory overflow-y-scroll">
        <section className="snap-start">
          <AnimatedSection direction="up">
            <Hero />
          </AnimatedSection>
        </section>

        <section className="snap-start">
          <AnimatedSection direction="left" delay={0.1}>
            <Testimonials />
          </AnimatedSection>
        </section>

        <section className="snap-start">
          <TourSection />
        </section>

        <section className="snap-start">
          <MentorsSection />
        </section>

        <section className="snap-start">
          <StartupsSection />
        </section>

        <section className="snap-start">
          <AnimatedSection direction="right" delay={0.1}>
            <StartupCards />
          </AnimatedSection>
        </section>

        <section className="snap-start">
          <AnimatedSection direction="up" delay={0.1}>
            <Programs />
          </AnimatedSection>
        </section>

        <section className="snap-start">
          <AnimatedSection direction="left" delay={0.1}>
            <Gallery />
          </AnimatedSection>
        </section>

        <section className="snap-start">
          <AnimatedSection direction="right" delay={0.1}>
            <Newsletter />
          </AnimatedSection>
        </section>

        <section className="snap-start">
          <AnimatedSection direction="up" delay={0.1}>
            <Footer />
          </AnimatedSection>
        </section>
      </div>
    </main>
  )
}
