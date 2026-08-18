"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

type InteractiveSiteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
  aspectRatioClassName?: string;
};

export function InteractiveSiteImage({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes,
  priority = false,
  className = "object-cover",
  containerClassName,
  children,
  aspectRatioClassName,
}: InteractiveSiteImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1.03 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !containerRef.current) return;
      if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

      const rect = containerRef.current.getBoundingClientRect();
      const rectWidth = rect.width;
      const rectHeight = rect.height;

      // Cursor position relative to center (-0.5 to +0.5)
      const mouseX = (e.clientX - rect.left) / rectWidth - 0.5;
      const mouseY = (e.clientY - rect.top) / rectHeight - 0.5;

      // Refined micro-tilt (±1.5° rotation, ±6px translation, 1.025-1.03 scale)
      const rotateY = mouseX * 3;
      const rotateX = -mouseY * 3;
      const x = mouseX * 8;
      const y = mouseY * 8;

      setTilt({ rotateX, rotateY, x, y, scale: 1.03 });
    },
    [shouldReduceMotion],
  );

  const handleMouseEnter = () => {
    if (!shouldReduceMotion && typeof window !== "undefined" && !window.matchMedia("(hover: none)").matches) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1.03 });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={clsx("relative overflow-hidden", aspectRatioClassName, containerClassName)}
    >
      <motion.div
        initial={shouldReduceMotion ? { scale: 1, x: 0, y: 0 } : { scale: 1, x: 0, y: 0 }}
        whileInView={shouldReduceMotion ? { scale: 1 } : { scale: 1.03 }}
        animate={
          shouldReduceMotion
            ? { scale: 1, rotateX: 0, rotateY: 0, x: 0, y: 0 }
            : isHovered
            ? {
                scale: tilt.scale,
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                x: tilt.x,
                y: tilt.y,
              }
            : {
                scale: 1.03,
                rotateX: 0,
                rotateY: 0,
                x: 0,
                y: 0,
              }
        }
        viewport={{ once: true, amount: 0.15 }}
        transition={
          isHovered
            ? {
                type: "spring",
                stiffness: 280,
                damping: 24,
                mass: 0.8,
              }
            : {
                scale: { duration: 6, ease: [0.16, 1, 0.3, 1] },
                rotateX: { duration: 0.45, ease: "easeOut" },
                rotateY: { duration: 0.45, ease: "easeOut" },
                x: { duration: 0.45, ease: "easeOut" },
                y: { duration: 0.45, ease: "easeOut" },
              }
        }
        className="relative w-full h-full will-change-transform"
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={clsx("pointer-events-none select-none", className)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            className={clsx("pointer-events-none select-none", className)}
          />
        )}
      </motion.div>
      {children}
    </motion.div>
  );
}
