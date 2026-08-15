import React from "react";
import Hero from "../components/Hero.js";
import Bestseller from "../components/Bestseller.js";
import About from "../components/About.js";
import NewArrivals from "../components/NewArrivals.js";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Bestseller />
      <About />
      <NewArrivals />
    </div>
  );
}
