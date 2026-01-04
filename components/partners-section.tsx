"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Partner {
  _id: string;
  name: string;
  description: string;
  image: string | null;
}

const API_URL = "http://localhost:5000/api/partners";

export default function PartnersSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch partners');
        const data = await res.json();
        setPartners(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // For top row: use original partners without duplication
  // For bottom row: duplicate for seamless marquee effect
  const topRowPartners = partners;
  const bottomRowPartners = partners.length > 0 ? [...partners, ...partners] : [];

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-subtle text-center">
        <div className="text-xl text-muted-foreground">Loading partners...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4 bg-gradient-subtle text-center">
        <div className="text-xl text-destructive">Error: {error}</div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="py-24 px-4 bg-gradient-subtle text-center">
        <div className="text-xl text-muted-foreground">No partners available</div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 bg-gradient-subtle overflow-hidden">
      {/* Decorative Backgrounds */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 rounded-full blur-3xl opacity-60" 
           style={{ background: 'var(--orb-1)' }} />
      <div className="absolute bottom-[15%] left-[-5%] w-80 h-80 rounded-full blur-3xl opacity-40" 
           style={{ background: 'var(--orb-2)' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-semibold tracking-wider bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 text-primary"
          >
            <span className="w-2 h-2 rounded-full animate-pulse bg-gradient-to-r from-primary to-accent" />
            TRUSTED PARTNERS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            Powering Innovation <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Together
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
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
              animate={{ x: isPaused ? '0%' : ['0%', '-100%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', gap: '1.5rem', width: 'fit-content' }}
            >
              {topRowPartners.map((partner) => (
                <motion.div
                  key={`top-${partner._id}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex-shrink-0 w-[280px] bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-border"
                >
                  <div className="relative w-full pb-[75%] overflow-hidden bg-muted">
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-5xl text-muted-foreground">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-card-foreground mb-2">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </motion.div>
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
              {bottomRowPartners.map((partner, i) => (
                <motion.div
                  key={`bottom-${partner._id}-${i}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex-shrink-0 w-[280px] bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-border"
                >
                  <div className="relative w-full pb-[75%] overflow-hidden bg-muted">
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-5xl text-muted-foreground">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-card-foreground mb-2">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Apply to be a Partner Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '4rem',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSerMZNaiiyCLAEPX-E1sWhT4cvQL7TXTUMpBemHmuY60Tw8nw/viewform', '_blank')}
            className="px-10 py-4 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-3 group relative overflow-hidden"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Apply to be a Partner</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:translate-x-1 transition-transform"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <path
                d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
              className="button-overlay"
            />
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        button:hover .button-overlay {
          opacity: 1;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .w-\[280px\] {
            width: 260px !important;
          }
        }

        @media (max-width: 768px) {
          .w-\[280px\] {
            width: 240px !important;
          }
          button {
            padding: 14px 32px !important;
            font-size: 1rem !important;
          }
        }

        @media (max-width: 640px) {
          .w-\[280px\] {
            width: 220px !important;
          }
          button {
            padding: 12px 28px !important;
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </section>
  );
}