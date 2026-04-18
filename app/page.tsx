"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    );
}
