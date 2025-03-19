import React from 'react'
import Hero from '../components/Hero/hero'
import Navbar from '../components/partials/nav'
import Featured from '../components/featuredbooks'
import QuotesSection from '../components/QuotesSection'
import CategorySlider from '../components/Categoryslider'
function HomePage() {
  return (
    <>
    <Navbar />
    <Hero />
    <Featured/>
    <QuotesSection/>
    <CategorySlider/>
    </>
  )
}

export default HomePage