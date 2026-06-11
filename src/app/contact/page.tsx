"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Mail,
  MessageSquare,
  Send,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Linkedin,
  Twitter,
  ArrowLeft
} from "lucide-react";

// Force HMR recompile
export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <Container>
          {/* Back Button */}
          <motion.div
            className="max-w-4xl mx-auto flex justify-start mb-8"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </motion.div>
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Contact Us
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions about cognitive games or placement preparation? We're here to help! Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </Container>

        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all group text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send us an email and we'll respond within 24-48 hours
                  </p>
                  <a
                    href="mailto:blyncgames@gmail.com"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    blyncgames@gmail.com
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all group text-center">
                <CardContent className="pt-8 pb-8 flex flex-col items-center h-full justify-between">
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                      <Instagram className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Social Media</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Follow us on social media for updates and resources
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-auto">
                    <a
                      href="https://instagram.com/blyncgames"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                    <a
                      href="https://linkedin.com/in/nishuldhakar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                    <a
                      href="https://twitter.com/nishuldhakar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Twitter className="h-4 w-4" /> Twitter
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all group text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We typically respond to all inquiries within
                  </p>
                  <p className="text-primary font-medium text-sm">
                    24-48 hours
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <p className="text-center text-muted-foreground mb-8">
                  Before reaching out, check if your question is already answered in our comprehensive FAQ section.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground mb-3">Common Questions:</h3>
                    <div className="space-y-2">
                      <a href="/#faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → How do the cognitive games work?
                      </a>
                      <a href="/#faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → What companies use these tests?
                      </a>
                      <a href="/#faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → How long should I practice?
                      </a>
                      <a href="/#faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → Is the platform free to use?
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground mb-3">Resources:</h3>
                    <div className="space-y-2">
                      <a href="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → Read our blog articles
                      </a>
                      <a href="/how-it-works" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → Learn how it works
                      </a>
                      <a href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → About our platform
                      </a>
                      <a href="/games/memory" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        → Start practicing
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <a
                    href="/#faq"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                  >
                    View All FAQs
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Support Topics */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-primary/5">
        <Container className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Can We Help You With?</h2>
            <p className="text-lg text-muted-foreground">
              Here are some topics we commonly assist students with
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Game & Platform Support",
                items: [
                  "Technical issues with games",
                  "Account-related questions",
                  "Progress tracking concerns",
                  "Browser compatibility"
                ]
              },
              {
                title: "Preparation Guidance",
                items: [
                  "Study strategies and tips",
                  "Recommended practice duration",
                  "Game-specific advice",
                  "Score improvement strategies"
                ]
              },
              {
                title: "Company-Specific Info",
                items: [
                  "Capgemini assessment details",
                  "Cognizant game formats",
                  "Test pattern information",
                  "Placement preparation timeline"
                ]
              },
              {
                title: "Feedback & Suggestions",
                items: [
                  "Feature requests",
                  "Bug reports",
                  "Content suggestions",
                  "General platform feedback"
                ]
              }
            ].map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-card/40 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">{topic.title}</h3>
                    <ul className="space-y-2">
                      {topic.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
