"use client"

import GamesCard from '@/components/games/GamesCard'
import { Gamepad2, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import BackToDashboard from '@/components/common/BackToDashboard'

interface CompanyGamesClientProps {
    title: string
    description: string
    badgeIcon: LucideIcon
    badgeText: string
    footerText: string
    backgroundImage?: string
    gradientColor?: string
    blobTopClass?: string
    blobBottomClass?: string
}

const CompanyGamesClient = ({
    title,
    description,
    badgeIcon: BadgeIcon,
    badgeText,
    footerText,
    // backgroundImage = '/store.jpg',
    gradientColor = 'via-primary/5',
    blobTopClass = 'absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]',
    blobBottomClass = 'absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px]',
}: CompanyGamesClientProps) => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* <div className="fixed inset-0">
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div> */}
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className={blobTopClass} />
                <div className={blobBottomClass} />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 relative z-10">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12 flex justify-between items-center"
                >
                    <BackToDashboard />
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 border border-white/20">
                        <BadgeIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{badgeText}</span>
                    </div>
                </motion.div>

                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative inline-block"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-6">
                            {title}
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto font-light text-base leading-relaxed"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Games Grid Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${gradientColor} to-transparent blur-3xl -z-10`} />
                    <GamesCard />
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="mt-20 text-center"
                >
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Gamepad2 className="h-4 w-4 text-white" />
                        <span className="text-white">{footerText}</span>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default CompanyGamesClient
