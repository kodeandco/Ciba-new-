import Navbar from "@/components/navbar"
import HeroVideo from "@/components/hero-video"
import Hero from "@/components/hero"
import Testimonials from "@/components/testimonials"
import Programs from "@/components/programs"
import Gallery from "@/components/gallery"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"
import AnimatedSection from "@/components/animated-section"
import TourSection from "@/components/tour-section"
import MentorsSection from "@/components/mentors-section"
import StartupsSection from "@/components/startups-section"
import PartnersSection from "@/components/partners-section"
import FAQChatbot from "@/components/faq_chatbot"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-subtle scroll-smooth overflow-x-hidden scrollbar-hide">
        {/* Video Hero Section */}
        <HeroVideo />

        {/* Animated Sections */}
        <section className="overflow-x-hidden">
          <AnimatedSection direction="up">
            <Hero />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="left" delay={0.1}>
            <Testimonials />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <TourSection />
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="right" delay={0.1}>
            <MentorsSection />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="up" delay={0.1}>
            <StartupsSection />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="left" delay={0.1}>
            <PartnersSection />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="up" delay={0.1}>
            <Programs />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
          <AnimatedSection direction="left" delay={0.1}>
            <Gallery />
          </AnimatedSection>
        </section>

        <section className="overflow-x-hidden">
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
      <FAQChatbot />
    </>
  )
}