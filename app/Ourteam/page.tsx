"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';
import Navbar from '@/components/navbar';

const teamMembers = [
  {
    name: "Prasad Menon",
    designation: "CEO - CIBA",
    linkedin: "linkedin.com/in/menonprasad",
    imagePath: "/Prasad sir.jpg"
  },
  {
    name: "Sindhu Nair",
    designation: "Head of Finance & Admin",
    linkedin: "linkedin.com/in/sindhunairfaa",
    imagePath: "/Sindhu.jpg"
  },
  {
    name: "Sagar Ranshoor",
    designation: "Head of Incubation",
    linkedin: "linkedin.com/in/sagar-ranshoor",
    imagePath: "/Sagar.jpg"
  },
  {
    name: "Saurabh Mirashi",
    designation: "Digital Marcom Manager",
    linkedin: "linkedin.com/in/saurabh-mirashi-54b3561b5",
    imagePath: "/Saurabh.jpg"
  },
  {
    name: "Akshaya Choughule",
    designation: "Center Admin",
    linkedin: "linkedin.com/in/akshaya-posam-61846bb8",
    imagePath: "/Akshaya.jpg"
  },
  {
    name: "Radhika Nikalje",
    designation: "Facility Executive",
    linkedin: null,
    imagePath: "/Radhika.jpg"
  }
];

export default function OurTeamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handleThumbnailClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const currentMember = teamMembers[currentIndex];

  return (
    <>
      <Navbar />
      <div className="h-screen bg-background overflow-hidden flex flex-col">
        {/* Compact Header */}
        <div className="text-center pt-4 pb-3">
          <h1 className="text-3xl font-bold text-primary mb-1">Meet Our Team</h1>
          <p className="text-sm text-muted-foreground">
            The passionate individuals driving innovation at CIBA
          </p>
        </div>

        {/* Main Content - Centered and Compact */}
        <div className="flex-1 flex items-center justify-center px-8 pb-4">
          <div className="max-w-6xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Information */}
              <div className="flex flex-col justify-center space-y-4">
                <div>
                  <h2 className="text-4xl font-bold text-foreground mb-2 leading-tight">
                    {currentMember.name}
                  </h2>
                  <div className="h-1 w-20 bg-primary rounded-full mb-3"></div>
                  <p className="text-xl text-primary font-semibold mb-6">
                    {currentMember.designation}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {currentMember.linkedin && (
                    <a
                      href={`https://${currentMember.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 text-sm font-medium"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  )}

                  {/* Navigation Arrows */}
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrevious}
                      className="p-3 bg-card border border-border rounded-full hover:bg-primary/10 transition-all"
                      aria-label="Previous member"
                    >
                      <ChevronLeft className="w-5 h-5 text-primary" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-3 bg-card border border-border rounded-full hover:bg-primary/10 transition-all"
                      aria-label="Next member"
                    >
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Compact Image */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-80 h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl overflow-hidden shadow-xl">
                  {imageError[currentIndex] ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-5xl font-bold text-primary">
                          {currentMember.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground px-4 text-center">
                        Image not available
                      </p>
                    </div>
                  ) : (
                    <img
                      src={currentMember.imagePath}
                      alt={currentMember.name}
                      onError={() => handleImageError(currentIndex)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Compact Thumbnails */}
        <div className="pb-6 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Thumbnails */}
            <div className="flex items-center justify-center gap-4 mb-3">
              {teamMembers.map((member, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    index === currentIndex
                      ? 'scale-110'
                      : 'scale-90 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`relative w-14 h-14 rounded-full overflow-hidden transition-all ${
                        index === currentIndex
                          ? 'ring-3 ring-primary shadow-lg'
                          : 'ring-2 ring-border'
                      }`}
                    >
                      {imageError[index] ? (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                          <span className={`text-xl font-bold ${
                            index === currentIndex ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={member.imagePath}
                          alt={member.name}
                          onError={() => handleImageError(index)}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className={`text-xs font-medium ${
                      index === currentIndex ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {member.name.split(' ')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-1.5 bg-border hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}