"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] before:absolute before:inset-0 before:rounded-2xl sm:before:rounded-3xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:pointer-events-none relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="text-center sm:text-left mb-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 justify-center sm:justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">
                    P
                  </span>
                </div>
                <span className="text-white/90 font-semibold text-base sm:text-lg tracking-tight">
                  PitchSpeak
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm mx-auto sm:mx-0">
                Transform your ideas into precise project estimates through
                natural voice conversations powered by advanced AI.
              </p>

              {/* Social Links */}
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                {[
                  {
                    icon: "/x-2.svg",
                    name: "X",
                    href: "#",
                  },
                  {
                    icon: "/linkedin-icon-2.svg",
                    name: "LinkedIn",
                    href: "#",
                  },
                  {
                    icon: "/github-icon-1.svg",
                    name: "GitHub",
                    href: "#",
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={
                      "size-8 bg-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border"
                    }
                  >
                    <img
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Grid - 2 columns on mobile, 3 on larger screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-8">
              {/* Product Links */}
              <div className="text-center sm:text-left">
                <h3 className="text-white/90 font-medium text-sm mb-4 sm:mb-6 tracking-tight">
                  Product
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: "Features", href: "/features" },
                    { name: "Pricing", href: "/pricing" },
                    { name: "API", href: "/api" },
                    { name: "Integrations", href: "/integrations" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-white/60 hover:text-white/90 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Company Links */}
              <div className="text-center sm:text-left">
                <h3 className="text-white/90 font-medium text-sm mb-4 sm:mb-6 tracking-tight">
                  Company
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: "About", href: "/about" },
                    { name: "Blog", href: "/blog" },
                    { name: "Careers", href: "/careers" },
                    { name: "Contact", href: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-white/60 hover:text-white/90 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support Links */}
              <div className="text-center sm:text-left col-span-2 lg:col-span-1">
                <h3 className="text-white/90 font-medium text-sm mb-4 sm:mb-6 tracking-tight">
                  Support
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: "Help Center", href: "/help" },
                    { name: "Documentation", href: "/docs" },
                    { name: "Status", href: "/status" },
                    { name: "Community", href: "/community" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-white/60 hover:text-white/90 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              viewport={{ once: true }}
              className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-white/10"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                <div className="text-center md:text-left w-full md:w-auto">
                  <h3 className="text-white/90 font-medium text-sm mb-2 tracking-tight">
                    Stay Updated
                  </h3>
                  <p className="text-white/60 text-sm">
                    Get notified about new features and AI improvements.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 sm:w-48 md:w-64 px-3 sm:px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white/90 placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent backdrop-blur-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 sm:px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-medium tracking-tight transition-all duration-200 whitespace-nowrap"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 mt-6 sm:mt-8 text-sm text-white/50"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center justify-center">
            <Link
              href="/privacy"
              className="hover:text-white/70 transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white/70 transition-colors whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white/70 transition-colors whitespace-nowrap"
            >
              Cookie Policy
            </Link>
          </div>
          <p className="text-center">
            © {new Date().getFullYear()} PitchSpeak. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
