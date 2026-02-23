"use client";

import Container from "../common/Container";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MorphingText } from "@/components/ui/morphing-text"
import { DotPattern } from "../ui/dot-pattern";


export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* <Image
        src="/bg.jpg"
        alt="Nishul"
        fill
        className="object-cover"
        priority
        quality={180}
      /> */}
      {/* <DotPattern /> */}

      <div className="relative z-10 mt-20 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

        {/* <motion.a
            href="https://www.nishul.dev/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-3 rounded-full 
               backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-foreground
              hover:bg-secondary/50 hover:scale-[1.02] transition-all cursor-pointer"
          > */}
        {/* <div className="mb-6 flex items-center gap-3 rounded-full 
                px-4 py-1.5 text-sm font-medium text-foreground
              hover:bg-secondary/10 hover:scale-[1] transition-all cursor-pointer">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-primary/20">
              <Image
                src="/image2.png"
                alt="Nishul"
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </div>

            <span className="pr-1 font-bold font-game">By Nishul</span>
            </div>   */}
        {/* </motion.a> */}



        <motion.h1
          className="text-4xl md:text-6xl mt-6 lg:text-7xl text-center font-bold tracking-tight text-foreground mb-6 leading-tight flex flex-col md:flex-row items-center justify-center md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-transparent bg-clip-text bg-[#FF3F8F]">
            Play.
          </span>
          <span className="text-transparent bg-clip-text bg-neutral-900">
            Train.
          </span>
          <span className="text-transparent bg-clip-text bg-[#0586C8]">
            Prepare.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-sm lg:text-md font-bold text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Enhance logical reasoning, pattern recognition, and problem-solving skills with our scientifically designed game suite. Prepare for success with precision.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        > 
         <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="https://github.com/NishulDhakar/BlyncApp" target="_blank">
              Mobile App<ArrowRight className="ml-2 w-4 h-4" />
               {/* <span className="text-xs font-normal text-muted-foreground">Soon in playstore</span>  */}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
            <Link href="/capgemini-games">
              Capgemini Games <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>

          

        </motion.div>

        {/* <motion.a
          href="https://peerlist.io/nishuldhakar/project/cognitive-games-web"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="
    mt-12 inline-flex items-center justify-center
    rounded-2xl
    backdrop-blur-xl
    bg-black/40
    border border-white/10

    hover:bg-black/55 hover:scale-[1]
    transition-all duration-300
    
  "
        >
          <img
            src="https://peerlist.io/api/v1/projects/embed/PRJHP6LRJQR7OJLB63KDA6ELL86RQQ?showUpvote=true&theme=dark"
            alt="Cognitive Games Web on Peerlist"
            className="h-[72px] w-auto rounded-lg"
          />
        </motion.a> */}

        {/* Stats / Trust Indicators (Optional placeholder for professional look) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 pt-8 border-t border-[#111]/40 grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-2xl px-4 items-center justify-center text-center"
        >
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-foreground">4+</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Cognitive Games</p>
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-foreground">5k+</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xl md:text-2xl font-bold text-foreground">98%</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Improvement Rate</p>
          </div>
        </motion.div>
      </div>
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[800px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>
    </section>
  );
}
