'use client';

import React, { useState, useEffect } from 'react';
import { AlebrijesGallery } from '@/components/alebrijes-gallery';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

const menuItems = [
  { name: "Fresh Health News", path: "https://medicaldevs.com" },
  { name: "Alebrijes Gallery", path: "/alebrijes" },
  { name: "X", path: "https://twitter.com/pulidoman" },
  { name: "Instagram", path: "https://instagram.com/lu1s0n1" },
  { name: "LinkedIn", path: "https://linkedin.com/in/lpulido" },
  { name: "Linktree", path: "https://linktr.ee/polishai" },
  { name: "GitHub", path: "https://github.com/lpolish" },
  { name: "Github alt", path: "https://github.com/africanmx" },
  { name: "Pair Programming", path: "https://calendar.google.com/calendar/appointments/AcZssZ1x_Avc7CEO0ABnqDxWR8vuSoZ9SwKV3llSUu4=?gv=true" },
];

export default function AlebrijesPage() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [isScrollingUp, setIsScrollingUp] = React.useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${isScrollingUp ? 'bg-black bg-opacity-60 py-2' : 'bg-black bg-opacity-40 py-1'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className={`${isScrollingUp ? 'text-xl sm:text-2xl' : 'text-md sm:text-xl'} font-bold cursor-default transition-all text-gray-100 hover:text-white`}>
            Alebrijes, by <Link href="/">Luis Pulido</Link>
          </h1>
          <Button onClick={() => setMenuOpen(!menuOpen)} variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className={`relative left-0 right-0 z-10 transition-all duration-300 ${isScrollingUp ? 'visible' : 'hidden'}`}>
          <div className="container mx-auto px-4 py-2 text-white">
            <p className="uppercase text-2xs text-left">
              Some of the alebrijes I have been working on every now and then using different generative models. I hope you like them. <br/><a className="hover:underline cursor-pointer" onClick={(e) => { e.preventDefault(); setShowContactForm(true) }}>Contact me if you want them in canvas shipped to your door.</a> <br /><br />
              <a className="hover:underline cursor-pointer text-2xs" onClick={(e) => { e.preventDefault(); setShowContactForm(true) }}>Contact Me to Build your Next Website</a> or <a className="hover:underline cursor-pointer text-2xs" href="https://calendar.google.com/calendar/appointments/AcZssZ1x_Avc7CEO0ABnqDxWR8vuSoZ9SwKV3llSUu4=?gv=true" target="_blank" rel="noopener noreferrer">Book a Pair Session with Me</a>.
            </p>
          </div>
        </div>
        {menuOpen && (
          <AnimatePresence>
            {menuOpen && (
              <div className="z-[99999999]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed top-0 left-0 w-full h-full text-center pb-[72rem] items-center justify-center bg-black bg-opacity-95 p-4 z-[99999999]"
                >
                  <X className="h-6 w-6 absolute top-4 right-4 cursor-pointer" onClick={() => setMenuOpen(false)} />
                  <br/><br/>
                  {menuItems.map((item) => (
                    <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-blue-300 transition-colors mb-4 md:mb-8">
                      {item.name}
                    </a>
                  ))}
                  <button onClick={() => {setMenuOpen(false); setShowContactForm(true)}} className="block py-2 hover:text-blue-300 transition-colors mx-auto">
                    Contact
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        )}
        <AnimatePresence>
          {showContactForm &&
            (
              <div className="mt-[54rem] z-[999999]">
                <ContactForm onClose={() => setShowContactForm(false)} />
              </div>
            )
          }
        </AnimatePresence>
      </header>
      <AlebrijesGallery />
    </>
  );
};
