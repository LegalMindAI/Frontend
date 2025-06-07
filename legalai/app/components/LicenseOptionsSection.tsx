"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Check, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const serviceOptions = [
  {
    name: "Basic Research",
    price: "Free",
    icon: <Search className="w-6 h-6" />,
    features: [
      "Case Law Research",
      "Unlimited queries",
      "Basic Legal Analysis",
      "Precedent Identification",
      "Email Support",
      "Standard Response Time (24hrs)",
    ],
    available: true,
  },
  {
    name: "Professional",
    price: "Free",
    icon: <FileText className="w-6 h-6" />,
    features: [
      "Advanced Case Analysis",
      "Unlimited queries",
      "Legal Brief Generation",
      "Similar Case Matching",
      "Priority Support",
      "Real-time Legal Updates",
      "Document Review",
    ],
    popular: true,
    available: true,
  },
  {
    name: "Enterprise",
    price: "Coming Soon",
    icon: <Search className="w-6 h-6" />,
    features: [
      "Unlimited Legal Research",
      "Custom AI Training",
      "Multi-jurisdiction Analysis",
      "Team Collaboration Tools",
      "24/7 Priority Support",
      "API Access",
    ],
    available: false,
  },
  {
    name: "Law Firm",
    price: "Coming Soon",
    icon: <FileText className="w-6 h-6" />,
    features: [
      "White-label Solution",
      "Unlimited Users",
      "Custom Integrations",
      "Dedicated Account Manager",
      "On-premise Deployment",
      "Advanced Analytics",
      "Compliance Reporting",
    ],
    available: false,
  },
];

export default function LicenseOptionsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section ref={ref} id="services" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/20 to-black"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your Legal Plan
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            All our legal research tools are completely free. Access our
            AI-powered legal intelligence at no cost.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceOptions.map((option, index) => (
            <motion.div
              key={option.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.1 },
                },
              }}
              initial="hidden"
              animate={controls}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card
                className={`relative h-full ${
                  hoveredCard === index ? "scale-105" : "scale-100"
                } transition-all duration-300 ${
                  !option.available ? "opacity-60" : ""
                }`}
              >
                <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-br from-white/20 to-white/0">
                  <div className="absolute inset-0 rounded-lg bg-black"></div>
                </div>

                {option.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
                      Most Popular
                    </span>
                  </div>
                )}

                {!option.available && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-zinc-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                )}

                <CardContent className="relative p-6 rounded-lg h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-white/10 mb-4">
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                    <div className="text-3xl font-bold">{option.price}</div>
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-3 mb-6">
                      {option.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            hoveredCard === index ? { opacity: 1, x: 0 } : {}
                          }
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                          <Check className="h-5 w-5 text-white mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm text-zinc-300">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/chat?type=${encodeURIComponent(option.name)}`}>
                    <Button
                      className={`w-full ${
                        option.available
                          ? "bg-white text-black hover:bg-zinc-200"
                          : "bg-zinc-600 text-zinc-300 cursor-not-allowed"
                      } transition-colors cursor-pointer`}
                      disabled={!option.available}
                    >
                      {option.available ? "Get Started Free" : "Coming Soon"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
