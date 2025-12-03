"use client";
import AnimatedBackground from "@/app/home/AnimatedBackground";
import Header from "@/app/home/Header";
import HeroSection from "@/app/home/HeroSection";
import FeaturesSection from "@/app/home/FeaturesSection";
import CTASection from "@/app/home/CTASection";
import Footer from "@/app/home/Footer";

export default function Home() {
    return (
        <div className="min-h-screen">
            <AnimatedBackground/>
            <Header/>
            <HeroSection/>
            <FeaturesSection/>
            <CTASection/>
            <Footer/>
        </div>
    );
}
