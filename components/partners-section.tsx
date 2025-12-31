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
      <section
        style={{
          padding: '6rem 1rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.25rem', color: '#64748B' }}>Loading partners...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          padding: '6rem 1rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.25rem', color: '#EF4444' }}>Error: {error}</div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section
        style={{
          padding: '6rem 1rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.25rem', color: '#64748B' }}>No partners available</div>
      </section>
    );
  }

  return (
    <section
      style={{
        position: 'relative',
        padding: '6rem 1rem',
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
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
              fontSize: '0.8rem',
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
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
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
              fontSize: '1rem',
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
              animate={{ x: isPaused ? '0%' : ['0%', '-100%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', gap: '1.5rem', width: 'fit-content' }}
            >
              {topRowPartners.map((partner) => (
                <motion.div
                  key={`top-${partner._id}`}
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
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden', background: '#f1f5f9' }}>
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: '#cbd5e1',
                      }}>
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3
                      style={{
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {partner.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#64748B',
                        lineHeight: '1.5',
                      }}
                    >
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
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden', background: '#f1f5f9' }}>
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: '#cbd5e1',
                      }}>
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3
                      style={{
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {partner.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#64748B',
                        lineHeight: '1.5',
                      }}
                    >
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
            style={{
              padding: '16px 40px',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Apply to be a Partner</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
          div[style*="width: 280px"] {
            width: 260px !important;
          }
        }

        @media (max-width: 768px) {
          div[style*="width: 280px"] {
            width: 240px !important;
          }
          button {
            padding: 14px 32px !important;
            font-size: 1rem !important;
          }
        }

        @media (max-width: 640px) {
          div[style*="width: 280px"] {
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