"use client";

import { Award, Star, Shield, Globe } from "lucide-react";
import content from "../locales/en/content.json";
import Image from "next/image";
import BrandPromise from "./BrandPromise"; 
import YearsOfExcellence from "./YearsOfExcellence";
import Certifications from "./Certifications";

interface Achievement {
  label: string;
  value: string;
}
interface Certification {
  image: string;
  name: string;
  description: string;
}
interface BrandSectionData {
  title: string;
  subtitle: string;
  achievements: Achievement[];
  certifications: Certification[];
}

export default function BrandSection() {
  const page: BrandSectionData = content["brand-section"];

  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 playfair">
            <span className="playfair font-bold text-gradient">
              {page.title}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md sm:max-w-2xl mx-auto text-sm sm:text-base">
            {page.subtitle}
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
          {page.achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-4 sm:p-6 hover-lift shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  {achievement.label === "Years of Excellence" ? (
                    <YearsOfExcellence />
                  ) : (
                    achievement.value
                  )}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <Certifications/>

        {/* Brand Promise */}
        <BrandPromise />
      </div>
    </section>
  );
}
