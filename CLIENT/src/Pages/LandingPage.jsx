import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import Features from '../Components/Features'
import WhyChooseUs from '../Components/WhyChooseUs'
import Footer from '../Components/Footer'

const LandingPage = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <Features />
        <WhyChooseUs/>
        <Footer />
        
        
    </div>
  )
}

export default LandingPage