"use client"

import CompanyGamesClient from '@/components/games/CompanyGamesClient'
import { GraduationCap } from 'lucide-react'

const CognizantGamesClient = () => (
    <CompanyGamesClient
        title="Cognizant Game-Based Aptitude Practice"
        description="Ace the Cognizant GenC puzzle round. Practice deductive logic, grid reasoning, and memory challenges designed to prepare you for the actual assessment."
        badgeIcon={GraduationCap}
        badgeText="GenC Elevate Prep"
        footerText="Updated for Cognizant 2025 Placement Season"
        gradientColor="via-blue-500/5"
        blobTopClass="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        blobBottomClass="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]"
    />
)

export default CognizantGamesClient
