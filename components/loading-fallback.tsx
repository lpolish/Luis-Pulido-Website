"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="w-16 h-16 text-white" />
    </motion.div>
  </div>
)

export default LoadingFallback