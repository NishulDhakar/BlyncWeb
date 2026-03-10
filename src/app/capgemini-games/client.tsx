"use client"

import CompanyGamesClient from '@/components/games/CompanyGamesClient'
import { Users } from 'lucide-react'

const CapgeminiGamesClient = () => (
    <CompanyGamesClient
        title="Capgemini Game-Based Aptitude Practice"
        description="Challenge your mind with our suite of specialized cognitive games designed exactly like the real Capgemini and Cognizant placement assessments."
        badgeIcon={Users}
        badgeText="1,700+ Students Practicing"
        footerText="Updated for 2025 Placement Season"
    />
)

export default CapgeminiGamesClient
