"use client";

import React from "react";
import { motion } from "framer-motion";

export function SiriLoading() {
  const bars = Array.from({ length: 5 });

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const getBarVariants = (index: number) => ({
    initial: { opacity: 0.3, scale: 1 },
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.15,
      },
    },
  });

  const colors = [
    "from-purple-500 via-pink-500 to-purple-600",
    "from-pink-500 via-red-500 to-pink-600",
    "from-red-500 via-orange-500 to-red-600",
    "from-blue-500 via-purple-500 to-blue-600",
    "from-cyan-500 via-blue-500 to-cyan-600",
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="flex items-end justify-center gap-1"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {bars.map((_, index) => (
          <motion.div
            key={index}
            variants={getBarVariants(index)}
            className={`w-1 h-12 rounded-full bg-gradient-to-b ${colors[index]}`}
          />
        ))}
      </motion.div>

      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-medium text-muted-foreground"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
