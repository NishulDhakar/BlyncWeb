"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import {
    Shield,
    Lock,
    Eye,
    Users,
    Mail,
    FileText,
    Smartphone,
    Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const EFFECTIVE_DATE = "June 17, 2026";
const LAST_UPDATED = "June 17, 2026";
const APP_NAME = "Blync";
const PACKAGE_NAME = "com.nishuldhakar.blync";
const DEVELOPER_NAME = "Nishul Dhakar";
const CONTACT_EMAIL = "nishul@cognitivegames.me";
const WEBSITE = "https://www.cognitivegames.me";

const sections = [
    {
        icon: <Info className="h-6 w-6" />,
        title: "1. About This Policy",
        content: [
            {
                subtitle: "Scope",
                text: `This Privacy Policy applies to the Android mobile application "${APP_NAME}" (package name: ${PACKAGE_NAME}), developed and published by ${DEVELOPER_NAME}. It describes how ${DEVELOPER_NAME} handles information in connection with your use of the ${APP_NAME} app. By installing or using ${APP_NAME}, you acknowledge that you have read and understood this policy.`,
            },
            {
                subtitle: "Nature of the App",
                text: `${APP_NAME} is an offline cognitive-training game for Android. It contains memory games, reaction tests, focus exercises, and reasoning challenges. The app does not require an internet connection, does not require you to create an account, and does not communicate with any remote server during normal use.`,
            },
        ],
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "2. Information Collection",
        content: [
            {
                subtitle: "No Personal Data Collected",
                text: `${APP_NAME} (${PACKAGE_NAME}) does not collect, store, transmit, or share any personally identifiable information (PII). We do not collect your name, email address, phone number, location, payment information, device identifiers, advertising IDs, or any other personal data.`,
            },
            {
                subtitle: "Local Game Data Only",
                text: `All game data — including your scores, progress, game history, and settings — is stored exclusively on your device using Android's local storage. This data never leaves your device and is not accessible to ${DEVELOPER_NAME} or any third party.`,
            },
            {
                subtitle: "No Automatic Data Collection",
                text: `${APP_NAME} does not use analytics SDKs, crash-reporting SDKs, or any background data-collection mechanism. No usage data, session data, or diagnostic data is collected or transmitted by the app.`,
            },
        ],
    },
    {
        icon: <Eye className="h-6 w-6" />,
        title: "3. Third-Party Services",
        content: [
            {
                subtitle: "No Third-Party SDKs",
                text: `${APP_NAME} does not integrate any third-party SDKs that collect data. There are no analytics libraries (e.g., Firebase Analytics, Google Analytics), no crash-reporting libraries (e.g., Crashlytics), and no social-login or identity-provider SDKs embedded in the app.`,
            },
            {
                subtitle: "No Backend Services",
                text: `The app does not connect to any backend server, API, or cloud service operated by ${DEVELOPER_NAME} or any third party. All functionality is self-contained and works fully offline.`,
            },
        ],
    },
    {
        icon: <Smartphone className="h-6 w-6" />,
        title: "4. Advertising",
        content: [
            {
                subtitle: "No Advertising",
                text: `${APP_NAME} does not display advertisements of any kind. There are no ad networks, no ad SDKs (including Google AdMob or any equivalent), and no tracking of your behavior for advertising purposes. Your usage of ${APP_NAME} is never used to serve you targeted or contextual ads.`,
            },
        ],
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "5. Children's Privacy",
        content: [
            {
                subtitle: "App Suitability",
                text: `${APP_NAME} is a cognitive-training game suitable for users of all ages. Because the app collects no personal data whatsoever, it is safe for children to use without parental concern about data privacy.`,
            },
            {
                subtitle: "COPPA Compliance",
                text: `${DEVELOPER_NAME} does not knowingly collect personal information from children under 13 years of age (or the applicable age threshold in your jurisdiction). Since ${APP_NAME} collects no personal data at all, it is fully compliant with the Children's Online Privacy Protection Act (COPPA) and equivalent regulations globally.`,
            },
            {
                subtitle: "Parental Notice",
                text: `If you are a parent or guardian and believe your child has somehow provided personal information through ${APP_NAME}, please contact ${DEVELOPER_NAME} immediately at ${CONTACT_EMAIL}. We will investigate and take appropriate corrective action promptly.`,
            },
        ],
    },
    {
        icon: <Lock className="h-6 w-6" />,
        title: "6. Data Security",
        content: [
            {
                subtitle: "On-Device Security",
                text: `Because ${APP_NAME} stores all data locally on your device, its security depends on the security of your Android device. ${DEVELOPER_NAME} recommends that you use a screen lock, keep your device's operating system updated, and follow standard Android security best practices.`,
            },
            {
                subtitle: "No Transmission Risk",
                text: `Since no personal data is transmitted over the internet by ${APP_NAME}, there is no risk of your data being intercepted in transit or exposed through a server-side breach. Your game data remains entirely under your control.`,
            },
            {
                subtitle: "Data Deletion",
                text: `You can delete all data stored by ${APP_NAME} at any time by uninstalling the application from your device. Uninstalling the app will permanently remove all locally stored game data. No data will remain on any ${DEVELOPER_NAME} server because no data is ever sent there.`,
            },
        ],
    },
    {
        icon: <FileText className="h-6 w-6" />,
        title: "7. User Rights",
        content: [
            {
                subtitle: "Your Control Over Your Data",
                text: `Since ${APP_NAME} does not collect or store any personal data on external servers, there is no personal data held by ${DEVELOPER_NAME} to access, correct, export, or delete on your behalf. All game data resides locally on your device and is fully within your control.`,
            },
            {
                subtitle: "GDPR (EU/EEA Users)",
                text: `For users in the European Union or European Economic Area: Because ${APP_NAME} does not collect personal data, ${DEVELOPER_NAME} does not act as a data controller or data processor of your personal information. Accordingly, the rights available under the General Data Protection Regulation (GDPR) — such as the right of access, rectification, erasure, and portability — are fulfilled by default, as no personal data is held.`,
            },
            {
                subtitle: "CCPA (California Users)",
                text: `For California residents: ${DEVELOPER_NAME} does not sell, share, or disclose any personal information because none is collected by ${APP_NAME}. You have no need to opt out of data sales, as no such activity occurs.`,
            },
        ],
    },
    {
        icon: <Mail className="h-6 w-6" />,
        title: "8. Contact Information",
        content: [
            {
                subtitle: "How to Reach Us",
                text: `If you have any questions, concerns, or requests regarding this Privacy Policy or the data practices of ${APP_NAME} (${PACKAGE_NAME}), please contact ${DEVELOPER_NAME} by email at ${CONTACT_EMAIL}. You can also visit the developer's website at ${WEBSITE}. All privacy inquiries will be responded to within 48 hours on business days.`,
            },
        ],
    },
    {
        icon: <FileText className="h-6 w-6" />,
        title: "9. Changes to This Policy",
        content: [
            {
                subtitle: "Policy Updates",
                text: `${DEVELOPER_NAME} may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last Updated" date. If changes are material, ${DEVELOPER_NAME} will make reasonable efforts to notify users (for example, via a notice on the Google Play Store listing for ${APP_NAME}). Continued use of ${APP_NAME} after changes are posted constitutes your acceptance of the revised policy.`,
            },
            {
                subtitle: "Effective Date",
                text: `This Privacy Policy is effective as of ${EFFECTIVE_DATE} and was last updated on ${LAST_UPDATED}.`,
            },
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
                <Container>
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
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Your Privacy Matters
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Privacy Policy for Blync
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            This Privacy Policy describes how{" "}
                            <strong>{DEVELOPER_NAME}</strong> handles your
                            information in connection with the{" "}
                            <strong>{APP_NAME}</strong> Android application
                            (package name:{" "}
                            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                                {PACKAGE_NAME}
                            </code>
                            ). <strong>{APP_NAME}</strong> is an offline
                            cognitive-training game — it collects no personal
                            data.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                            <p>
                                <span className="font-medium">
                                    Effective Date:
                                </span>{" "}
                                {EFFECTIVE_DATE}
                            </p>
                            <span className="hidden sm:block">·</span>
                            <p>
                                <span className="font-medium">
                                    Last Updated:
                                </span>{" "}
                                {LAST_UPDATED}
                            </p>
                            <span className="hidden sm:block">·</span>
                            <p>
                                <span className="font-medium">Developer:</span>{" "}
                                {DEVELOPER_NAME}
                            </p>
                        </div>
                    </motion.div>
                </Container>

                {/* Background decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            </section>

            {/* Summary Banner */}
            <section className="py-6">
                <Container className="max-w-5xl">
                    <motion.div
                        className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex gap-4 items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Shield className="h-6 w-6 text-green-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                                Simple Summary
                            </p>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                <strong>{APP_NAME}</strong> is a fully offline
                                Android app. It <strong>does not</strong>{" "}
                                collect, transmit, or store any personal
                                information on external servers. No accounts, no
                                ads, no analytics, no tracking — ever. All game
                                data stays on your device and is deleted when
                                you uninstall the app.
                            </p>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Content Sections */}
            <section className="py-12 md:py-16">
                <Container className="max-w-5xl">
                    <div className="space-y-8">
                        {sections.map((section, sectionIndex) => (
                            <motion.div
                                key={sectionIndex}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: sectionIndex * 0.05 }}
                            >
                                <Card className="border-border/40 bg-card/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                                {section.icon}
                                            </div>
                                            {section.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {section.content.map(
                                            (item, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className="space-y-2"
                                                >
                                                    <h3 className="text-base font-semibold text-foreground">
                                                        {item.subtitle}
                                                    </h3>
                                                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <motion.div
                        className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className="text-2xl font-bold mb-3">
                            Questions About Your Privacy?
                        </h3>
                        <p className="text-muted-foreground mb-4 max-w-2xl mx-auto text-sm leading-relaxed">
                            If you have any questions about this Privacy Policy
                            or the <strong>{APP_NAME}</strong> app (
                            {PACKAGE_NAME}), please reach out to{" "}
                            {DEVELOPER_NAME}.
                        </p>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                            <Mail className="h-4 w-4" />
                            {CONTACT_EMAIL}
                        </a>
                        <p className="mt-6 text-xs text-muted-foreground">
                            This policy applies to the Android application{" "}
                            <strong>{APP_NAME}</strong> ({PACKAGE_NAME}) by{" "}
                            {DEVELOPER_NAME}. Last updated {LAST_UPDATED}.
                        </p>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
