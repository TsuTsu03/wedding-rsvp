"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, wedding } from "@/lib/content";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Sticky nav that earns its space: transparent over the hero, then condenses
 * and frosts once you scroll past it. Mobile collapses to a quiet sheet.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setScrolled(window.scrollY > 64);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 64;
    setScrolled((current) => (current === next ? current : next));
  });

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Transparent over the dark cinematic hero -> light text; frosted-light when
  // scrolled onto the editorial interior -> dark text.
  const dark = !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className={cn(
          "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
          scrolled
            ? "border-b border-line/80 bg-paper/70 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="shell flex items-center justify-between">
          <motion.a
            href="#top"
            className={cn(
              "font-display tracking-wide transition-colors duration-300",
              dark ? "text-ivory" : "text-ink"
            )}
            animate={{ fontSize: scrolled ? "1.05rem" : "1.2rem" }}
            transition={{ duration: 0.3, ease: easeOut }}
            style={{
              paddingBlock: scrolled ? "0.85rem" : "1.15rem",
            }}
          >
            {wedding.couple.monogram}
          </motion.a>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "group relative text-[0.85rem] transition-colors duration-150",
                    dark ? "text-ivory/70 hover:text-ivory" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-200 ease-out group-hover:w-full",
                      dark ? "bg-ivory" : "bg-ink"
                    )}
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href="#rsvp"
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.82rem] transition-colors duration-150",
                  dark
                    ? "border-ivory/30 text-ivory hover:border-ivory/60 hover:bg-ivory/[0.06]"
                    : "border-ink/25 text-ink hover:border-ink/55 hover:bg-ink/[0.03]"
                )}
              >
                RSVP
              </a>
            </li>
          </ul>

          <button
            className={cn("-mr-2 p-2 transition-colors duration-300 md:hidden", dark ? "text-ivory" : "text-ink")}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-paper md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <div className="shell flex items-center justify-between py-[1.15rem]">
              <span className="font-display text-[1.2rem]">
                {wedding.couple.monogram}
              </span>
              <button
                className="-mr-2 p-2"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <motion.ul
              className="shell mt-8 flex flex-col gap-2"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {[...navLinks, { href: "#rsvp", label: "RSVP" }].map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 font-display text-[1.75rem] text-ink"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
