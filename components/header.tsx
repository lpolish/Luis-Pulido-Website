'use client';

import React, { useState, useEffect } from "react";
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { ContactForm } from './contact-form';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Hacker News and Tasks", path: "https://www.hackeroso.com" },
    { name: "Alebrijes", path: "/alebrijes" },
    { name: "Audio Visualizers", path: "/audio-visualizers" },
    { name: "X", path: "https://twitter.com/pulidoman" },
    { name: "Instagram", path: "https://instagram.com/lu1s0n1" },
    { name: "Chrome Extensions", path: "https://chromewebstore.google.com/search/Luis%20Pulido" },
    { name: "Linktree", path: "https://linktr.ee/polishai" },
    { name: "GitHub", path: "https://github.com/lpolish" },
    { name: "Github alt", path: "https://github.com/africanmx" },
  ];

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${isScrollingUp ? 'bg-black bg-opacity-60 py-2' : 'bg-black bg-opacity-40 py-1'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className={`${isScrollingUp ? 'text-xl sm:text-2xl' : 'text-md sm:text-xl'} font-bold cursor-default transition-all text-gray-100 hover:text-white`}>
          <Link href="/">Luis Pulido Díaz</Link>
        </h1>
        <Button onClick={() => setMenuOpen(!menuOpen)} variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className={`relative left-0 right-0 z-10 transition-all duration-300 ${isScrollingUp ? 'visible' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-2 text-white">
          <p className="uppercase sm:text-2xs text-left">
            <a className="hover:underline cursor-pointer text-2xs" href="/contact">Contact Me to Build Your Next Web Project</a> or <a className="hover:underline cursor-pointer text-2xs" href="https://cal.com/luis-pulido" target="_blank" rel="noopener noreferrer">Book a Pair Programming Session</a>
          </p>
        </div>
      </div>
      {menuOpen && (
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-95 text-white px-12 pb-12 pt-12 md:pt-36 backdrop-blur-md text-center"
            >
              <X className="h-6 w-6 absolute top-4 right-4 cursor-pointer" onClick={() => setMenuOpen(false)} />
              {menuItems.map((item) => (
                <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-blue-300 transition-colors mb-4 md:mb-8">
                  {item.name}
                </a>
              ))}
              <button onClick={() => setShowContactForm(true)} className="block py-2 hover:text-blue-300 transition-colors mx-auto">
                Contact
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AnimatePresence>
        {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
      </AnimatePresence>
    </header>
  );
}
