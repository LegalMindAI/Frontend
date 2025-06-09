"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Brain, Scale, Shield } from "lucide-react"
import { useInView } from "react-intersection-observer"

const features = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Advanced Case Research",
    description:
      "Search through 42,000+ cases with AI-powered semantic search. Find relevant precedents and similar cases instantly.",
    stats: "42,000+ Cases",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Legal Analysis",
    description: "Get comprehensive legal analysis powered by machine learning trained on decades of legal data.",
    stats: "98.7% Accuracy",
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Precedent Matching",
    description: "Identify similar cases and legal precedents that strengthen your arguments and legal strategy.",
    stats: "15,000+ Precedents",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure & Confidential",
    description: "Enterprise-grade security ensures your legal research and client information remains protected.",
    stats: "Bank-level Security",
  },
]

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <section id="features" className="py-20 relative" ref={ref}>
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Powerful Legal Features</h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Comprehensive AI-powered legal tools designed to enhance your research capabilities and streamline your
            legal practice. All features are completely free.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="bg-zinc-900/50 border-white/10 hover:border-white/20 transition-all duration-300 h-full backdrop-blur-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">{feature.icon}</div>
                    <span className="text-sm font-semibold text-zinc-400 bg-white/5 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 mb-6">{feature.description}</p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={hoveredCard === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-lg px-8 py-6 rounded-full">
            <a href="#contact" className="scroll-smooth">
              Try All Features Free
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
