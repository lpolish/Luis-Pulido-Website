'use client';

import React, { useState, useEffect } from 'react';
import { AlebrijesGallery } from '@/components/alebrijes-gallery';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

const menuItems = [
  { name: "Home", path: "/" },
  { name: "SummaQ QMS (Spanish)", path: "https://summaq.com" },
  { name: "Alebrijes", path: "/alebrijes" },
  { name: "X", path: "https://twitter.com/pulidoman" },
  { name: "Instagram", path: "https://instagram.com/polishaii" },
  { name: "Audio Visualizers", path: "/audio-visualizers" },
  { name: "GitHub", path: "https://github.com/lpolish" },
  { name: "Github alt", path: "https://github.com/africanmx" },
  { name: "Other Links", path: "https://linktr.ee/polishai" },
];

export default function AlebrijesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const menuVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${isScrollingUp ? 'bg-black bg-opacity-60 py-2' : 'bg-black bg-opacity-40 py-1'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className={`${isScrollingUp ? 'text-md sm:text-xl' : 'text-sm sm:text-md'} font-bold cursor-default transition-all text-gray-100 hover:text-white`}>
            <Link href="/" className='hover:underline'>Luis Pulido</Link> / Alebrijes Gallery
          </h1>
          <Button 
            onClick={() => setMenuOpen(!menuOpen)} 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white hover:bg-opacity-20 transition-colors z-[100000000]"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <div className={`relative left-0 right-0 z-10 transition-all duration-300 ${isScrollingUp ? 'visible' : 'hidden'}`}>
          <div className="container mx-auto px-4 py-1 text-white">
            <p className="uppercase text-2xs text-left">
              <a className="hover:underline cursor-pointer text-2xs" onClick={(e) => { e.preventDefault(); setShowContactForm(true) }}>order prints or expo sets</a>
            </p>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-[99999999] overflow-y-auto"
          >
            <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-20 relative">
              <Button 
                onClick={() => setMenuOpen(false)} 
                variant="ghost" 
                size="icon"
                className="absolute top-2 right-4 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="h-6 w-6" />
              </Button>
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-3 text-2xl text-slate-50 hover:text-white transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.button
                onClick={() => { setMenuOpen(false); setShowContactForm(true) }}
                className="mt-6 py-3 text-2xl text-slate-50 hover:text-white transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: menuItems.length * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <ContactForm onClose={() => setShowContactForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="bg-black pt-20">
        <AlebrijesGallery />
      </main>
    </>
  );
}
