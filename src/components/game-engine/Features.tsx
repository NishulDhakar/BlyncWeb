"use client";

import { PixelCard } from "./PixelComponents";
import { MousePointer2, ImageUp, Globe, Code2 } from "lucide-react";

const features = [
    {
        title: "Drag & Drop",
        description: "Design levels intuitively. No complex scripting needed.",
        icon: <MousePointer2 className="w-8 h-8 text-cyan-400" />,
    },
    {
        title: "Sprite Import",
        description: "Upload your pixel art spritesheets and auto-slice them.",
        icon: <ImageUp className="w-8 h-8 text-purple-400" />,
    },
    {
        title: "Web Export",
        description: "Publish to Itch.io or your own site in one click.",
        icon: <Globe className="w-8 h-8 text-green-400" />,
    },
    {
        title: "Visual Logic",
        description: "Connect nodes to create gameplay mechanics visually.",
        icon: <Code2 className="w-8 h-8 text-yellow-400" />,
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 px-6 bg-[#12121e]">
            <div className="max-w-6xl mx-auto">
                <h2 className="font-game text-3xl md:text-4xl text-center text-white mb-16 shadow-purple-500 drop-shadow-lg">
                    Power Up Your Workflow
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <PixelCard key={idx} className="h-full hover:-translate-y-2 transition-transform duration-300">
                            <div className="mb-4 bg-white/5 w-16 h-16 rounded-lg flex items-center justify-center border-2 border-white/10">
                                {feature.icon}
                            </div>
                            <h3 className="font-game text-lg text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </PixelCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
