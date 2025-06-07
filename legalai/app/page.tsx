"use client"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import LicenseOptionsSection from "./components/LicenseOptionsSection"
import AboutSection from "./components/AboutSection"
import Footer from "./components/Footer"
import InteractiveBackground from "./components/InteractiveBackground"

export default function Home() {
  return (
    <div className="min-h-screen text-white relative">
      <InteractiveBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4">
          <HeroSection />
          <FeaturesSection />
          <LicenseOptionsSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
