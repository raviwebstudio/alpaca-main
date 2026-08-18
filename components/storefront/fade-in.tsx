"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
  transition,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
        ...transition,
      }}
      className={clsx(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
