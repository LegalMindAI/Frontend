"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Scale, FileText, Search, Award } from "lucide-react"
import About from "../../public/About.jpg"

const achievements = [
  { icon: <Scale className="w-6 h-6" />, label: "Years of Legal Data", value: "50+" },
  { icon: <FileText className="w-6 h-6" />, label: "Cases Analyzed", value: "42,000+" },
  { icon: <Search className="w-6 h-6" />, label: "Legal Precedents", value: "15,000+" },
  { icon: <Award className="w-6 h-6" />, label: "Accuracy Rate", value: "98.7%" },
]

export default function AboutSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} id="about" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div className="grid md:grid-cols-2 gap-12 items-center" style={{ y, opacity }}>
          <div className="relative">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 rounded-3xl transform -rotate-6"></div> */}
            <Image
              src={About}
              alt="drannel"
              width={450}
              height={450}
              className="rounded-3xl relative left-16 z-10 transform -rotate-6"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About LegalAI</h2>
            <p className="text-lg mb-6 text-zinc-300">
              LegalAI is not just another legal research tool; it's your intelligent legal partner. Trained on over
              42,000 cases and decades of legal precedents, our AI assistant provides unparalleled legal research and
              analysis capabilities.
            </p>
            <p className="text-lg mb-8 text-zinc-300">
              From complex case law research to identifying similar cases and legal precedents, LegalAI's advanced
              algorithms ensure that you have access to the most relevant and comprehensive legal information to build
              stronger cases and make informed decisions.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  className="bg-zinc-900/50 rounded-lg p-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-2">
                    <div className="mr-2 text-white">{achievement.icon}</div>
                    <div className="text-2xl font-bold">{achievement.value}</div>
                  </div>
                  <div className="text-sm text-zinc-400">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
