"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

const partners = [
  { 
    id: 1, 
    name: 'InnoVentures', 
    img: 'https://picsum.photos/seed/tech1/600/400', 
    website: 'https://innoventures.example.com' 
  },
  { 
    id: 2, 
    name: 'TechNova Labs', 
    img: 'https://picsum.photos/seed/startup2/600/400', 
    website: 'https://technovalabs.example.com' 
  },
  { 
    id: 3, 
    name: 'FutureScale', 
    img: 'https://picsum.photos/seed/software3/600/400', 
    website: 'https://futurescale.example.com' 
  },
  { 
    id: 4, 
    name: 'NextGen Capital', 
    img: 'https://picsum.photos/seed/finance4/600/400', 
    website: 'https://nextgencapital.example.com' 
  },
  { 
    id: 5, 
    name: 'Quantum Ventures', 
    img: 'https://picsum.photos/seed/innovation5/600/400', 
    website: 'https://quantumventures.example.com' 
  },
  { 
    id: 6, 
    name: 'BlueHorizon Fund', 
    img: 'https://picsum.photos/seed/investment6/600/400', 
    website: 'https://bluehorizon.example.com' 
  },
  { 
    id: 7, 
    name: 'PrimeInvest Group', 
    img: 'https://picsum.photos/seed/corporate7/600/400', 
    website: 'https://primeinvest.example.com' 
  },
  { 
    id: 8, 
    name: 'Stellar Partners', 
    img: 'https://picsum.photos/seed/business8/600/400', 
    website: 'https://stellarpartners.example.com' 
  },
];

const marqueePartners = [...partners, ...partners];

export default function PartnersSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        padding: '6rem 1rem', // Reduced vertical padding a bit
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Backgrounds */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '-5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <motion.div style={{ y, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              borderRadius: '50px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '1.5rem',
              fontSize: '0.8rem', // Slightly smaller badge
              fontWeight: '600',
              color: '#1E40AF',
              letterSpacing: '0.5px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            TRUSTED PARTNERS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', // Slightly smaller heading
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
            }}
          >
            Powering Innovation <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Together
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '1rem', // Smaller description
              color: '#64748B',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.7',
            }}
          >
            Collaborating with leading global innovators to accelerate growth and inspire impactful change.
          </motion.p>
        </div>

        {/* Marquee Section */}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Row */}
          <div
            style={{
              overflow: 'hidden',
              marginBottom: '2.5rem',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <motion.div
              animate={{ x: isPaused ? '0%' : ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', gap: '1.5rem', width: 'fit-content' }}
            >
              {marqueePartners.map((partner, i) => (
                <motion.a
                  key={`top-${i}`}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    flexShrink: 0,
                    width: '280px', // Reduced from 320px
                    background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={partner.img}
                      alt={partner.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <h3
                      style={{
                        fontWeight: '600',
                        fontSize: '1.125rem', // Reduced from 1.25rem
                        color: '#1e293b',
                      }}
                    >
                      {partner.name}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div
            style={{
              overflow: 'hidden',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <motion.div
              animate={{ x: isPaused ? '0%' : ['-50%', '0%'] }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', gap: '1.5rem', width: 'fit-content' }}
            >
              {[...marqueePartners].reverse().map((partner, i) => (
                <motion.a
                  key={`bottom-${i}`}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    flexShrink: 0,
                    width: '280px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={partner.img}
                      alt={partner.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <h3
                      style={{
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        color: '#1e293b',
                      }}
                    >
                      {partner.name}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        a:hover img {
          transform: scale(1.08);
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          motion.a {
            width: 260px !important;
          }
        }

        @media (max-width: 768px) {
          motion.a {
            width: 240px !important;
          }
        }

        @media (max-width: 640px) {
          motion.a {
            width: 220px !important;
          }
        }
      `}</style>
    </section>
  );
}