import { useState } from 'react'
import Nav from './components/partials/nav'
import Hero from './components/Hero/hero'
import AdminLogin from "../src/admin/pages/AdminLogin.jsx";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav/>
    <Hero/>
  
    </>
  )
}

export default App
