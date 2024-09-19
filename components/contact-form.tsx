'use client';

import React, { useState } from "react"

import { Button } from './ui/button';
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  onClose: () => void
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSubmitted(true)
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isSubmitted ? "Thank You!" : "Contact Me"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg mb-4">Thanks for your message!</p>
              <p>I&apos;ll get back to you as soon as possible.</p>
              <Button onClick={onClose} className="mt-6">
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="contact-form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <Input id="name" name="name" type="text" placeholder="Your name" required className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="Your email" required className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <Textarea id="message" name="message" placeholder="Your message" required className="bg-gray-800 border-gray-700 text-white" />
              </div>
              {submitError && <p className="text-red-500" role="alert">{submitError}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}