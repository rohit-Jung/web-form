import { ComicIssueTag, colors, SectionDivider } from "@/lib/design-system"
import { LandingNav } from "@/components/landing/landing-nav"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsBar } from "@/components/landing/stats-bar"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: colors.starkCream }}
    >
      <ComicIssueTag
        issue="#001"
        title="THE AMAZING WEBFORM"
        price="12¢"
        month="MAY 2024"
      />
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <SectionDivider text="✦  MEANWHILE, SOMEWHERE IN CYBERSPACE...  ✦" />
      <FeaturesSection />
      <SectionDivider
        text="✦  LATER, AT WEBFORM HEADQUARTERS...  ✦"
        bg={colors.marvelBlue}
      />
      <HowItWorksSection />
      <SectionDivider text="✦  AND THE CROWD GOES WILD...  ✦" />
      <TestimonialsSection />
      <SectionDivider text="✦  THE FINAL CHAPTER...  ✦" bg={colors.spiderRed} />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
