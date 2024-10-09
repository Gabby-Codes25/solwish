"use client"

import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/heroSection";


export default function Home() {
  return (
    <div className="min-w-full">
      <div className="w-full h-full">
        <div>
          <HeroSection />
        </div>
      </div>
    </div>
  );
}
