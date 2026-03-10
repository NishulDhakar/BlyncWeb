"use client";

import { useState } from "react";
import { sendBroadcast } from "@/features/admin/actions";
import { toast } from "sonner"; // Assuming sonner is installed as per package.json

export default function BroadcastPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            toast.error("Please fill in both fields");
            return;
        }

        if (!confirm("Are you sure you want to send this message to ALL users?")) {
            return;
        }

        setLoading(true);
        try {
            const res = await sendBroadcast({ subject, message });
            if (res.success) {
                toast.success(`Message sent successfully to ${res.count} users!`);
                setSubject("");
                setMessage("");
            } else {
                toast.error("Failed to send message: " + res.error);
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 flex justify-center items-center">
            <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Admin Broadcast
                </h1>
                <p className="text-neutral-400 mb-8">
                    Send an email notification to all registered users.
                </p>

                <form onSubmit={handleSend} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Important Update..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            placeholder="We have exciting news..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform active:scale-95 ${loading
                                ? "bg-neutral-700 cursor-not-allowed text-neutral-500"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/20"
                            }`}
                    >
                        {loading ? "Sending..." : "Send Broadcast"}
                    </button>
                </form>
            </div>
        </div>
    );
}
